import { Viewer } from "@bentley/itwin-viewer-react";
import React, { useEffect } from "react";
import AuthorizationClient from "./AuthorizationClient";

export const MyViewer = () => {
  useEffect(() => {
    if (!process.env.IMJS_CONTEXT_ID) {
      throw new Error(
        "Please add a valid context ID in the .env file and restart the application"
      );
    }
    if (!process.env.IMJS_IMODEL_ID) {
      throw new Error(
        "Please add a valid iModel ID in the .env file and restart the application"
      );
    }
  }, []);

  return (
    <Viewer
      contextId={process.env.IMJS_CONTEXT_ID ?? ""}
      iModelId={process.env.IMJS_IMODEL_ID ?? ""}
      authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
    />
  );
};
