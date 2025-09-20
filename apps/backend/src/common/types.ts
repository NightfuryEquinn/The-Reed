export enum ValidationErrors {
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
}

export enum UserRoles {
  BASSOONIST = 'Bassoonist',
  MENTOR = 'Mentor',
  ADMIN = 'Admin'
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