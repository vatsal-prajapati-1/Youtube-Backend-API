import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Like } from "../models/like.models.js";
import { Subscription } from "../models/subscription.models.js";

const getChannelStats = async (req, res) => {
  try {
    const userId = req.user?._id;

    const totalVideos = await Video.countDocuments({ owner: userId });

    const totalViews = await Video.aggregate([
      { $match: { owner: userId } },
      { $group: { _id: null, views: { $sum: "$views" } } },
    ]);

    const totalSubscribers = await Subscription.countDocuments({
      channel: userId,
    });

    const totalLikes = await Like.countDocuments({
      video: { $in: await Video.find({ owner: userId }).select("_id") },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalVideos,
          totalViews: totalViews[0]?.views || 0,
          totalSubscribers,
          totalLikes,
        },
        "Channel stats fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error while fetching channel stats");
  }
};

const getChannelVideos = async (req, res) => {
  try {
    const userId = req.user?._id;

    const videos = await Video.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("owner", "username fullName avatar");

    return res
      .status(200)
      .json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error while fetching channel videos");
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalLikes = await Like.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();

    const topVideos = await Video.find()
      .sort({ views: -1 })
      .limit(5)
      .populate("owner", "username fullName avatar");

    const topCreators = await User.aggregate([
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          subscriberCount: { $size: "$subscribers" },
        },
      },
      { $sort: { subscriberCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          username: 1,
          fullName: 1,
          avatar: 1,
          subscriberCount: 1,
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalUsers,
          totalVideos,
          totalLikes,
          totalSubscriptions,
          topVideos,
          topCreators,
        },
        "Dashboard stats fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error while fetching dashboard stats");
  }
};

export { getChannelStats, getChannelVideos, getDashboardStats };
