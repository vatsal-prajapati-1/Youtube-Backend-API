import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import ApiResponse from "../utils/ApiResponse.js";

const toggleVideoLikeAndUnlike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Video id is not valid");

  // Check if user already liked the video
  const existingLike = await Like.findOne({
    video: id,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    // Unlike the video
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
      );
  } else {
    // Like the video
    const like = await Like.create({
      video: id,
      likedBy: req.user?._id,
    });

    if (!like) throw new ApiError(400, "Like not found");

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: true }, "Video liked successfully")
      );
  }
});

const toggleVideoCommentLikeAndUnlike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Comment id is not valid");

  // Check if user already liked the comment
  const existingLike = await Like.findOne({
    comment: id,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    // Unlike the comment
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Comment unliked successfully")
      );
  } else {
    // Like the comment
    const like = await Like.create({
      comment: id,
      likedBy: req.user?._id,
    });

    if (!like) throw new ApiError(400, "Comment like not found");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true },
          "The comment like was done successfully"
        )
      );
  }
});

const toogleVideoTweetLikeAndUnlike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Tweet id is not valid");

  // Check if user already liked the tweet
  const existingLike = await Like.findOne({
    tweet: id,
    likedBy: req.user?._id,
  });

  if (existingLike) {
    // Unlike the tweet
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
      );
  } else {
    // Like the tweet
    const like = await Like.create({
      tweet: id,
      likedBy: req.user?._id,
    });

    if (!like) throw new ApiError(400, "Tweet like not found");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true },
          "Tweet like was done successfully"
        )
      );
  }
});

const getAllLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $project: {
        likedVideos: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedVideos) throw new ApiError(400, "Liked videos not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos[0], "Liked videos was done successfully")
    );
});

const getVideoLikedByUser = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        video: { $exists: true },
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $project: {
        likedVideos: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedVideos) throw new ApiError(400, "Liked videos not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideos[0],
        "All liked videos fetched successfully"
      )
    );
});

const getAllLikeComments = asyncHandler(async (req, res) => {
  const likedComments = await Like.aggregate([
    {
      $match: {
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comment",
        foreignField: "_id",
        as: "likedComments",
      },
    },
    {
      $project: {
        likedComments: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedComments) throw new ApiError(400, "Liked comments not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedComments[0],
        "Liked comments fetched successfully"
      )
    );
});

const getAllLikeTweets = asyncHandler(async (req, res) => {
  const likedTweets = await Like.aggregate([
    {
      $match: {
        tweet: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "likedTweets",
      },
    },
    {
      $project: {
        likedTweets: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedTweets) throw new ApiError(400, "Liked tweets not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedTweets[0], "Liked tweets fetched successfully")
    );
});

const getCommentLikeByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "User id is not valid");

  const likedComments = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(id),
        comment: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comment",
        foreignField: "_id",
        as: "likedComments",
      },
    },
    {
      $project: {
        likedComments: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedComments) throw new ApiError(400, "Liked comments not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedComments, "Liked comments fetched successfully")
    );
});

const getTweetLikeByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "User id is not valid");

  const likedTweets = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(id),
        tweet: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "likedTweets",
      },
    },
    {
      $project: {
        likedTweets: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!likedTweets) throw new ApiError(400, "Liked tweets not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedTweets, "Liked tweets fetched successfully")
    );
});

export {
  toggleVideoLikeAndUnlike,
  toggleVideoCommentLikeAndUnlike,
  toogleVideoTweetLikeAndUnlike,
  getAllLikedVideos,
  getVideoLikedByUser,
  getAllLikeComments,
  getAllLikeTweets,
  getCommentLikeByUser,
  getTweetLikeByUser,
};
