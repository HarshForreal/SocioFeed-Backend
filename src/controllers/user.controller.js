import * as userService from '../services/user/getUserProfile.service.js';
import * as editProfileService from '../services/user/editUserProfile.service.js';
import * as followService from '../services/user/followUser.service.js';
import * as unfollowService from '../services/user/unfollowUser.service.js';
import * as getFollowersService from '../services/user/getFollowers.service.js';
import * as getFollowingService from '../services/user/getFollowing.service.js';
import * as searchService from '../services/user/searchUsers.service.js';
import * as getUserPostsService from '../services/user/getUserPosts.service.js';
import { uploadAvatarService } from '../services/user/uploadAvatar.service.js';
import { ERROR_MESSAGES } from '../utils/errorMessages.js';

export const getUserProfile = async (req, res) => {
  try {
    // Expecting either :username param or :userId param (you can design route accordingly)
    const identifier = req.params.username || req.params.userId;

    const result = await userService.getUserProfile(identifier);

    res.status(result.status).json(result.userProfile);
  } catch (err) {
    console.error('Get User Profile error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const editUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, bio, avatarUrl } = req.body;

    const result = await editProfileService.editUserProfile(userId, {
      username,
      bio,
      avatarUrl,
    });

    res.status(result.status).json(result.updatedUser);
  } catch (err) {
    console.error('Edit Profile error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Server error' });
  }
};

export const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = req.params.userId;

    const result = await followService.followUser(followerId, followeeId);

    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Follow User error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = req.params.userId;

    const result = await unfollowService.unfollowUser(followerId, followeeId);

    res.status(result.status).json({ message: result.message });
  } catch (err) {
    console.error('Unfollow User error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const result = await getFollowersService.getFollowers(userId);

    res.status(result.status).json({ followers: result.followers });
  } catch (err) {
    console.error('Get Followers error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const result = await getFollowingService.getFollowing(userId);

    res.status(result.status).json({ following: result.following });
  } catch (err) {
    console.error('Get Following error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    const result = await searchService.searchUsers(q, currentUserId);

    res.status(result.status).json({ users: result.users });
  } catch (err) {
    console.error('User Search error:', err);
    res
      .status(err.status || 500)
      .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 10;
    const result = await getUserPostsService.getUserPosts(userId, {
      skip,
      take,
    });
    res.status(result.status).json({ posts: result.posts });
  } catch (error) {
    console.error('Get User Posts error:', error);
    res
      .status(error.status || 500)
      .json({ message: error.message || ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const userId = req.user.id; // Get user ID from auth middleware

    console.log('Uploading avatar for user:', userId);

    const result = await uploadAvatarService(req.file.buffer, userId);

    console.log('Avatar upload result:', result);

    res.status(200).json({
      url: result.url,
      user: result.user,
      message: 'Avatar uploaded and profile updated successfully',
    });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
