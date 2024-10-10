const Query = {
  // user
  users: async (_, __, { _db }) => {
    const users = await _db.User.find();
    return users;
  },
  user: async (_, args, { _db }) => {
    // db.users.find((user) => user.id === args.id)
    const user = await _db.User.findById(args.id);
    return user;
  },

  // post
  posts: (_, __, { db }) => db.posts,
  post: (_, args, { db }) => db.posts.find((post) => post.id === args.id),

  // comment
  comments: (_, __, { db }) => db.comments,
  comment: (_, args, { db }) =>
    db.comments.find((comment) => comment.id === args.id),
};

export default { Query };
