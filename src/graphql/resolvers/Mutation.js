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
  createPost: (_, { data }, { pubSub, db }) => {
    const post = { id: nanoid(), ...data };
    db.posts.unshift(post);

    pubSub.publish("postCreated", { postCreated: post });
    pubSub.publish("postCount", { postCount: db.posts.length });

    return post;
  },
  updatePost: (_, { id, data }, { pubSub, db }) => {
    const post_index = db.posts.findIndex((post) => post.id === id);
    if (post_index === -1) {
      throw new Error("Post not found.");
    }

    const updated_post = (db.posts[post_index] = {
      ...db.posts[post_index],
      ...data,
    });

    pubSub.publish("postUpdated", { postUpdated: updated_post });

    return updated_post;
  },
  deletePost: (_, { id }, { pubSub, db }) => {
    const post_index = db.posts.findIndex((post) => post.id === id);

    if (post_index === -1) {
      throw new Error("Post not found.");
    }

    const deleted_post = db.posts[post_index];
    db.posts.splice(post_index, 1);

    pubSub.publish("postDeleted", { postDeleted: deleted_post });
    pubSub.publish("postCount", { postCount: db.posts.length });

    return deleted_post;
  },
  deleteAllPosts: (_, __, { pubSub, db }) => {
    const length = db.posts.length;
    db.posts.splice(0, length);
    pubSub.publish("postCount", { postCount: db.posts.length });
    return { count: length };
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
