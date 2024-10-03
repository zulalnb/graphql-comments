import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import pubSub from "./pubSub.js";

// import typeDefs from "./graphql/type-defs/index.js";

// import resolvers from "./graphql/resolvers/index.js";
import db from "./data.js";
import schema from "./graphql/schema.js";

const yoga = createYoga({
  schema,
  logging: true,
  context: { pubSub, db },
});

const server = createServer(yoga);
server.listen(4000, () => console.log("Server started on port 4000"));
