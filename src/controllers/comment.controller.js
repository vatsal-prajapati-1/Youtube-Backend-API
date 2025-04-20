import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose, { isValidObjectId } from "mongoose";

const getVideosComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!id) throw new ApiError(400, "Video ID is required");

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(id),
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
  const { id } = req.params;

  const { page = 1, limit = 10 } = req.query;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Twitter ID is required");

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate([
      {
        $match: {
          twitter: new mongoose.Types.ObjectId(id),
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
  const { id } = req.params;

  const { comment } = req.body;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "Video ID is required");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "Comment is required");

  const createComment = await Comment.create({
    content: comment,
    video: id,
    owner: req.user?._id,
  });

  if (!createComment) throw new ApiError(500, "Failed to create comment");

  return res
    .status(201)
    .json(new ApiResponse(201, createComment, "Comment created successfully"));
});

const addCommentToTwitter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { comment } = req.body;

  if (!id || isValidObjectId(id))
    throw new ApiError(400, "Twitter id is required");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "Comment is required");

  const createComment = await Comment.create({
    content: comment,
    twitter: id,
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
  const { id } = req.params;

  const { comment } = req.body;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "This video id is not valid");

  if (!comment || comment?.trim() === "")
    throw new ApiError(400, "content is required");

  const existingComment = await Comment.findById(id);

  if (!existingComment) throw new ApiError(400, "Comment was not found");

  if (existingComment.owner.toString() !== req.user?._id)
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );

  const updateComment = await Comment.findByIdAndUpdate(
    id,
    {
      $set: {
        content: comment,
      },
    },
    { new: true }
  );

  if (updateComment)
    throw new ApiError(500, "something went wrong while updating comment");

  return res
    .status(201)
    .json(
      new ApiResponse(200, updateComment, "comment updated successfully!!")
    );
});

const updateCommentToTwitter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { comment } = req.body;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "This video id is not valid");

  if (!comment || comment?.trim() === "")
    throw new ApiError(404, "comment is required");

  const existingComment = await Comment.findById(id);

  if (!existingComment) throw new ApiError(404, "comment not found");

  if (existingComment.owner.toString() !== req.user?._id)
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );

  const updateComment = await Comment.findByIdAndUpdate(
    id,
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
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "This video id is not valid");

  const comment = await Comment.findById(id);

  if (!comment) throw new ApiError(404, "comment not found!");

  if (comment.owner.toString() !== req.user?._id)
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );

  const deleteComment = await Comment.findByIdAndDelete(req.user?._id);

  if (!deleteComment)
    throw new ApiError(500, "something went wrong while deleting comment");

  return res
    .status(200)
    .json(
      new ApiResponse(200, deleteComment, "comment deleted successfully!!")
    );
});

const deleteCommentToTwitter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id))
    throw new ApiError(400, "This video id is not valid");

  const comment = await Comment.findById(id);

  if (!comment) throw new ApiError(404, "comment not found!");

  if (comment.owner.toString() !== req.user?._id)
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );

  const deleteComment = await Comment.findByIdAndDelete(req.user?._id);

  if (!deleteComment)
    throw new ApiError(500, "something went wrong while deleting comment");

  return res
    .status(200)
    .json(
      new ApiResponse(200, deleteComment, "comment deleted successfully!!")
    );
});

export {
  getVideosComments,
  getTwitterComments,
  addCommentToVideo,
  addCommentToTwitter,
  updateCommentToVideo,
  updateCommentToTwitter,
  deleteCommentToVideo,
  deleteCommentToTwitter,
};
