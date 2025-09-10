export type EnvVars = {
  DATABASE_URL: string;
  PORT: string
  JWT_ACCESS_SECRET: string
  JWT_REFRESH_SECRET: string
}

export const getEnvConfig = () => {
  const env: EnvVars = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    PORT: process.env.PORT || '3000',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  }

  return env
}