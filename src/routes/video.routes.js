import { Router } from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getAllVideosOfACategory,
  getAllVideosOfAChannel,
  getAllVideosOfAPlaylist,
  getAllVideosOfATag,
  getAllVideosOfAUser,
  getVideo,
  updateVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/").post(createVideo);
router.route("/").get(getAllVideos);
router.route("/:id").get(getVideo);
router.route("/:id").put(updateVideo);
router.route("/:id").delete(deleteVideo);
router.route("/user/:id").get(getAllVideosOfAUser);
router.route("/c/:name").get(getAllVideosOfAChannel);
router.route("/p/:name").get(getAllVideosOfAPlaylist);
router.route("/category/:name").get(getAllVideosOfACategory);
router.route("/t/:name").get(getAllVideosOfATag);

export default router;
