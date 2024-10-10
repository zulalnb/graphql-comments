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

    user.posts.push(post._id);
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
  createComment: (_, { data }, { pubSub, db }) => {
    const comment = { id: nanoid(), ...data };
    db.comments.push(comment);

    pubSub.publish("commentCreated", { commentCreated: comment });

    return comment;
  },
  updateComment: (_, { id, data }, { pubSub, db }) => {
    const comment_index = db.comments.findIndex((comment) => comment.id === id);
    if (comment_index === -1) {
      throw new Error("Comment not found.");
    }

    const updated_comment = (db.comments[comment_index] = {
      ...db.comments[comment_index],
      ...data,
    });

    pubSub.publish("commentUpdated", { commentUpdated: updated_comment });

    return updated_comment;
  },
  deleteComment: (_, { id }, { pubSub, db }) => {
    const comment_index = db.comments.findIndex((comment) => comment.id === id);

    if (comment_index === -1) {
      throw new Error("Comment not found.");
    }

    const deleted_comment = db.comments[comment_index];
    db.comments.splice(comment_index, 1);

    pubSub.publish("commentDeleted", { commentDeleted: deleted_comment });

    return deleted_comment;
  },
  deleteAllComments: (_, __, { db }) => {
    const length = db.comments.length;
    db.comments.splice(0, length);
    return { count: length };
  },
};

export default { Mutation };
