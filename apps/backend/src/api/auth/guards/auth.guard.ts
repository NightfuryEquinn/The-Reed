import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { JwtPayload } from 'src/common/types'

// Extend the Request type to include the 'user' property
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload // Use appropriate type instead of 'any' if you have a user interface
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    // Extract roles from the handler or class
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)

      if (requiredRoles && !this.hasRole(payload.role, requiredRoles)) {
        throw new ForbiddenException('Insufficient permissions')
      }

      // We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload
    }
    catch (error) {
      throw new UnauthorizedException(
        `Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return true // The request is authorized if token validation passes
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : null // Ensure it's a Bearer token
  }

  // Check if the user has at least one of the required roles
  private hasRole(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles?.includes(role))
  }
}