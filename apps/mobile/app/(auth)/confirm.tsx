import Action from "@/components/button/Action";
import Input from "@/components/input/Input";
import Title from "@/components/label/Title";
import { confirmSignUp } from "aws-amplify/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Confirm() {
  const router = useRouter();

  const { email } = useLocalSearchParams<{ email: string }>();
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ 
        confirmationCode,
        username: email,
      });

      router.push('/login')

    } catch (error: any) {
      console.log("Confirm error:", error.message || error);
    }
  }

  return (
    <SafeAreaView className="flex-1 m-10 items-center">
      <Image
        source={require("../../assets/logo.png")}
        className="w-60 h-60 mb-10 rounded-xl"
        resizeMode="cover"
      />

      <Title className="pt-2 pb-20 text-dark-grey text-2xl">Confirm your email</Title>

      <View className="w-full gap-4">
        <Input 
          placeholder="Confirmation Code"
          example="123456"
          onChangeText={setConfirmationCode}
        />
      </View>

      <View className="mt-10 flex-row">
        <Action text="Confirm" onPress={handleConfirm} />
      </View>
    </SafeAreaView>
  )
}