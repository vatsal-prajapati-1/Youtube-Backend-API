import { Router } from "express";
import {
  toggleVideoLikeAndUnlike,
  toggleVideoCommentLikeAndUnlike,
  toogleVideoTweetLikeAndUnlike,
  getAllLikedVideos,
  getVideoLikedByUser,
  getAllLikeComments,
  getAllLikeTweets,
  getCommentLikeByUser,
  getTweetLikeByUser,
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
router.route("/liked-videos").get(jwtVerify, getAllLikedVideos);

router.route("/liked-videos-by-user/:id").get(jwtVerify, getVideoLikedByUser);
router.route("/liked-comments").get(jwtVerify, getAllLikeComments);
router.route("/liked-tweets").get(jwtVerify, getAllLikeTweets);
router
  .route("/liked-comments-by-user/:id")
  .get(jwtVerify, getCommentLikeByUser);
router.route("/liked-tweets-by-user/:id").get(jwtVerify, getTweetLikeByUser);

export default router;
