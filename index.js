import { createServer } from "node:http";
import { createPubSub, createSchema, createYoga } from "graphql-yoga";

import { nanoid } from "nanoid";

import { users, posts, comments } from "./data.js";

const typeDefs = `#graphql

  # User
  type User {
    id: ID!
    fullName: String!
    age: Int!
    posts: [Post!]!
    comments: [Comment!]!
  }

  input CreateUserInput {
    fullName: String!
    age: Int!
  }

  input UpdateUserInput {
    fullName: String
    age: Int
  }

  # Post
  type Post {
    id: ID!
    title: String!
    user_id: ID!
    user: User!
    comments: [Comment!]!
  }

  input CreatePostInput {
    title: String!
    user_id: ID!
  }

  input UpdatePostInput {
    title: String!
  }

  # Comment
  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user_id: ID!
    user: User!
    post: Post!
  }

  input CreateCommentInput {
    text: String!
    post_id: ID!
    user_id: ID!
  }

  input UpdateCommentInput {
    text: String!
  }

  type DeleteAllOutput {
    count: Int!
  }

  type Query {
    # User
    users: [User!]!
    user(id: ID!): User!

    # Post
    posts: [Post!]!
    post(id: ID!): Post!

    # Comment
    comments: [Comment!]!
    comment(id: ID!): Comment!
  }

  type Mutation {
    # User
    createUser(data: CreateUserInput!): User!
    updateUser(id: ID, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!

    # Post
    createPost(data: CreatePostInput!): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    deletePost(id: ID!): Post!
    deleteAllPosts: DeleteAllOutput!

    # Comment
    createComment(data: CreateCommentInput!): Comment!
    updateComment(id: ID!, data: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
    deleteAllComments: DeleteAllOutput!
  }

  type Subscription {
    # User
    userCreated: User!
    userUpdated: User!
    userDeleted: User!

    # Post
    postCreated: Post!
    postUpdated: Post!
    postDeleted: Post!
    postCount: Int!

    # Comment
    commentCreated: Comment!
    commentUpdated: Comment!
    commentDeleted: Comment!
  }
`;

const pubSub = createPubSub();

const resolvers = {
  Subscription: {
    // User
    userCreated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("userCreated"),
    },
    userUpdated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("userUpdated"),
    },
    userDeleted: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("userDeleted"),
    },

    // Post
    postCreated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("postCreated"),
    },
    postUpdated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("postUpdated"),
    },
    postDeleted: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("postDeleted"),
    },
    postCount: {
      subscribe: (_, __, { pubSub }) => {
        setTimeout(() => {
          pubSub.publish("postCount", { postCount: posts.length });
        });
        return pubSub.subscribe("postCount");
      },
    },

    // Comment
    commentCreated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("commentCreated"),
    },
    commentUpdated: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("commentUpdated"),
    },
    commentDeleted: {
      subscribe: (_, __, { pubSub }) => pubSub.subscribe("commentDeleted"),
    },
  },
  Mutation: {
    // User
    createUser: (_, { data }, { pubSub }) => {
      const user = { id: nanoid(), ...data };

      users.push(user);
      pubSub.publish("userCreated", { userCreated: user });

      return user;
    },
    updateUser: (_, { id, data }, { pubSub }) => {
      const user_index = users.findIndex((user) => user.id === id);
      if (user_index === -1) {
        throw new Error("User not found.");
      }

      const updated_user = (users[user_index] = {
        ...users[user_index],
        ...data,
      });

      pubSub.publish("userUpdated", { userUpdated: updated_user });

      return updated_user;
    },
    deleteUser: (_, { id }, { pubSub }) => {
      const user_index = users.findIndex((user) => user.id === id);

      if (user_index === -1) {
        throw new Error("User not found.");
      }

      const deleted_user = users[user_index];
      users.splice(user_index, 1);

      pubSub.publish("userDeleted", { userDeleted: deleted_user });

      return deleted_user;
    },
    deleteAllUsers: () => {
      const length = users.length;
      users.splice(0, length);
      return { count: length };
    },

    // Post
    createPost: (_, { data }, { pubSub }) => {
      const post = { id: nanoid(), ...data };
      posts.push(post);

      pubSub.publish("postCreated", { postCreated: post });
      pubSub.publish("postCount", { postCount: posts.length });

      return post;
    },
    updatePost: (_, { id, data }, { pubSub }) => {
      const post_index = posts.findIndex((post) => post.id === id);
      if (post_index === -1) {
        throw new Error("Post not found.");
      }

      const updated_post = (posts[post_index] = {
        ...posts[post_index],
        ...data,
      });

      pubSub.publish("postUpdated", { postUpdated: updated_post });

      return updated_post;
    },
    deletePost: (_, { id }, { pubSub }) => {
      const post_index = posts.findIndex((post) => post.id === id);

      if (post_index === -1) {
        throw new Error("Post not found.");
      }

      const deleted_post = posts[post_index];
      posts.splice(post_index, 1);

      pubSub.publish("postDeleted", { postDeleted: deleted_post });
      pubSub.publish("postCount", { postCount: posts.length });

      return deleted_post;
    },
    deleteAllPosts: (_, __, { pubSub }) => {
      const length = posts.length;
      posts.splice(0, length);
      pubSub.publish("postCount", { postCount: posts.length });
      return { count: length };
    },

    // Comment
    createComment: (_, { data }, { pubSub }) => {
      const comment = { id: nanoid(), ...data };
      comments.push(comment);

      pubSub.publish("commentCreated", { commentCreated: comment });

      return comment;
    },
    updateComment: (_, { id, data }, { pubSub }) => {
      const comment_index = comments.findIndex((comment) => comment.id === id);
      if (comment_index === -1) {
        throw new Error("Comment not found.");
      }

      const updated_comment = (comments[comment_index] = {
        ...comments[comment_index],
        ...data,
      });

      pubSub.publish("commentUpdated", { commentUpdated: updated_comment });

      return updated_comment;
    },
    deleteComment: (_, { id }, { pubSub }) => {
      const comment_index = comments.findIndex((comment) => comment.id === id);

      if (comment_index === -1) {
        throw new Error("Comment not found.");
      }

      const deleted_comment = comments[comment_index];
      comments.splice(comment_index, 1);

      pubSub.publish("commentDeleted", { commentDeleted: deleted_comment });

      return deleted_comment;
    },
    deleteAllComments: () => {
      const length = comments.length;
      comments.splice(0, length);
      return { count: length };
    },
  },
  Query: {
    // user
    users: () => users,
    user: (_, args) => users.find((user) => user.id === args.id),

    // post
    posts: () => posts,
    post: (_, args) => posts.find((post) => post.id === args.id),

    // comment
    comments: () => comments,
    comment: (_, args) => comments.find((comment) => comment.id === args.id),
  },
  User: {
    posts: (parent) => posts.filter((post) => post.user_id === parent.id),
    comments: (parent) =>
      comments.filter((comment) => comment.user_id === parent.id),
  },
  Post: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    comments: (parent) =>
      comments.filter((comment) => comment.post_id === parent.id),
  },
  Comment: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    post: (parent) => posts.find((post) => post.id === parent.post_id),
  },
};

const yoga = createYoga({
  schema: createSchema({
    resolvers,
    typeDefs,
  }),
  logging: true,
  context: { pubSub },
});

const server = createServer(yoga);
server.listen(4000, () => console.log("Server started on port 4000"));
