import Action from "@/components/button/Action";
import Dropdown from "@/components/input/Dropdown";
import Input from "@/components/input/Input";
import Title from "@/components/label/Title";
import { authMutations } from "@/repos/auth";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const router = useRouter();

  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const register = authMutations.useRegister();

  const handleRegister = async () => {
    try {
      register.mutate({
        email,
        password,
        role,
        username,
      }, {
        onSuccess: async () => {
          // Register with AWS Cognito
          await signUp({
            username: email,
            password,
            options: {
              userAttributes: {
                email,
                preferred_username: username,
                "custom:roles": role,
              },
            },
          });

          router.push({
            pathname: "/(auth)/confirm",
            params: { email },
          });
        },
        onError: (error: any) => {
          console.error('Registration error:', error.data.message || error);
        }
      });
    } catch (error: any) {
      console.error('Registration failed:', error.message || error);
    }
  }
  
  return (
    <SafeAreaView className="flex-1 m-10 items-center">
      <Image
        source={require("../../assets/logo.png")}
        className="w-60 h-60 mb-10 rounded-xl"
        resizeMode="cover"
      />

      <Title className="pb-10 text-dark-grey text-2xl">Create a Reed Account</Title>

      <View className="w-full gap-4">
        <Input 
          placeholder="Username"
          example="Reed Doe"
          onChangeText={setUsername}
        />

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

        <Input
          placeholder="Confirm Password"
          example="Password@123"
          onChangeText={setConfirmPassword}
        />

        <Dropdown 
          role={role}
          setRole={setRole}
        />
      </View>

      <View className="mt-10 flex-row gap-10 w-full justify-center">
        <Action 
          text="To Login" 
          onPress={() => router.push('/(auth)/login')} 
        />

        <Action 
          text="Register" 
          onPress={handleRegister} 
          disabled={password !== confirmPassword || register.isPending || !email || !password || !confirmPassword || !username || !role} 
        />
      </View> 
    </SafeAreaView>
  )
}