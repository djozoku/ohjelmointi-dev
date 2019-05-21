import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = [
  `
type Query {
  hello: String
}

schema {
  query: Query
}`,
];

const resolvers = {
  Query: {
    hello() {
      return 'world';
    },
  },
};

// TODO: refactor to function so we can get firebase sdk here
export const schema = makeExecutableSchema({ typeDefs, resolvers });
