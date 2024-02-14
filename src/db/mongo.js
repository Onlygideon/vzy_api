import mongoose from "mongoose";
import env from "../config/env.js";

const mongoLocal = "mongodb://127.0.0.1:27017/vzy";

let { DB_CLUSTER_NAME, DB_NAME, DB_PASSWORD, DB_USERNAME } = env();

const mongoRemote = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER_NAME}.tl7iv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

export const connectMongodb = async () => {
  try {
    if (DB_USERNAME && DB_PASSWORD) {
      await mongoose.connect(mongoRemote);
      console.log("MongoDB remote connection established");
    } else {
      await mongoose.connect(mongoLocal);
      console.log("MongoDB local connection established");
    }
  } catch (err) {
    console.log("MongoDB connection - retrying", err);

    // return "MongoDB connection failed"
    connectMongodb();
  }
};
