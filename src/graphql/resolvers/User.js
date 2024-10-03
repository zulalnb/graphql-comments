const User = {
  posts: (parent, _, __, { db }) =>
    db.posts.filter((post) => post.user_id === parent.id),
  comments: (parent, __, { db }) =>
    db.comments.filter((comment) => comment.user_id === parent.id),
};

export default User;
