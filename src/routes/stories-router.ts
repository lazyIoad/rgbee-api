import Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import authenticated from '../utils/auth-util';
import {
  getStoryById,
  postCreateStory,
  postUpvoteStory,
  postDownvoteStory,
  postSaveStory,
} from '../controllers/stories-controller';
import {
  getStoryComments,
  getCommentById,
  postCreateComment,
  postCreateSubComment,
  postUpvoteComment,
  postDownvoteComment,
  postSaveComment,
} from '../controllers/comments-controller';

const router = new Router<DefaultState, Context>({
  prefix: '/api/v1/stories',
});

router.post('/', authenticated(), postCreateStory);
router.get('/:storyId', getStoryById);
router.post('/:storyId/upvote', authenticated(), postUpvoteStory);
router.post('/:storyId/downvote', authenticated(), postDownvoteStory);
router.post('/:storyId/save', authenticated(), postSaveStory);

router.get('/:storyId/comments', getStoryComments);
router.post('/:storyId/comments', authenticated(), postCreateComment);
router.get('/:storyId/comments/:commentId', authenticated(), getCommentById);
router.post('/:storyId/comments/:commentId', authenticated(), postCreateSubComment);
router.post('/:storyId/comments/:commentId/upvote', authenticated(), postUpvoteComment);
router.post('/:storyId/comments/:commentId/downvote', authenticated(), postDownvoteComment);
router.post('/:storyId/comments/:commentId/save', authenticated(), postSaveComment);

export default router.routes();
