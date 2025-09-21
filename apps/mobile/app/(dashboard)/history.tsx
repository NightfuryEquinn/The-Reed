import Body from "@/components/label/Body";
import Title from "@/components/label/Title";
import { audioQueries } from "@/repos/audio";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, Alert, FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
  const router = useRouter()

  const { data, isLoading, refetch, isRefetching } = useQuery({
    ...audioQueries.useFetch(),
    refetchOnMount: 'always'
  })

  const handleView = (
    audioId: string,
    s3_key: string
  ) => {
    router.push({
      pathname: '/analysis',
      params: {
        audioId,
        s3_key
      }
    })
  }

  const handleRefresh = async () => {
    try {
      await refetch()
    } catch (error) {
      console.error("Failed to refresh history", error)
      Alert.alert('Error', 'Failed to refresh history')
    }
  }

  if (isLoading) {
    return <SafeAreaView className="flex-1 items-center justify-center">
      <ActivityIndicator size='large' />
    </SafeAreaView>
  }

  return (
    <SafeAreaView className="flex-1 m-1">
      <Title className="text-3xl text-center text-dark-grey">HISTORY</Title>

      { data && data.audio.length === 0 ? 
        <View className="flex-1 items-center justify-center">
          <Title className="text-dark-grey text-2xl">No history found</Title>
        </View>
      :
        <View className="flex-1 m-10">
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-2" />}
            data={data?.audio}
            refreshControl={
              <RefreshControl 
                refreshing={isRefetching}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => (
              <View className="p-5 bg-dark-grey-brown rounded-xl flex-row items-center justify-between">
                <View className="flex-1 pr-6 gap-0.5">
                  <Title className="text-off-white text-ellipsis text-nowrap line-clamp-1">{item.s3_key}</Title>
                  <Body className="text-off-white">Duration: {item.duration} seconds</Body>
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  className="px-4 py-2 rounded-xl bg-off-grey"
                  onPress={() => {
                    handleView(item.id.toString(), item.s3_key)
                  }}
                >
                  <Body className="text-dark-grey-brown">View</Body>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      }
    </SafeAreaView>
  )
}