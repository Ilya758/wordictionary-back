import { config } from 'dotenv';

config();

export default {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
};
