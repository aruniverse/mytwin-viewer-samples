import {
  BrowserAuthorizationCallbackHandler,
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@bentley/frontend-authorization-client";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";

class AuthorizationClient {
  private static _oidcClient: BrowserAuthorizationClient;

  public static get oidcClient(): BrowserAuthorizationClient {
    return this._oidcClient;
  }

  public static async initializeOidc(): Promise<void> {
    if (this._oidcClient) {
      return;
    }

    const defaultScopes = [
      "openid",
      "email",
      "profile",
      "organization",
      "imodelhub",
      "context-registry-service:read-only",
      "product-settings-service",
      "general-purpose-imodeljs-backend",
      "imodeljs-router",
      "urlps-third-party",
    ];
    const extraScopes = (process.env.IMJS_AUTH_CLIENT_SCOPES ?? "").split(" ");
    const scopes = [...new Set([...defaultScopes, ...extraScopes])];

    const clientId = process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "imodeljs-spa-samples-2686";
    const { origin } = window.location;

    // authority is optional and will default to Production IMS
    const oidcConfiguration: BrowserAuthorizationClientConfiguration = {
      clientId,
      redirectUri: `${origin}/signin-oidc`,
      postSignoutRedirectUri: `${origin}/signout-oidc`,
      scope: scopes.join(" "),
      responseType: "code",
    };

    await BrowserAuthorizationCallbackHandler.handleSigninCallback(
      oidcConfiguration.redirectUri
    );

    this._oidcClient = new BrowserAuthorizationClient(oidcConfiguration);
  }

  public static async signIn(): Promise<void> {
    await this.oidcClient.signIn(new FrontendRequestContext());
  }

  public static async signInSilent(): Promise<void> {
    await this.oidcClient.signInSilent(new FrontendRequestContext());
  }

  public static async signOut(): Promise<void> {
    await this.oidcClient.signOut(new FrontendRequestContext());
  }
}

export default AuthorizationClient;
