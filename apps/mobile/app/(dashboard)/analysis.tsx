import IconAction from "@/components/button/IconAction";
import Body from "@/components/label/Body";
import Caption from "@/components/label/Caption";
import Title from "@/components/label/Title";
import { audioMutations } from "@/repos/audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Analysis() {
  const router = useRouter()
  const { audioId: id, s3_key } = useLocalSearchParams()

  const audioId = useMemo(() => Array.isArray(id) ? id[0] : id, [id])

  const deleteAudio = audioMutations.useDelete()

  const handleDelete = () => {
    try {
      deleteAudio.mutate(audioId, {
        onSuccess: () => {
          Alert.alert('Success', 'Audio deleted successfully')
          router.back()
        },
        onError: (error) => {
          Alert.alert('Error', error.message)
        }
      })
    } catch (error) {
      console.error('Failed to delete audio', error)
      Alert.alert('Error', 'Failed to delete audio')
    }
  }
  
  return (
    <SafeAreaView className="flex-1 m-1 justify-between">
      <View>
        <Title className="text-3xl text-center text-dark-grey">ANALYSIS</Title>

        <Caption className="text-xl text-center text-dark-grey">{s3_key}</Caption>

        <View className="mx-10 my-5 p-4 gap-0.5 bg-off-grey rounded-xl text-dark-grey">
          <Title className="text-xl mb-2">Uploaded File Details</Title>
          <Body>S3 Key - S3 Url</Body>
          <Body>Duration: 10 seconds</Body>
          <Body>File Format: WAV</Body>
          <Body>Created At: 2025-01-01 12:00:00</Body>
        </View>

        <View className="mx-10 my-5 p-4 gap-0.5 bg-off-grey rounded-xl text-dark-grey">
          <Title className="text-xl">Feedback</Title>
          <Caption className="text-lg mb-4">Powered by AWS Sagemaker AI</Caption>

          <Body>Pitch: </Body>
          <Body>Tone: </Body>
          <Body>Frequency: </Body>
          <Body>Tempo: </Body>
        </View>

        <View className="mx-10 my-5 p-4 gap-0.5 bg-off-grey rounded-xl text-dark-grey">
          <Title className="text-xl">Summary</Title>
          <Caption className="text-lg mb-4">Powered by AWS Sagemaker AI</Caption>

          <Body>Tempo: </Body>
        </View>
      </View>

      <View className="mx-10 my-5 flex-row">
        <IconAction source="trash" title="Delete" onPress={handleDelete} />
      </View>
    </SafeAreaView>
  )
}