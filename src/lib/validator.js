export const validate = (schemaObject) => {
  return (req, res, next) => {
    const schema = schemaObject.options({ stripUnknown: false });
    const body = req?.body?.input || req?.body;
    const { error } = schema.validate(body);
    if (error) {
      return res.status(422).json({
        error: {
          message: error.message,
        },
      });
    }
    req.body = body;
    return next();
  };
};
