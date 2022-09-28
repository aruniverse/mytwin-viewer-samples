import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import { AccessToken } from "@itwin/core-bentley";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken?: AccessToken;
  authClient?: BrowserAuthorizationClient;
}

interface Children {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: Children) => {
  const [accessToken, setAccessToken] = useState<AccessToken>();

  const authClient = useMemo(() => {
    if (!process.env.IMJS_AUTH_CLIENT_CLIENT_ID) {
      throw new Error(
        "Please add a valid client ID in the .env.local file and restart the application"
      );
    }
    const scopes = ["imodels:read", "imodelaccess:read", "realitydata:read"];
    const redirectUri = `${window.location.origin}/signin-callback`;
    const postSignoutRedirectUri = window.location.origin;

    const client = new BrowserAuthorizationClient({
      clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID,
      redirectUri,
      postSignoutRedirectUri,
      scope: scopes.join(" "),
      responseType: "code",
    });
    client.onAccessTokenChanged.addListener((token?: AccessToken) => {
      setAccessToken(token);
    });
    return client;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await authClient.signInSilent();
      } catch {
        await authClient.signIn();
      }
    };
    initAuth().catch(console.error);
  }, [authClient]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        authClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContext");
  }
  return context;
};
