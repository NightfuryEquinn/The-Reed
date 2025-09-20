import Action from "@/components/button/Action";
import Input from "@/components/input/Input";
import Title from "@/components/label/Title";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signIn({
        username: email,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        }
      });

      router.push('/dashboard')
    } catch (error: any) {
      console.log("Login error:", error.message || error);
    }
  }

  return (
    <SafeAreaView className="flex-1 m-10 items-center">
      <Image
        source={require("../../assets/logo.png")}
        className="w-60 h-60 mb-10 rounded-xl"
        resizeMode="cover"
      />

      <Title className="pt-2 pb-20 text-dark-grey text-2xl">Login to your Reed Account</Title>

      <View className="w-full gap-4">
        <Input 
          placeholder="Email Address"
          example="reed.doe@bassoon.ai.com"
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          example="Password@123"
          onChangeText={setPassword}
        />
      </View>

      <View className="mt-10 flex-row">
        <Action text="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  )
}