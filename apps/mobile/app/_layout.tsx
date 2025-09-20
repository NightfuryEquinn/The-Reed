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
import { tokenStorage, userStorage } from "@/repos/store";

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

  useEffect(() => {
    async function checkSession() {
      if (loaded || error) {
        const session = await fetchAuthSession();

        if (session.tokens) {
          await userStorage.setUser({
            id: session.tokens.idToken?.payload?.sub || '',
            email: session.tokens.idToken?.payload?.email?.toString() || '',
            username: session.tokens.idToken?.payload?.preferred_username?.toString() || '',
            userType: session.tokens.idToken?.payload["custom:roles"]?.toString() || '',
          })

          await tokenStorage.setToken(session.tokens.accessToken?.toString() || '')

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
