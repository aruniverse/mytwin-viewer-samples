import { createBrowserHistory } from "history";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { FillCentered } from "@itwin/core-react";
import { GeoTools } from "@itwin/geo-tools-react";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { MeasureTools } from "@itwin/measure-tools-react";
import { PropertyGridManager } from "@itwin/property-grid-react";
import { TreeWidget } from "@itwin/tree-widget-react";
import {
  useWebViewerInitializer,
  ViewerAuthorizationClient,
} from "@itwin/web-viewer-react";

import { useAuth } from "./AuthProvider";
import { WrappedViewer } from "./WrappedViewer";

const history = createBrowserHistory();

interface MyAppProps {
  authClient: ViewerAuthorizationClient;
}

export const MyApp = ({ authClient }: MyAppProps) => {
  const [iTwinId, setITwinId] = useState(process.env.IMJS_ITWIN_ID ?? "");
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID ?? "");
  const [changeSetId, setChangeSetId] = useState(
    process.env.IMJS_CHANGESET_ID ?? ""
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    } else {
      if (!process.env.IMJS_ITWIN_ID) {
        throw new Error(
          "Please add a valid iTwin ID in the .env file and restart the application or add it to the iTwinId query parameter in the url and refresh the page. See the README for more information."
        );
      }
    }
    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    } else {
      if (!process.env.IMJS_IMODEL_ID) {
        throw new Error(
          "Please add a valid iModel ID in the .env file and restart the application or add it to the iModelId query parameter in the url and refresh the page. See the README for more information."
        );
      }
    }
    if (urlParams.has("changesetId")) {
      setChangeSetId(urlParams.get("changesetId") as string);
    }
  }, []);

  useEffect(() => {
    if (iTwinId && iModelId) {
      let url = `?iTwinId=${iTwinId}&iModelId=${iModelId}`;
      if (changeSetId) {
        url = `${url}&changesetId=${changeSetId}`;
      }
      history.push(url);
    }
  }, [iTwinId, iModelId, changeSetId]);

  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    await GeoTools.initialize();
  }, []);

  const viewerProps = useMemo(
    () => ({
      authClient,
      iTwinId,
      iModelId,
      changeSetId,
      enablePerformanceMonitors: true,
      onIModelAppInit,
    }),
    [authClient, changeSetId, iModelId, iTwinId, onIModelAppInit]
  );

  // HACK: need to initialize IModelApp earlier so we can wrap <Viewer /> with <IModelJsViewProvider />
  const initialized = useWebViewerInitializer(viewerProps);

  return initialized ? (
    <WrappedViewer {...viewerProps} />
  ) : (
    <>{"initializing"}</>
  );
};

export const App = () => {
  const { authClient } = useAuth();
  return authClient ? (
    <MyApp authClient={authClient} />
  ) : (
    <FillCentered>
      <SvgIModelLoader style={{ height: "64px", width: "64px" }} />
    </FillCentered>
  );
};
