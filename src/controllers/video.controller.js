import { Video } from "../models/video.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(500, "Error uploading files to cloudinary");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "Title or description is required");
  }

  const oldVideo = await Video.findById(videoId);
  if (!oldVideo) {
    throw new ApiError(404, "Video not found");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await deleteFromCloudinary(video.videoFile);
  await deleteFromCloudinary(video.thumbnail);

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const getVideosByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const videos = await Video.find({ owner: userId });

  if (!videos || videos.length === 0) {
    throw new ApiError(404, "No videos found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(404, "Video not found!");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video publish status toggled successfully.")
    );
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
  getAllVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
  deleteVideo,
  getVideosByUser,
  togglePublishStatus,
  getAllVideosOfAChannel,
  getAllVideosOfACategory,
  getAllVideosOfATag,
};
