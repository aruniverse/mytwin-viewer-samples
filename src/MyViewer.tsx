import { Viewer } from "@bentley/itwin-viewer-react";
import React from "react";
import AuthorizationClient from "./AuthorizationClient";

export const MyViewer = () => {
  return (
    <Viewer
      contextId={process.env.IMJS_CONTEXT_ID ?? ""}
      iModelId={process.env.IMJS_IMODEL_ID ?? ""}
      authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
    />
  );
};
