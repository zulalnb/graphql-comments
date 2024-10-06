import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";
import { WebSocketServer } from "ws"; // Import WebSocket server
import { useServer } from "graphql-ws/lib/use/ws"; // Import graphql-ws useServer function
import pubSub from "./pubSub.js";
import db from "./data.js";
import schema from "./graphql/schema.js";

// Create the Yoga app with WebSocket support for GraphiQL
const yoga = createYoga({
  schema,
  logging: true,
  context: { pubSub, db },
  graphiql: {
    // Enable WebSockets in GraphiQL
    subscriptionsProtocol: "WS",
  },
});

// Create the HTTP server
const server = createServer(yoga);

// Create the WebSocket server
const wsServer = new WebSocketServer({
  server, // Bind the WebSocket server to the HTTP server
  path: yoga.graphqlEndpoint, // Ensure it uses the same path as GraphQL endpoint
});

// Integrate Yoga's Envelop instance with graphql-ws
useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: { execute, subscribe },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer // Pass the WebSocket server to handle WebSocket connections
);

// Start the HTTP server
server.listen(4000, () => {
  console.log("Server started on port 4000 with WebSocket support");
});
