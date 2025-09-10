import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import { getLogRequestMethod, LoggingService } from '../logging/logging.service';
import { RequestJwtAuth } from 'src/common/types';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService, private readonly jwtService: JwtService) { }

  async use(req: RequestJwtAuth, res: Response, next: NextFunction) {
    if (req.url === '/' || req.url === '/favicon.ico') {
      return next();
    }

    const requestedAt = new Date();
    let requestedBy: number | null = null;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);
        requestedBy = decoded.id;
        req.user = decoded;
      } catch (error) {
        console.error('Invalid JWT token:', error.message);
      }
    }

    const statusMethod = getLogRequestMethod(req.method);

    await this.loggingService.saveLog({
      endpoint: req.url,
      method: statusMethod,
      message: res.statusMessage || 'Request received',
      requestPayload: req.body,
      requestedAt,
      respondedAt: new Date(),
      requestedBy,
      responseStatus: res.statusCode || 200,
      responseTime: 0, 
    });

    next();
  }
}