import { filter, pipe } from "graphql-yoga";

const Subscription = {
  // User
  userCreated: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("userCreated"),
  },
  userUpdated: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("userUpdated"),
  },
  userDeleted: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("userDeleted"),
  },

  // Post
  postCreated: {
    subscribe: (_, args, { pubSub }) =>
      pipe(
        pubSub.asyncIterator("postCreated"),
        filter((payload) =>
          args.user_id ? payload.postCreated.user === args.user_id : true
        )
      ),
  },
  postUpdated: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("postUpdated"),
  },
  postDeleted: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("postDeleted"),
  },
  postCount: {
    subscribe: async (_, __, { pubSub, _db }) => {
      const postCount = await _db.Post.countDocuments();
      setTimeout(() => {
        pubSub.publish("postCount", { postCount });
      });
      return pubSub.asyncIterator("postCount");
    },
  },

  // Comment
  commentCreated: {
    subscribe: (_, args, { pubSub }) =>
      pipe(
        pubSub.asyncIterator("commentCreated"),
        filter((payload) =>
          args.post_id ? payload.commentCreated.post === args.post_id : true
        )
      ),
  },
  commentUpdated: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("commentUpdated"),
  },
  commentDeleted: {
    subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("commentDeleted"),
  },
};

export default { Subscription };
