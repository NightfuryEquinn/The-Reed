import { useMutation } from "@tanstack/react-query";
import { authControllerRegister, RequestRegisterDto } from '@the-reed/swag'

export const authMutations = {
  useRegister: () => {
    return useMutation({
      mutationFn: (dto: RequestRegisterDto) => {
        return authControllerRegister(dto)
      }
    })
  }
}