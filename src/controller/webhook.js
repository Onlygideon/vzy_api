import stripe from "stripe";
import env from "../config/env.js";
import User from "../models/User.js";
import logFunctions from "../utils/logger.js";

const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = env();

const initializeStripe = new stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const stripePaymentWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).json({
        status: false,
        message: "Webhook Error: No Signature",
      });
    }

    let event;
    try {
      event = initializeStripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Webhook Error: ${error.message}`,
      });
    }

    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        logFunctions.info(chargeSucceeded);
        try {
          const paymentId = chargeSucceeded.payment_intent;
          await User.findOneAndUpdate(
            {
              stripePaymentId: paymentId,
            },
            { $set: { status: "paid" } }
          );
          return res.status(200).json({
            status: true,
          });
        } catch (error) {
          return res.status(400).json({
            status: false,
            message: error.message,
          });
        }
        break;
      default:
        logFunctions.error(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    logFunctions.error(err.message);
    return res.status(500).json({
      status: false,
      message: `Webhook Error: ${error.message}`,
    });
  }
};

export { stripePaymentWebhook };
