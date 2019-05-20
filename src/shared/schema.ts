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

export const schema = makeExecutableSchema({ typeDefs, resolvers });
