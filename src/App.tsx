import "./App.scss";

import React, { useEffect, useState } from "react";

import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./Header";
import { MyViewer } from "./MyViewer";

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

  return (
    <div className="itwin-viewer-sample">
      <Header
        handleLogin={onLoginClick}
        loggedIn={isAuthorized}
        handleLogout={onLogoutClick}
      />
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        isAuthorized && <MyViewer />
      )}
    </div>
  );
};

export default App;
