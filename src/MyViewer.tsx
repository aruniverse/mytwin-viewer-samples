import { IModelSelect } from "@bentley/imodel-select-react";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { Viewer, ViewerBackstageItem, ViewerFrontstage } from "@bentley/itwin-viewer-react";
import { FrontstageManager } from "@bentley/ui-framework";
import React, { useEffect, useState } from "react";
import AuthorizationClient from "./AuthorizationClient";
import { IModelSelectFrontstage } from "./IModelSelectFrontstage";

export const MyViewer = () => {
  const [contextId, setContextId] = useState(
    localStorage.getItem("mytwin-viewer.contextId") ?? process.env.IMJS_CONTEXT_ID
  );
  const [iModelId, setIModelId] = useState(
    localStorage.getItem("mytwin-viewer.iModelId") ?? process.env.IMJS_IMODEL_ID
  );

  useEffect(() => {
    // this one is used to update the same document
    const myLocalStorageListener = () => {
      const _contextId = localStorage.getItem("mytwin-viewer.contextId");
      const _iModelId = localStorage.getItem("mytwin-viewer.iModelId");
      if (_contextId && _contextId !== contextId) {
        setContextId(_contextId);
      }
      if (_iModelId && _iModelId !== iModelId) {
        setIModelId(_iModelId);
      }
    };

    // this one is used to update another document
    const genericLocalStorageListener = (ev: StorageEvent) => {
      if (ev.storageArea === localStorage) {
        myLocalStorageListener();
      }
    };

    window.addEventListener("mytwin-viewer.localStorageUpdated", myLocalStorageListener);
    window.addEventListener("storage", genericLocalStorageListener);
    return () => {
      window.removeEventListener("mytwin-viewer.localStorageUpdated", myLocalStorageListener);
      window.removeEventListener("storage", genericLocalStorageListener);
    };
  });

  const handleOnIModelAppInit = async () => {
    console.log("IModelApp initialized");
    IModelApp.uiAdmin.updateFeatureFlags({ allowKeyinPalette: true });
    await IModelSelect.initialize(IModelApp.i18n);
  };

  const handleOnIModelConnected = () => {
    console.log("IModel Connected");
    IModelApp.viewManager.onSelectedViewportChanged.addListener(() =>
      IModelApp.tools.run("View.Fit", IModelApp.viewManager.selectedView, true)
    );
  };

  const openIModelSelector = async () => {
    const frontstageDef = FrontstageManager.findFrontstageDef("IModelSelector");
    await FrontstageManager.setActiveFrontstageDef(frontstageDef);
  };

  const frontstages: ViewerFrontstage[] = [
    {
      provider: new IModelSelectFrontstage(),
      default: !contextId && !iModelId
    },
  ];

  const backstageItems: ViewerBackstageItem[] = [
    {
      id: "iModelSelector",
      execute: openIModelSelector,
      groupPriority: 200,
      itemPriority: 10,
      labeli18nKey: "backstage.selectIModel",
      label: "backstage.selectIModel",
    },
  ];

  return (
    <Viewer
      contextId={contextId}
      iModelId={iModelId}
      authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
      onIModelAppInit={handleOnIModelAppInit}
      onIModelConnected={handleOnIModelConnected}
      frontstages={frontstages}
      backstageItems={backstageItems}
    />
  );
};
