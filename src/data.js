const users = [
  {
    id: "1",
    fullName: "Mehmet Seven",
    age: 32,
  },
  {
    id: "2",
    fullName: "Ahmet Günal",
    age: 34,
  },
];

const posts = [
  {
    id: "1",
    title: "Mehmet'in gönderisi",
    user_id: "1",
  },
  {
    id: "2",
    title: "Mehmet'in diğer gönderisi",
    user_id: "1",
  },
  {
    id: "3",
    title: "Ahmet'in gönderisi",
    user_id: "2",
  },
];

const comments = [
  {
    id: "1",
    text: "Bu Ahmet'in yorumudur",
    post_id: "1",
    user_id: "2",
  },
  {
    id: "2",
    text: "Bu Mehmet'in yorumudur",
    post_id: "1",
    user_id: "1",
  },
  {
    id: "3",
    text: "Bu Ahmet'in yorumudur",
    post_id: "2",
    user_id: "2",
  },
  {
    id: "4",
    text: "Bu Mehmet'in yorumudur",
    post_id: "3",
    user_id: "1",
  },
];

export default { users, posts, comments };
