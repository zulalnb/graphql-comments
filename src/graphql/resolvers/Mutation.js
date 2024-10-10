import mongoose from "mongoose";
import { nanoid } from "nanoid";

const Mutation = {
  // User
  createUser: async (_, { data }, { pubSub, _db }) => {
    const newUser = new _db.User(data);
    const user = await newUser.save();

    pubSub.publish("userCreated", { userCreated: user });

    return user;
  },
  updateUser: async (_, { id, data }, { pubSub, _db }) => {
    const is_user_exist = await _db.User.findById(id);

    if (!is_user_exist) {
      throw new Error("User not found.");
    }

    const updated_user = await _db.User.findByIdAndUpdate(id, data, {
      new: true,
    });

    pubSub.publish("userUpdated", { userUpdated: updated_user });

    return updated_user;
  },
  deleteUser: async (_, { id }, { pubSub, _db }) => {
    const is_user_exist = await _db.User.findById(id);

    if (!is_user_exist) {
      throw new Error("User not found.");
    }

    const deleted_user = await _db.User.findByIdAndDelete(id);

    pubSub.publish("userDeleted", { userDeleted: deleted_user });

    return deleted_user;
  },
  deleteAllUsers: async (_, __, { _db }) => {
    const delete_users = await _db.User.deleteMany();

    return { count: delete_users.deletedCount };
  },

  // Post
  createPost: async (_, { data }, { pubSub, _db }) => {
    const user = await _db.User.findById(
      new mongoose.Types.ObjectId(data.user)
    );
    if (!user) {
      throw new Error("User not found.");
    }

    const newPost = new _db.Post(data);
    const post = await newPost.save();

    user.posts.push(post.id);
    user.save();

    const postCount = await _db.Post.countDocuments();

    pubSub.publish("postCreated", { postCreated: post });
    pubSub.publish("postCount", { postCount });

    return post;
  },
  updatePost: async (_, { id, data }, { pubSub, _db }) => {
    const is_post_exist = await _db.Post.findById(id);
    if (!is_post_exist) {
      throw new Error("Post not found.");
    }

    const updated_post = await _db.Post.findByIdAndUpdate(id, data, {
      new: true,
    });

    pubSub.publish("postUpdated", { postUpdated: updated_post });

    return updated_post;
  },
  deletePost: async (_, { id }, { pubSub, _db }) => {
    const post = await _db.Post.findById(id);

    if (!post) {
      throw new Error("Post not found.");
    }

    const user = await _db.User.findById(post.user);
    user.posts = user.posts.filter((post_id) => post_id.toString() !== id);
    user.save();

    const postCount = await _db.Post.countDocuments();
    const deleted_post = await _db.Post.findByIdAndDelete(id);

    pubSub.publish("postDeleted", { postDeleted: deleted_post });
    pubSub.publish("postCount", { postCount });

    return deleted_post;
  },
  deleteAllPosts: async (_, __, { pubSub, _db }) => {
    const delete_posts = await _db.Post.deleteMany();
    await _db.User.updateMany({}, { $set: { posts: [] } });

    pubSub.publish("postCount", { postCount: delete_posts.deletedCount });
    return { count: delete_posts.deletedCount };
  },

  // Comment
  createComment: async (_, { data }, { pubSub, _db }) => {
    const user = await _db.User.findById(
      new mongoose.Types.ObjectId(data.user)
    );
    if (!user) {
      throw new Error("User not found.");
    }
    const post = await _db.Post.findById(
      new mongoose.Types.ObjectId(data.post)
    );
    if (!post) {
      throw new Error("Post not found.");
    }

    const newComment = new _db.Comment(data);
    const comment = await newComment.save();

    user.comments.push(comment.id);
    post.comments.push(comment.id);

    await user.save();
    await post.save();

    pubSub.publish("commentCreated", { commentCreated: comment });

    return comment;
  },
  updateComment: async (_, { id, data }, { pubSub, _db }) => {
    const is_comment_exist = await _db.Comment.findById(id);
    if (!is_comment_exist) {
      throw new Error("Comment not found.");
    }

    const updated_comment = await _db.Comment.findByIdAndUpdate(id, data, {
      new: true,
    });

    pubSub.publish("commentUpdated", { commentUpdated: updated_comment });

    return updated_comment;
  },
  deleteComment: async (_, { id }, { pubSub, _db }) => {
    const comment = await _db.Comment.findById(id);

    if (!comment) {
      throw new Error("Comment not found.");
    }

    const user = await _db.User.findById(comment.user);
    const post = await _db.Post.findById(comment.post);

    user.comments = user.comments.filter(
      (comment_id) => comment_id.toString() !== id
    );
    post.comments = post.comments.filter(
      (comment_id) => comment_id.toString() !== id
    );

    await user.save();
    await post.save();

    const deleted_comment = await _db.Comment.findByIdAndDelete(id);

    pubSub.publish("commentDeleted", { commentDeleted: deleted_comment });

    return deleted_comment;
  },
  deleteAllComments: async (_, __, { _db }) => {
    const delete_comments = await _db.Comment.deleteMany();
    await _db.User.updateMany({}, { $set: { comments: [] } });
    await _db.Post.updateMany({}, { $set: { comments: [] } });

    return { count: delete_comments.deletedCount };
  },
};

export default { Mutation };
