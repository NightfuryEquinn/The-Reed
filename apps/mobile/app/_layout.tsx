import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

import { Amplify } from "aws-amplify";
import { awsconfig } from "@/repos/auth/amplify";
Amplify.configure(awsconfig);

import { AlegreyaSans_100Thin, AlegreyaSans_400Regular, AlegreyaSans_700Bold, useFonts } from "@expo-google-fonts/alegreya-sans";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchAuthSession } from "aws-amplify/auth";
import { idTokenStorage, tokenStorage, userStorage } from "@/repos/store";
import { Alert } from "react-native";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
      },
      mutations: { retry: 1 }
    }
  })
  
  const [loaded, error] = useFonts({
    AlegreyaSans_100Thin,
    AlegreyaSans_400Regular,
    AlegreyaSans_700Bold
  })

  const checkTokenExpiry = (token?: string) => {
    if (!token) return true

    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )

    const expo = payload.exp * 1000
    return Date.now() > expo
  }

  useEffect(() => {
    async function checkSession() {
      if (loaded || error) {
        const session = await fetchAuthSession();

        if (session.tokens) {
          const idToken = session.tokens.idToken?.toString() || '';
          const accessToken = session.tokens.accessToken?.toString() || '';

          if (checkTokenExpiry(idToken) || checkTokenExpiry(accessToken)) {
            await userStorage.removeUser()
            await tokenStorage.removeToken()
            await idTokenStorage.removeIdToken()

            router.push('/login')

            Alert.alert('Session expired', 'Please login again')
            return
          }

          await userStorage.setUser({
            id: session.tokens.idToken?.payload?.sub || '',
            email: session.tokens.idToken?.payload?.email?.toString() || '',
            username: session.tokens.idToken?.payload?.preferred_username?.toString() || '',
            userType: session.tokens.idToken?.payload["custom:roles"]?.toString() || '',
          })

          await tokenStorage.setToken(session.tokens.accessToken?.toString() || '')
          await idTokenStorage.setIdToken(session.tokens.idToken?.toString() || '')

          router.push('/dashboard')
        } else {
          router.push('/login')
        }

        SplashScreen.hideAsync();
      }
    }

    checkSession();
  }, [loaded, error])

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{
        animation: 'fade',
        animationDuration: 250,
        headerShown: false,
      }} />
    </QueryClientProvider>
  );
}
