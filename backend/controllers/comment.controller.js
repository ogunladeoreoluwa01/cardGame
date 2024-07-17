const Comment = require("../models/commentsModel.js");

// Add a new comment
const addComment = (req, res) => {
  const data = {
    authorId: req.body.authorId, // Use authorId directly to reference the User
    commentText: req.body.commentText,
    postId: req.body.postId, // Ensure postId is set
    depth: req.body.depth || 1, // Default depth to 1 if not provided
    parentId: req.body.parentId || null, // Default parentId to null if not provided
  };

  const comment = new Comment(data);
  comment
    .save()
    .then((comment) =>
      res.json({
        comment: comment,
      })
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Update an existing comment
const updateComment = (req, res) => {
  const { commentId, commentText } = req.body;

  Comment.updateOne({ _id: commentId }, { $set: { commentText: commentText } })
    .exec()
    .then((result) =>
      res.status(200).json({
        message: "Comment Updated",
        result: result,
      })
    )
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Get all comments for a post and build the comment thread
const getComments = (req, res) => {
  const postId = req.params.postId;

  Comment.find({ postId: postId })
    .sort({ postedDate: 1 })
    .lean()
    .exec()
    .then((comments) => {
      const buildThreads = (comment, threads) => {
        for (const threadId in threads) {
          const thread = threads[threadId];

          if (thread._id.toString() === comment.parentId?.toString()) {
            thread.children[comment._id] = comment;
            return;
          }

          if (thread.children) {
            buildThreads(comment, thread.children);
          }
        }
      };

      const threads = {};
      comments.forEach((comment) => {
        comment.children = {};
        if (!comment.parentId) {
          threads[comment._id] = comment;
        } else {
          buildThreads(comment, threads);
        }
      });

      res.json({
        count: comments.length,
        comments: threads,
      });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};
const deleteCommentsRecursively = (commentId) => {
  return Comment.find({ parentId: commentId })
    .then((subComments) => {
      const deletionPromises = subComments.map((subComment) =>
        deleteCommentsRecursively(subComment._id)
      );
      return Promise.all(deletionPromises);
    })
    .then(() => {
      return Comment.deleteOne({ _id: commentId });
    });
};

// Delete a comment and its sub-comments
const deleteComment = (req, res) => {
  const { commentId } = req.params;

  deleteCommentsRecursively(commentId)
    .then(() => {
      res.status(200).json({
        message: "Comment and sub-comments deleted",
      });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

module.exports = {
  addComment,
  updateComment,
  getComments,
  deleteCommentsRecursively,
  deleteComment,
};
