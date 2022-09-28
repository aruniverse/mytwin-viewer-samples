import { createBrowserHistory } from "history";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { FillCentered } from "@itwin/core-react";
import { GeoTools } from "@itwin/geo-tools-react";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { MeasureTools } from "@itwin/measure-tools-react";
import { PropertyGridManager } from "@itwin/property-grid-react";
import { TreeWidget } from "@itwin/tree-widget-react";
import {
  ConnectedViewerProps,
  useWebViewerInitializer,
} from "@itwin/web-viewer-react";

import { MyViewer } from "./MyViewer";
import { TokenServerAuthClient } from "./TokenServerClient";

const history = createBrowserHistory();

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState("");
  const authClient = useMemo(() => new TokenServerAuthClient(), []);
  useEffect(() => {
    const init = async () => {
      await authClient.initialize();
      const token = await authClient.getAccessToken();
      setAccessToken(token);
    };
    init().catch(console.error);
  }, [authClient]);

  const [connectedViewerProps, setConnectedViewerProps] =
    useState<ConnectedViewerProps>({
      iTwinId: "9eaa080f-07af-461d-b221-0f23f0256088",
      iModelId: "51ffd4a8-d83f-47ca-8d83-713a323dbd68",
      changeSetId: "",
    });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const iTwinId = urlParams.get("iTwinId") ?? "";
    const iModelId = urlParams.get("iModelId") ?? "";
    const changeSetId = urlParams.get("changeSetId") ?? "";
    if (iTwinId && iModelId) {
      setConnectedViewerProps({
        iTwinId,
        iModelId,
        changeSetId,
      });
    }
  }, []);

  useEffect(() => {
    if (connectedViewerProps) {
      let url = `?iTwinId=${connectedViewerProps.iTwinId}&iModelId=${connectedViewerProps.iModelId}`;
      if (connectedViewerProps.changeSetId) {
        url = `${url}&changeSetId=${connectedViewerProps.changeSetId}`;
      }
      history.push(url);
    }
  }, [connectedViewerProps]);

  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    await GeoTools.initialize();
  }, []);

  // HACK: need to initialize IModelApp earlier so we can wrap <Viewer /> with <IModelJsViewProvider />
  useWebViewerInitializer({
    ...connectedViewerProps,
    authClient,
    enablePerformanceMonitors: true,
    onIModelAppInit,
  });

  return (
    <div style={{ height: "100vh" }}>
      {!accessToken && (
        <FillCentered>
          <SvgIModelLoader style={{ height: "64px", width: "64px" }} />
        </FillCentered>
      )}
      {accessToken && (
        <MyViewer authClient={authClient} {...connectedViewerProps} />
      )}
    </div>
  );
};

export default App;
