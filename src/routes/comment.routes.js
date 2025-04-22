import { Router } from "express";
import {
  getVideosComments,
  getTwitterComments,
  addCommentToVideo,
  addCommentToTwitter,
  updateCommentToVideo,
  updateCommentToTwitter,
  deleteCommentToVideo,
  deleteCommentToTwitter,
  getAllComments,
} from "../controllers/comment.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllComments);

// Video comments routes
router.route("/video/:videoId").get(getVideosComments);
router.route("/video/:videoId").post(jwtVerify, addCommentToVideo);
router.route("/video/:commentId").patch(jwtVerify, updateCommentToVideo);
router.route("/video/:commentId").delete(jwtVerify, deleteCommentToVideo);

// Twitter comments routes
router.route("/twitter/:tweetId").get(getTwitterComments);
router.route("/twitter/:tweetId").post(jwtVerify, addCommentToTwitter);
router.route("/twitter/:commentId").patch(jwtVerify, updateCommentToTwitter);
router.route("/twitter/:commentId").delete(jwtVerify, deleteCommentToTwitter);

export default router;
