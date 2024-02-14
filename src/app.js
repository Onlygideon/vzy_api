import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import env from "./config/env.js";
import { connectMongodb } from "./db/mongo.js";
import UserRoute from "./routes/user.js";
import WebhookRoute from "./routes/webhook.js";

import { extractUserIdFromJWT } from "./middleware/auth.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env().JWT_SECRET,
};

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});

connectMongodb();

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use(passport.initialize());
passport.use(new JwtStrategy(opts, extractUserIdFromJWT));

// base url route
app.get("/", async (req, res) => {
  res.json({ message: "Welcome to VZY API" });
});

// routes
app.use("/user", UserRoute());
app.use("/webhook", WebhookRoute());

// start server
const server = app.listen(port);
console.log("Server started. Listening on port:", port);
