import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import ApiResponse from "../utils/ApiResponse.js";

const toggleVideoLikeAndUnlike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isValidObjectId(id))
    throw new ApiError(400, "Video id is not valid");

  const like = await Like.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
        foreignField: "_id",
        as: "isLiked",
      },
    },
    {
      $addFields: {
        likeToggle: {
          $cond: {
            $if: {
              $in: [req.user?._id, "$isLiked.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        likeToggle: 1,
        email: 1,
      },
    },
  ]);

  if (!like) throw new ApiError(400, "Like not found");

  return res
    .status(200)
    .json(new ApiResponse(200, like[0], "The like was done successfully"));
});

const toggleVideoCommentLikeAndUnlike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isValidObjectId(id))
    throw new ApiError(400, "Comment id is not valid");

  const commentLike = await Like.aggregate([
    {
      $match: {
        comment: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comment",
        foreignField: "_id",
        as: "getComment",
        pipeline: [
          {
            $lookup: {
              from: "vidoes",
              localField: "video",
              foreignField: "_id",
              as: "videoOwner",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "commentOwner",
            },
          },
          {
            $addFields: {
              isCommentLiked: {
                $cond: {
                  $if: {
                    $in: [req.user?._id, "$likes.likedBy"],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              isCommentLiked: 1,
              comment: 1,
              video: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!commentLike) throw new ApiError(400, "Comment like not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        commentLike[0],
        "The comment like was done successfully"
      )
    );
});

const toogleVideoTweetLikeAndUnlike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isValidObjectId(id))
    throw new ApiError(400, "Tweet id is not valid");

  const tweetLike = await Like.aggregate([
    {
      $match: {
        tweet: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "isTweet",
      },
    },
    {
      $addFields: {
        isTweetLiked: {
          $cond: {
            $if: {
              $in: [req.user?._id, "$isTweet.likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        isTweetLiked: 1,
        tweet: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!tweetLike) throw new ApiError(400, "Tweet like not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweetLike[0], "Tweet like was done successfully")
    );
});

const getAllLikedVideos = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isValidObjectId(id))
    throw new ApiError(400, "User id is not valid");

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(id),
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
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "User id is not valid");

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(id),
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
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
  toggleVideoLikeAndUnlike,
  toggleVideoCommentLikeAndUnlike,
  toogleVideoTweetLikeAndUnlike,
  getAllLikedVideos,
  getVideoLikedByUser,
};
