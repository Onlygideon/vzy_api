import dotenv from "dotenv";

dotenv.config();

export default () => {
  return {
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    DB_USERNAME: process.env.MONGO_DB_USERNAME,
    DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
    DB_CLUSTER_NAME: process.env.MONGO_DB_CLUSTER_NAME,
    DB_NAME: process.env.MONGO_DB_NAME,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };
};
