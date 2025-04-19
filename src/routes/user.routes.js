import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout/:id").post(jwtVerify, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(jwtVerify, changeCurrentPassword);
router.route("/current-user").get(jwtVerify, getCurrentUser);
router.route("/update-account").patch(jwtVerify, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(jwtVerify, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-image")
  .patch(jwtVerify, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(jwtVerify, getUserChannelProfile);
router.route("/history").get(jwtVerify, getWatchHistory);

export default router;
