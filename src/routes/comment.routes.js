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
} from "../controllers/comment.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

// Video comments routes
router.route("/video/:id").get(getVideosComments);
router.route("/video/:id").post(jwtVerify, addCommentToVideo);
router.route("/video/:id").patch(jwtVerify, updateCommentToVideo);
router.route("/video/:id").delete(jwtVerify, deleteCommentToVideo);

// Twitter comments routes
router.route("/twitter/:id").get(getTwitterComments);
router.route("/twitter/:id").post(jwtVerify, addCommentToTwitter);
router.route("/twitter/:id").patch(jwtVerify, updateCommentToTwitter);
router.route("/twitter/:id").delete(jwtVerify, deleteCommentToTwitter);

export default router;
