import express from "express";
import passport from "passport";
import { signUp, login, updateUser } from "../controller/user.js";
import { validate } from "../lib/validator.js";
import {
  validsteSignUp,
  validateLogin,
  validateUpdateUser,
  logRequest,
} from "../utils/helpers.js";

const router = express.Router({ mergeParams: true });

export default function UserRoute() {
  router.post("/register", validate(validsteSignUp), (req, res) => {
    signUp(req, res);
    logRequest(req, res);
  });

  router.post("/login", validate(validateLogin), (req, res) => {
    login(req, res);
    logRequest(req, res);
  });

  router.put(
    "/update",
    passport.authenticate("jwt", { session: false }),
    validate(validateUpdateUser),
    (req, res) => {
      updateUser(req, res, req.user);
      logRequest(req, res);
    }
  );

  return router;
}
