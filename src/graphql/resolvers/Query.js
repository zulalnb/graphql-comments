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
  posts: async (_, __, { _db }) => {
    const posts = await _db.Post.find();
    return posts;
  },
  post: async (_, args, { _db }) => {
    // db.posts.find((post) => post.id === args.id);

    const post = await _db.Post.findById(args.id);
    return post;
  },

  // comment
  comments: (_, __, { db }) => db.comments,
  comment: (_, args, { db }) =>
    db.comments.find((comment) => comment.id === args.id),
};

export default { Query };
