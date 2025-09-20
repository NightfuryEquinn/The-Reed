import { ResourcesConfig } from "aws-amplify";

export const awsconfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID || "",
      userPoolClientId: process.env.EXPO_PUBLIC_CLIENT_ID || "",
    }
  }
};