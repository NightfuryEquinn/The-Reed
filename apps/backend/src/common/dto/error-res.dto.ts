import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ErrorCode {
  BAD_REQUEST = 400, // The server could not understand the request due to invalid syntax.
  UNAUTHORIZED = 401, // The client must authenticate itself to get the requested response.
  FORBIDDEN = 403, // The client does not have access rights to the content.
  NOT_FOUND = 404, // The server can not find the requested resource.
  METHOD_NOT_ALLOWED = 405, // The request method is known by the server but is not supported.
  CONFLICT = 409, // The request conflicts with the current state of the server.
  INTERNAL_SERVER_ERROR = 500, // The server has encountered a situation it doesn't know how to handle.
  NOT_IMPLEMENTED = 501, // The server does not support the functionality required to fulfill the request.
  BAD_GATEWAY = 502, // The server received an invalid response from the upstream server.
  SERVICE_UNAVAILABLE = 503, // The server is not ready to handle the request, often due to maintenance or overload.
}

export class ErrorResponseDto {
  @ApiProperty({ default: 'Success' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ default: 200 })
  @IsOptional()
  @IsEnum(ErrorCode)
  statusCode?: ErrorCode;

  constructor(dto?: Partial<ErrorResponseDto>) {
    this.message = dto?.message || 'Success'; // Default to 'Success' if message is not provided
    this.statusCode = dto?.statusCode || ErrorCode.INTERNAL_SERVER_ERROR;
  }
}
