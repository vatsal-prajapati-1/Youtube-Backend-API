import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]),
    {
      page,
      limit,
      customLabels: {
        docs: "comments",
        totalDocs: "totalComments",
      },
    }
  );

  if (!comments) throw new ApiError(500, "Failed to fetch comments");

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const getVideosComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) throw new ApiError(400, "Video ID is required");

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]),
    {
      page,
      limit,
      customLabels: {
        docs: "comments",
        totalDocs: "totalComments",
      },
    }
  );

  if (!comments) throw new ApiError(500, "Failed to fetch comments");

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const getTwitterComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const { page = 1, limit = 10 } = req.query;

  if (!tweetId || !isValidObjectId(tweetId))
    throw new ApiError(400, "Tweet ID is required");

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      {
        $match: {
          twitter: new mongoose.Types.ObjectId(tweetId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]),
    {
      page,
      limit,
      customLabels: {
        docs: "comments",
        totalDocs: "totalComments",
      },
    }
  );

  if (!comments) throw new ApiError(500, "Failed to fetch comments");

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addCommentToVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { comment } = req.body;

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Video ID is required");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "Comment is required");

  const createComment = await Comment.create({
    content: comment,
    video: videoId,
    owner: req.user?._id,
  });

  if (!createComment) throw new ApiError(500, "Failed to create comment");

  return res
    .status(201)
    .json(new ApiResponse(200, createComment, "Comment created successfully"));
});

const addCommentToTwitter = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const { comment } = req.body;

  if (!tweetId || !isValidObjectId(tweetId))
    throw new ApiError(400, "Tweet ID is required");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "Comment is required");

  const createComment = await Comment.create({
    content: comment,
    twitter: tweetId,
    owner: req.user?._id,
  });

  if (!createComment)
    throw new ApiError(
      500,
      "something went wrong while creating tweet comment"
    );

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createComment,
        "Tweet comment created successfully!!"
      )
    );
});

const updateCommentToVideo = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const { comment } = req.body;

  if (!commentId || !isValidObjectId(commentId))
    throw new ApiError(400, "Comment ID is not valid");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "content is required");

  const existingComment = await Comment.findById(commentId);

  if (!existingComment) throw new ApiError(400, "Comment was not found");

  if (existingComment.owner.toString() !== req.user?._id.toString())
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: comment,
      },
    },
    { new: true }
  );

  if (!updateComment)
    throw new ApiError(500, "something went wrong while updating comment");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateComment, "comment updated successfully!!")
    );
});

const updateCommentToTwitter = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const { comment } = req.body;

  if (!commentId || !isValidObjectId(commentId))
    throw new ApiError(400, "Comment ID is not valid");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "Comment is required");

  const existingComment = await Comment.findById(commentId);

  if (!existingComment) throw new ApiError(404, "Comment not found");

  if (existingComment.owner.toString() !== req.user?._id.toString())
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: comment,
      },
    },
    { new: true }
  );

  if (!updateComment)
    throw new ApiError(500, "something went wrong while updating comment");

  return res
    .status(201)
    .json(
      new ApiResponse(200, updateComment, "comment updated successfully!!")
    );
});

const deleteCommentToVideo = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId))
    throw new ApiError(400, "Comment ID is not valid");

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "comment not found!");

  if (comment.owner.toString() !== req.user?._id.toString())
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment)
    throw new ApiError(500, "something went wrong while deleting comment");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted successfully!!"));
});

const deleteCommentToTwitter = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId))
    throw new ApiError(400, "Comment ID is not valid");

  const comment = await Comment.findById(commentId);

  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.owner.toString() !== req.user?._id.toString())
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment) throw new ApiError(500, "Failed to delete comment");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
  getAllComments,
  getVideosComments,
  getTwitterComments,
  addCommentToVideo,
  addCommentToTwitter,
  updateCommentToVideo,
  updateCommentToTwitter,
  deleteCommentToVideo,
  deleteCommentToTwitter,
};
