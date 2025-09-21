import { queryOptions, useMutation } from "@tanstack/react-query"
import { audioControllerDelete, audioControllerFetch, audioControllerUpload, RequestUploadAudioDto } from "@the-reed/swag"

export const audioQueries = {
  rootKey: () => ['audio'],
  audioKey: () => [...audioQueries.rootKey(), 'audio'],

  useFetch: () => queryOptions({
    queryKey: [...audioQueries.audioKey(), 'list'],
    queryFn: () => audioControllerFetch()
  })
}

export const audioMutations = {
  useUpload: () => {
    return useMutation({
      mutationFn: (dto: RequestUploadAudioDto) => {
        return audioControllerUpload(dto)
      }
    })
  },

  useDelete: () => {
    return useMutation({
      mutationFn: (audioId: string) => {
        return audioControllerDelete({ audioId })
      }
    })
  }
}