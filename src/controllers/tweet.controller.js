import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find().sort({ createdAt: -1 });

  if (!tweets || tweets.length === 0) {
    throw new ApiError(404, "No tweets found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content?.trim() === "")
    throw new ApiError(400, "Content is required");

  const tweet = await Tweet.create({ content, owner: req.user?._id });

  if (!tweet)
    throw new ApiError(500, "Something went wrong while creating tweet");

  return res
    .status(201)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const { id } = req.params;

  if (!content || content?.trim() === "")
    throw new ApiError(400, "Content is required");

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Tweet id is required");

  const tweet = await Tweet.findById(id);

  if (!tweet) throw new ApiError(400, "Tweet not found");

  if (tweet.owner.toString() !== req.user?._id.toString())
    throw new ApiError(403, "You don't have permission to update this tweet!");

  const updateTweet = await Tweet.findByIdAndUpdate(
    id,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updateTweet)
    throw new ApiError(500, "Something went wrong while updating tweet");

  return res
    .status(200)
    .json(new ApiResponse(200, updateTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Tweet id is required");

  const tweet = await Tweet.findById(id);

  if (!tweet) throw new ApiError(400, "Tweet not found");

  if (tweet.owner.toString() !== req.user?._id.toString())
    throw new ApiError(403, "You don't have permission to delete this tweet!");

  const deleteTweet = await Tweet.findByIdAndDelete(req.user?._id);

  if (!deleteTweet)
    throw new ApiError(500, "Something went wrong while deleting tweet");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

const getUserTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "User id is required");

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "tweets",
      },
    },
    {
      $unwind: "$tweets",
    },
    {
      $project: {
        _id: 1,
        content: 1,
        "tweets.username": 1,
        "tweets.email": 1,
      },
    },
  ]);

  if (!tweets) throw new ApiError(404, "Tweets not found");

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweet, getAllTweets };
