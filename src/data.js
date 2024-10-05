const users = [
  {
    id: "1",
    fullName: "Mehmet Seven",
    profile_photo: "https://randomuser.me/api/portraits/men/32.jpg",
    age: 32,
  },
  {
    id: "2",
    fullName: "Ahmet Günal",
    profile_photo: "https://randomuser.me/api/portraits/men/62.jpg",
    age: 34,
  },
];

const posts = [
  {
    id: "1",
    title: "Mehmet'in gönderisi",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit provident eum in aut doloremque saepe nulla recusandae expedita accusamus sint. Minus similique dolorem harum est esse aliquam cumque ipsam accusamus!",
    user_id: "1",
    cover: "https://images.unsplash.com/photo-1719937051157-d3d81cc28e86",
  },
  {
    id: "2",
    title: "Mehmet'in diğer gönderisi",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    user_id: "1",
    cover: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34",
  },
  {
    id: "3",
    title: "Ahmet'in gönderisi",
    description:
      "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    user_id: "2",
    cover: "https://images.unsplash.com/photo-1480497490787-505ec076689f",
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
