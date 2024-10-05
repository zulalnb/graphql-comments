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
    short_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    user_id: "1",
    cover: "https://images.unsplash.com/photo-1719937051157-d3d81cc28e86",
  },
  {
    id: "2",
    title: "Mehmet'in diğer gönderisi",
    short_description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    user_id: "1",
    cover: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34",
  },
  {
    id: "3",
    title: "Ahmet'in gönderisi",
    short_description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
    user_id: "2",
    cover: "https://images.unsplash.com/photo-1480497490787-505ec076689f",
  },
  {
    id: "4",
    title: "Ahmet'in diğer gönderisi",
    short_description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
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
