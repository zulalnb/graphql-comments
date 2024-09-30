import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { events, locations, participants, users } from "./data.js";

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    participants: [Participant!]!
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    user: User!
    participants: [Participant!]!
    location: Location!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }

  type Participant {
    id: ID!
    event: Event!
    user: User!
  }

  type Query {
    # User
    users: [User!]!
    user(id: ID!): User!

    # Event
    events: [Event!]!
    event(id: ID!): Event!

    # Location
    locations: [Location!]!
    location(id: ID!): Location!

    # Participant
    participants: [Participant!]!
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    // user
    users: () => users,
    user: (parent, args) =>
      users.find((user) => user.id.toString() === args.id),

    // event
    events: () => events,
    event: (parent, args) =>
      events.find((event) => event.id.toString() === args.id),

    // location
    locations: () => locations,
    location: (parents, args) =>
      locations.find((location) => location.id.toString() === args.id),

    // participant
    participants: () => participants,
    participant: (parents, args) =>
      participants.find((participant) => participant.id.toString() === args.id),
  },

  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    participants: (parent) =>
      participants.filter((participant) => participant.event_id === parent.id),
    location: (parent) =>
      locations.find((location) => location.id === parent.location_id),
  },

  Participant: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
