import { AlegreyaSans_100Thin, AlegreyaSans_400Regular, AlegreyaSans_700Bold, useFonts } from "@expo-google-fonts/alegreya-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../styles/global.css";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loaded, error] = useFonts({
    AlegreyaSans_100Thin,
    AlegreyaSans_400Regular,
    AlegreyaSans_700Bold
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{
      animation: 'fade',
      animationDuration: 250,
      headerShown: false,
    }}>
      <View className="flex-1 m-10">{ children }</View>
    </Stack>
  );
}
