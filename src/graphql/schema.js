import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

// Handle ES module filename and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all typeDefs (.graphql files) from the type-defs folder
const loadedTypeDefs = await loadFiles(
  path.join(__dirname, "./type-defs/*.graphql"),
  {
    requireMethod: async (filePath) => {
      return (await import(pathToFileURL(filePath).href)).default;
    },
  }
);

// Load all resolver files (.js) from the resolvers folder
const loadedResolvers = await loadFiles(
  path.join(__dirname, "./resolvers/*.js"),
  {
    requireMethod: async (filePath) => {
      return (await import(pathToFileURL(filePath).href)).default;
    },
  }
);

// Merge the typeDefs and resolvers into a schema
const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(loadedTypeDefs),
  resolvers: mergeResolvers(loadedResolvers),
});

export default schema;
