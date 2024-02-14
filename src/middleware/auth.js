import User from "../models/User.js";
import logFunctions from "../utils/logger.js";

export const extractUserIdFromJWT = (jwtPayload, done) => {
  User.findById(jwtPayload.id)
    .then((res) => {
      if (res) {
        return done(null, res);
      }
      return done(null, false);
    })
    .catch((error) => {
      logFunctions.error(error.message);
      return done(error, false);
    });
};
