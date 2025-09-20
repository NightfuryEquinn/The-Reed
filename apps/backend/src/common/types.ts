export enum ValidationErrors {
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
}

export enum UserRoles {
  BASSOONIST = 'bassoonist',
  MENTOR = 'mentor',
  ADMIN = 'admin'
}

export type JwtPayload = {
  id: number;
  email: string;
  username: string;
  role: UserRoles
}

export interface RequestJwtAuth extends Request {
  user: JwtPayload;
  validationErrors?: ValidationErrors
}