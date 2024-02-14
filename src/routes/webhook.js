import express from "express";
import bodyParser from "body-parser";
import { stripePaymentWebhook } from "../controller/webhook.js";

const router = express.Router({ mergeParams: true });

export default function WebhookRoute() {
  router
    .route("/stripe")
    .post(bodyParser.raw({ type: "application/json" }), (req, res) =>
      stripePaymentWebhook(req, res)
    );

  return router;
}
