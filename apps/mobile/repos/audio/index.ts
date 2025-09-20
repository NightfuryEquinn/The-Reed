import { useMutation } from "@tanstack/react-query"
import { audioControllerUpload, RequestUploadAudioDto } from "@the-reed/swag"

export const audioMutations = {
  useUpload: () => {
    return useMutation({
      mutationFn: (dto: RequestUploadAudioDto) => {
        return audioControllerUpload(dto)
      }
    })
  }
}