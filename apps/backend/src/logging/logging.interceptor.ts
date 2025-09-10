import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { catchError, map, Observable } from "rxjs";
import { SuccessResponseDto } from "src/common/dto/success-res.dto";
import { JwtPayload } from "src/common/types";
import { getLogRequestMethod, LoggingService } from "./logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp()
    const req: Request = httpContext.getRequest()
    const res: Response = httpContext.getResponse()
    const requestedAt: Date = (res as unknown as { _requestedAt?: Date })._requestedAt || new Date()

    return next.handle().pipe(
      map((response: SuccessResponseDto) => {
        const respondedAt = new Date()
        this.logRequest(req, res, requestedAt, respondedAt, response.statusCode ?? 200, response.message ?? 'Success', null)
        return response
      }),
      catchError(error => {
        console.log('Interceptor Error:', error)

        let statusCode = 500
        let message = 'Internal server error.'
        let errorMessage: string | null = null

        // If error is a NestJS HttpException
        if (error.getStatus && error.getResponse) {
          statusCode = error.getStatus()
          const res = error.getResponse()
          if (typeof res === 'string') {
            message = res
          } else if (typeof res === 'object' && res !== null) {
            const obj = res as Record<string, any>
            message = obj.error ?? message
            errorMessage = obj.message ?? null
          }
        } 
        // Else fallback to generic fields
        else if (error.statusCode || error.status) {
          statusCode = error.statusCode || error.status || 500
          message = error.message ?? message
        } 
        // If argon2 or other custom errors
        else if (error.message) {
          message = error.message
        }

        const respondedAt = new Date()
        this.logRequest(req, res, requestedAt, respondedAt, statusCode, message, errorMessage)

        throw error
      })
    )
  }

  private async logRequest(
    req: Request & { user?: JwtPayload },
    res: Response,
    requestedAt: Date,
    respondedAt: Date,
    statusCode: number,
    message: string,
    errorMessage: string | null
  ): Promise<void> {
    const responseTime = respondedAt.getTime() - requestedAt.getTime()
    const statusMethod = getLogRequestMethod(req.method)

    await this.loggingService.saveLog({
      endpoint: req.url,
      method: statusMethod,
      message: message,
      requestPayload: req.body,
      requestedAt: requestedAt,
      respondedAt: respondedAt,
      requestedBy: req.user?.id ?? 0,
      responseStatus: statusCode,
      responseTime: responseTime,
      errorMessage: errorMessage
    })
  }
}