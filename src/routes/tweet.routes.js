import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  updateTweet,
  deleteTweet,
  getUserTweet,
  getAllTweets,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/").post(jwtVerify, createTweet);
router.route("/:id").patch(jwtVerify, updateTweet);
router.route("/:id").delete(jwtVerify, deleteTweet);
router.route("/user/:id").get(getUserTweet);
router.route("/").get(getAllTweets);

export default router;
