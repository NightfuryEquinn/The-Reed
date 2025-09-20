import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jose from 'jose';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  private jwks: jose.JWTVerifyGetKey;

  constructor(private reflector: Reflector) {
    const userPoolId = process.env.COGNITO_USER_POOL_ID!;
    const region = process.env.S3_REGION!;

    const jwksUri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

    this.jwks = jose.createRemoteJWKSet(new URL(jwksUri));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const { payload } = await jose.jwtVerify(token, this.jwks, {
        issuer: `https://cognito-idp.${process.env.S3_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      });

      request.user = payload;

      if (requiredRoles?.length) {
        const userRoles = (payload['custom:roles'] ?? []) as string[];
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));

        if (!hasRole) {
          throw new ForbiddenException(
            `User does not have permission. Required: ${requiredRoles.join(', ')}`,
          );
        }
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(
        `Token validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
