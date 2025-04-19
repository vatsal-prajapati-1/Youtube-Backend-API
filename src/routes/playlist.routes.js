import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(jwtVerify, createPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(jwtVerify, updatePlaylist)
  .delete(jwtVerify, deletePlaylist);
router
  .route("/:playlistId/videos")
  .post(jwtVerify, addVideoToPlaylist)
  .delete(jwtVerify, removeVideoFromPlaylist);

export default router;
