import { Router } from "express";
import {
  toggleVideoLikeAndUnlike,
  toggleVideoCommentLikeAndUnlike,
  toogleVideoTweetLikeAndUnlike,
  getAllLikedVideos,
  getVideoLikedByUser,
} from "../controllers/like.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle/video/:id").post(jwtVerify, toggleVideoLikeAndUnlike);
router
  .route("/toggle/comment/:id")
  .post(jwtVerify, toggleVideoCommentLikeAndUnlike);
router
  .route("/toggle/tweet/:id")
  .post(jwtVerify, toogleVideoTweetLikeAndUnlike);
router.route("/liked-videos/:id").get(jwtVerify, getAllLikedVideos);

router.route("/liked-videos-by-user/:id").get(jwtVerify, getVideoLikedByUser);

export default router;
