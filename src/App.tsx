import "./App.scss";

import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./Header";
import { Viewer } from "@bentley/itwin-viewer-react";
import TankMarker from "./TankMarker";
import { IModelJsViewProvider } from "@bentley/imodel-react-hooks";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    AuthorizationClient.oidcClient
      ? AuthorizationClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const initOidc = async () => {
      if (!AuthorizationClient.oidcClient) {
        await AuthorizationClient.initializeOidc();
      }

      try {
        // attempt silent signin
        await AuthorizationClient.signInSilent();
        setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await AuthorizationClient.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await AuthorizationClient.signOut();
    setIsAuthorized(false);
  };

  const [imjsInited, setImjsInited] = useState(false);
  const [tankParamType, setTankParamType] = useState<"level" | "pressure">("level");

  return (
    <div className="itwin-viewer-sample" onClick={(ev) => {
      setTankParamType(prev => prev === "level" ? "pressure" : "level");
    }}>
      <Header
        handleLogin={onLoginClick}
        loggedIn={isAuthorized}
        handleLogout={onLogoutClick}
      />
      {isLoggingIn
      ? <span>"Logging in...."</span>
      : isAuthorized && <>
          <Viewer
            contextId={process.env.IMJS_CONTEXT_ID!}
            iModelId={process.env.IMJS_IMODEL_ID!}
            authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
            onIModelAppInit={() => setImjsInited(true)}
          />
          {imjsInited && <IModelJsViewProvider><TankMarker tankParamType={tankParamType} /></IModelJsViewProvider>}
        </>
      }
    </div>
  );
};

export default App;
