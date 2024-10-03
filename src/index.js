import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import pubSub from "./pubSub.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

import resolvers from "./graphql/resolvers/index.js";
import db from "./data.js";

// Get the filename and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use path.join for correct path handling on Windows
const schemaPath = join(__dirname, "graphql", "schema.graphql");

const yoga = createYoga({
  schema: createSchema({
    resolvers,
    typeDefs: readFileSync(schemaPath, "utf8"),
  }),
  logging: true,
  context: { pubSub, db },
});

const server = createServer(yoga);
server.listen(4000, () => console.log("Server started on port 4000"));
