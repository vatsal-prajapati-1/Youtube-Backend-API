import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  updateTweet,
  deleteTweet,
  getUserTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/").post(jwtVerify, createTweet);
router.route("/:id").patch(jwtVerify, updateTweet);
router.route("/:id").delete(jwtVerify, deleteTweet);
router.route("/user/:id").get(getUserTweet);

export default router;
