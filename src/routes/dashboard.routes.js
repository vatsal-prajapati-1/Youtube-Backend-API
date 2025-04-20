import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
  getDashboardStats,
} from "../controllers/dashboard.controller.js";

const router = Router();

// Channel specific stats - requires authentication
router.route("/channel/stats").get(jwtVerify, getChannelStats);
router.route("/channel/videos").get(jwtVerify, getChannelVideos);

// Overall platform stats - requires authentication
router.route("/stats").get(jwtVerify, getDashboardStats);

export default router;
