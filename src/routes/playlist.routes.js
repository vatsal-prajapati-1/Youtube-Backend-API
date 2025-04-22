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
  getAllPlaylists,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(jwtVerify, createPlaylist).get(getAllPlaylists);
router.route("/user/:userId").get(getUserPlaylists);
router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(jwtVerify, updatePlaylist)
  .delete(jwtVerify, deletePlaylist);
router
  .route("/videos/:playlistId")
  .post(jwtVerify, addVideoToPlaylist)
  .delete(jwtVerify, removeVideoFromPlaylist);

export default router;
