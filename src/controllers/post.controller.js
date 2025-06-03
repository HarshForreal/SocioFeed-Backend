import { createPost } from '../services/post/createPost.service.js';
import { getFeed } from '../services/post/getFeed.service.js';
import { likePost } from '../services/post/likePost.service.js';
import { savePost, unsavePost } from '../services/post/savePost.service.js';
import { STATUS } from '../utils/responseStatus.js';
import { ERROR_MESSAGES } from '../utils/errorMessages.js';
import { uploadPostImagesService } from '../services/post/uploadPostImages.service.js';
import { getPostById } from '../services/post/getPostById.service.js';
import { deletePost } from '../services/post/deletePost.service.js';
import { addComment } from '../services/post/addComment.service.js';
import { getCommentsByPostId } from '../services/post/getCommentsByPostId.service.js';
import { editComment } from '../services/post/editComment.service.js';
import { deleteComment } from '../services/post/deleteComment.service.js';
import { getSavedPosts } from '../services/post/getSavedPosts.service.js';

export const handleCreatePost = async (req, res) => {
  try {
    const { content, imageUrls } = req.body;
    const userId = req.user.id;

    if (!content && (!imageUrls || imageUrls.length === 0)) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
    }

    const newPost = await createPost(userId, content, imageUrls);
    res.status(STATUS.CREATED).json(newPost);
  } catch (err) {
    console.error('Create Post Error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleGetFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getFeed(userId, page, limit);
    res.status(STATUS.OK).json(result);
  } catch (err) {
    console.error('Get Feed Error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleToggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const result = await likePost(userId, postId);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Like Post Error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleSavePost = async (req, res) => {
  try {
    const result = await savePost(req.user.id, req.params.id);
    res.status(result.status).json(result.body);
  } catch (err) {
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleUnsavePost = async (req, res) => {
  try {
    const result = await unsavePost(req.user.id, req.params.id);
    res.status(result.status).json(result.body);
  } catch (err) {
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: 'No images uploaded' });
    }

    const imageBuffers = req.files.map((file) => file.buffer);
    const imageUrls = await uploadPostImagesService(imageBuffers);

    res.status(STATUS.OK).json({ imageUrls });
  } catch (err) {
    console.error('Image upload error:', err);
    const isMulterError = err.message.includes(
      'Only JPEG and PNG images are allowed'
    );
    res.status(STATUS.BAD_REQUEST).json({
      message: isMulterError ? err.message : ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

export const handleGetPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Get Post By ID error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleDeletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const result = await deletePost(userId, postId);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Delete Post Error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleAddComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { content } = req.body;

    const result = await addComment(userId, postId, content);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Add Comment Error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleGetComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await getCommentsByPostId(postId);
    res.status(200).json({ comments });
  } catch (err) {
    console.error('Get Comments Error:', err);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleEditComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const { content } = req.body;
    const result = await editComment(commentId, userId, content);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Edit Comment Error', error);
    res
      .status(STATUS.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const handleDeleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const result = await deleteComment(commentId, userId);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleGetSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 10;

    const posts = await getSavedPosts(userId, skip, take);
    res.status(200).json({ posts });
  } catch (err) {
    console.error('Get Saved Posts Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
