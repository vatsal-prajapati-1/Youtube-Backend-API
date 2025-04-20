# Youtube Backend API for Video Platform

A robust Youtube backend API built with Node.js and Express for a video platform application. This API provides features for user authentication, video management, likes/comments system, and dashboard analytics.

## Features

- **User Management**

  - User registration and authentication
  - JWT-based authentication with access and refresh tokens
  - Profile management with avatar and cover image
  - Watch history tracking

- **Video Management**

  - Video upload and management
  - Thumbnail generation
  - Video metadata management
  - View count tracking

- **Social Features**

  - Comments system
  - Like/dislike functionality
  - Playlist management
  - Channel subscriptions
  - Tweet system for community engagement

- **Analytics Dashboard**
  - Channel statistics
  - Video performance metrics
  - Platform-wide analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Password Hashing**: Bcrypt
- **Development**: Nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- Cloudinary account

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=*

   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Running the Application

Development mode with hot reload:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token

### User Management

- `GET /api/v1/users/current-user` - Get current user details
- `PATCH /api/v1/users/update-account` - Update user account
- `PATCH /api/v1/users/avatar` - Update avatar
- `PATCH /api/v1/users/cover-image` - Update cover image

### Video Management

- `POST /api/v1/videos` - Upload a new video
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:videoId` - Get video details
- `PATCH /api/v1/videos/:videoId` - Update video details
- `DELETE /api/v1/videos/:videoId` - Delete a video

### Social Features

- `POST /api/v1/comments` - Add a comment
- `GET /api/v1/comments/:videoId` - Get video comments
- `POST /api/v1/likes/toggle/v/:videoId` - Toggle video like
- `POST /api/v1/likes/toggle/c/:commentId` - Toggle comment like
- `POST /api/v1/subscriptions/c/:channelId` - Toggle channel subscription

### Dashboard

- `GET /api/v1/dashboard/stats` - Get platform statistics
- `GET /api/v1/dashboard/channel/stats` - Get channel statistics
- `GET /api/v1/dashboard/channel/videos` - Get channel videos

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes with middleware
- File upload validation
- Request rate limiting

## Error Handling

The API implements a standardized error handling mechanism with appropriate HTTP status codes and error messages.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License
