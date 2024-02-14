import Joi from "joi";

export const logRequest = (req, res) => {
  const start = Date.now();
  const url = req.originalUrl;
  const method = req.method;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(statusCode, url, method, duration);
  });
};

export const validsteSignUp = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[0-9])(?=.*[!@#$%^&*?_\-])[a-zA-Z0-9!@#$%^&*?_\-]{8,30}$/
      )
    )
    .required(),
});

export const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[0-9])(?=.*[!@#$%^&*?_\-])[a-zA-Z0-9!@#$%^&*?_\-]{8,30}$/
      )
    )
    .required(),
});

export const validateUpdateUser = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  stripePaymentId: Joi.string().optional(),
});

export const isEmpty = (obj) => {
  for (let x in obj) {
    return false;
  }
  return true;
};
