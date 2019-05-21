import { makeExecutableSchema } from 'graphql-tools';
import admin from 'firebase-admin';

const typeDefs = [
  `
type Query {
  hello: String
}

schema {
  query: Query
}`,
];

export function createSchema(firebase: admin.app.App) {
  const resolvers = {
    Query: {
      hello() {
        return 'world';
      },
    },
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  return schema;
}
