export type EnvVars = {
  DATABASE_URL: string;
  PORT: string
  JWT_ACCESS_SECRET: string
  JWT_REFRESH_SECRET: string
  S3_REGION: string
  S3_ACCESS_KEY: string
  S3_SECRET_KEY: string
  S3_ENDPOINT: string
  S3_BUCKET: string
  COGNITO_DOMAIN: string
  COGNITO_USER_POOL_ID: string
  COGNITO_CLIENT_ID: string
}

export const getEnvConfig = () => {
  const env: EnvVars = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    PORT: process.env.PORT || '3000',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    S3_REGION: process.env.S3_REGION || '',
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
    S3_SECRET_KEY: process.env.S3_SECRET_KEY || '',
    S3_ENDPOINT: process.env.S3_ENDPOINT || '',
    S3_BUCKET: process.env.S3_BUCKET || '',
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN || '',
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
  }

  return env
}