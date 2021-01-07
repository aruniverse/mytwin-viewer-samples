import { IModelJsViewProvider } from "@bentley/imodel-react-hooks";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { Viewer } from "@bentley/itwin-viewer-react";
import { UiItemsManager } from "@bentley/ui-abstract";
import React from "react";
import AuthorizationClient from "./AuthorizationClient";
import { MyMarkerToolProvider } from "./ui/MarkerTool/UiProvider";

export const MyViewer = () => {
  const handleOnIModelAppInit = () => {
    console.log("IModelApp initialized");
    IModelApp.uiAdmin.updateFeatureFlags({ allowKeyinPalette: true });
  };

  const handleOnIModelConnected = () => {
    console.log("connected to iModel");
    UiItemsManager.register(new MyMarkerToolProvider(IModelApp.i18n));
  };

  return (
    <IModelJsViewProvider>
      <Viewer
        contextId={process.env.IMJS_CONTEXT_ID ?? ""}
        iModelId={process.env.IMJS_IMODEL_ID ?? ""}
        authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
        onIModelAppInit={handleOnIModelAppInit}
        onIModelConnected={handleOnIModelConnected}
      />
    </IModelJsViewProvider>
  );
};
