import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'lalola',
    database: process.env.DB_NAME || 'eureka_db',
    port: parseInt(process.env.DB_PORT || '3306'),
  },
} satisfies Config
