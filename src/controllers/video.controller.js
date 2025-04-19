import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import ApiResponse from "../utils/ApiResponse.js";

const createVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title && !description)
    throw new ApiError(400, "Title and description are required");

  const videoFileLocalPath = req.files?.videoFile[0]?.path;

  if (!videoFileLocalPath) throw new ApiError(400, "Video file is required");

  let thumbnailLocalPath;

  if (
    req.files &&
    Array.isArray(req.files?.thumbnail) &&
    req.files?.thumbnail.length > 0
  )
    thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) throw new ApiError(400, "Video file upload failed");

  if (!thumbnail) throw new ApiError(400, "Thumbnail upload failed");

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url || "",
    title,
    description,
    duration: videoFile.duration,
    views: 0,
    isPublished: false,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video created successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) throw new ApiError(400, "Video id is required");

  if (!title && !description)
    throw new ApiError(400, "Title and Description are required");

  const video = await Video.findById(id);

  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  console.log(
    video.owner,
    video.owner.toString(),
    "video owner to string !!!!!"
  );

  const videoFileLocalPath = req.files?.path;

  if (!videoFileLocalPath) throw new ApiError(400, "Video file is missing");

  const thumbnailLocalPath = req.files?.path;

  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail file is missing");

  if (video.videoFile) await deleteFromCloudinary(video.videoFile);

  if (video.thumbnail) await deleteFromCloudinary(video.thumbnail);

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);

  if (!videoFile) throw new ApiError(400, "Video file upload failed");

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) throw new ApiError(400, "Thumbnail upload failed");

  const updatedVideo = await Video.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: thumbnail.url,
        videoFile: videoFile.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Video id is required");

  const video = await Video.findById(id);

  if (!video) throw new ApiError(400, "Video not found");

  if (video.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  if (video.videoFile) await deleteFromCloudinary(video.videoFile);

  if (video.thumbnail) await deleteFromCloudinary(video.thumbnail);

  await Video.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const getVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Video id is required");

  const video = await Video.findByIdAndUpdate(
    id,
    {
      $inc: { views: 1 },
    },
    { new: true }
  );

  if (!video) throw new ApiError(400, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.params;

  const videos = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: {
          isPublished: true,
          ...(query && { $text: { $search: query } }),
        },
      },
      {
        $sort: {
          [sortBy || "createdAt"]: sortType === "desc" ? -1 : 1,
        },
      },
    ]),
    {
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getAllVideosOfAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { page = 1, limit = 10 } = req.query;

  if (!id) throw new ApiError(400, "User id is required");

  const videos = await Video.aggregatePaginate(
    Video.find({ owner: id, isPublished: true }),
    {
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    }
  );

  if (!videos) throw new ApiError(400, "Videos not found");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getAllVideosOfAChannel = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const { page = 1, limit = 10 } = req.query;

  if (!name) throw new ApiError(400, "Channel name is required");

  const videos = await Video.aggregatePaginate(
    Video.find({ channel: name, isPublished: true }),
    {
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    }
  );

  if (!videos) throw new ApiError(400, "Videos not found");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getAllVideosOfAPlaylist = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const { page = 1, limit = 10 } = req.query;

  if (!name) throw new ApiError(400, "Playlist name is required");

  const videos = await Video.aggregatePaginate(
    Video.find({ playlist: name, isPublished: true }),
    {
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    }
  );

  if (!videos) throw new ApiError(400, "Videos not found");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getAllVideosOfACategory = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!name) throw new ApiError(400, "Category ID is required");

  const videos = await Video.aggregatePaginate(
    Video.find({ category: name, isPublished: true }),
    {
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Category videos fetched successfully"));
});

const getAllVideosOfATag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!tag) throw new ApiError(400, "Tag is required");

  const videos = await Video.aggregatePaginate(
    Video.find({ tags: tag, isPublished: true }),
    {
      page,
      limit,
      customLabels: {
        docs: "videos",
        totalDocs: "totalVideos",
      },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Tag videos fetched successfully"));
});

export {
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  getAllVideosOfAUser,
  getAllVideosOfAChannel,
  getAllVideosOfAPlaylist,
  getAllVideosOfACategory,
  getAllVideosOfATag,
};
