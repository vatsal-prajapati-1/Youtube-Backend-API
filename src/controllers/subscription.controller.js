import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.models.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const userId = req.user?._id;

  console.log(req.user?._id);

  if (!name) throw new ApiError(400, "Name is required");

  if (!userId) throw new ApiError(401, "Unauthorized request");

  const subscription = await Subscription.findOne({
    subscription: userId,
    channel: name,
  });

  if (subscription) {
    await Subscription.findByIdAndDelete(subscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed successfully"));
  }

  if (!subscription) throw new ApiError(400, "Subscription not found");

  const newSubscription = await Subscription.create({
    subscription: userId,
    channel: name,
  });

  if (!newSubscription)
    throw new ApiError(400, "Failed to create subscription");

  return res
    .status(201)
    .json(new ApiResponse(201, newSubscription, "Subscribed successfully"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) throw new ApiError(400, "Channel name is required");

  const subscribers = await Subscription.find({ channel: name });

  if (!subscribers)
    throw new ApiError(404, "No subscribers found for this channel");

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "SubscriberId is Requried");

  const channels = await Subscription.find({ subscriber: id });

  if (!channels)
    throw new ApiError(404, "No subscribed channels found for this user");

  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
