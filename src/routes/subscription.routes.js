import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/c/:channelId").post(jwtVerify, toggleSubscription);
router.route("/c/:channelId/subscribers").get(getUserChannelSubscribers);
router.route("/u/:subscriberId/channels").get(getSubscribedChannels);

export default router;
