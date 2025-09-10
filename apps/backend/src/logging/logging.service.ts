import { Injectable, Logger } from "@nestjs/common"
import { ErrorCode, ErrorResponseDto } from "src/common/dto/error-res.dto"
import { KyselyService } from "src/kysely/kysely.service"

enum LogRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface LogEntry {
  endpoint: string
  method: LogRequestMethod
  message: string
  payload: string;
  status: number;
  requested_by?: number | null;
  requested_at: Date;
  responded_at: Date;
  respond_time: number;
}

interface LogEntryError extends LogEntry {
  error: string | null
}

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name)

  constructor(private readonly db: KyselyService) {}

  async saveLog({
    endpoint,
    method,
    message,
    requestPayload,
    errorMessage,
    requestedAt,
    respondedAt,
    requestedBy = null,
    responseStatus = 200,
    responseTime = 0,
  }: {
    endpoint: string;
    method: LogRequestMethod;
    message: string;
    requestPayload: unknown;
    errorMessage?: string | null;
    requestedAt: Date;
    respondedAt: Date;
    requestedBy?: number | null;
    responseStatus?: number;
    responseTime?: number;
  }): Promise<void> {
    try {
      const isError = responseStatus >= 400
      const tableName = isError ? '_log_http_request_error' : '_log_http_request_raw'

      const logData: LogEntry | LogEntryError = isError ? 
        {
          endpoint,
          method,
          message,
          payload: JSON.stringify(requestPayload),
          status: responseStatus,
          requested_by: requestedBy,
          requested_at: requestedAt,
          respond_time: responseTime,
          responded_at: respondedAt,
          error: errorMessage || null,
        } :
        {
          endpoint,
          method,
          message,
          payload: JSON.stringify(requestPayload),
          status: responseStatus,
          requested_by: requestedBy,
          requested_at: requestedAt,
          responded_at: respondedAt,
          respond_time: responseTime
        }

      await this.db
        .insertInto(tableName)
        .values(logData)
        .execute()

      this.logger.debug(`Logged API request to ${tableName}: ${endpoint}`)

    } catch (error) {
      this.logger.error(`Error inserting API log: ${error instanceof Error ? error.message : 'Unknown error.'}`, error)
    }
  }
}

export const getLogRequestMethod = (method: string): LogRequestMethod => {
  switch (method) {
    case 'GET': return LogRequestMethod.GET;
    case 'POST': return LogRequestMethod.POST;
    case 'PATCH': return LogRequestMethod.PATCH;
    case 'PUT': return LogRequestMethod.PUT;
    case 'DELETE': return LogRequestMethod.DELETE;
    default: throw new ErrorResponseDto({ message: 'Invalid HTTP method', statusCode: ErrorCode.INTERNAL_SERVER_ERROR });
  }
}