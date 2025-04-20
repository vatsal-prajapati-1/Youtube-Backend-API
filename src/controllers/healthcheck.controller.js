import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const healthcheck = asyncHandler(async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    mongoStatus:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  };

  try {
    return res
      .status(200)
      .json(new ApiResponse(200, healthcheck, "Health check successful"));
  } catch (error) {
    if (!error) throw new ApiError(404, "Error in health check");
    healthcheck.message = error;
    return res
      .status(503)
      .json(new ApiResponse(503, healthcheck, "Health check failed"));
  }
});

export { healthcheck };
