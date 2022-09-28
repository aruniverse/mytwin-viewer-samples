import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";

import { BrowserAuthorizationCallbackHandler } from "@itwin/browser-authorization";

import { App } from "./App";
import { AuthProvider } from "./AuthProvider";
import * as serviceWorker from "./serviceWorker";

// Do not render full application if we are handling OIDC callback
const redirectUrl = new URL(`${window.location.origin}/signin-callback`);
if (redirectUrl.pathname === window.location.pathname) {
  BrowserAuthorizationCallbackHandler.handleSigninCallback(
    redirectUrl.toString()
  ).catch(console.error);
} else {
  ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <div style={{ height: "100vh" }}>
          <App />
        </div>
      </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
