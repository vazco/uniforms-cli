export const formSchemas = {
  GraphQL: `type Author {
  AuthorName: String!
  BookCount: Int!
  DateOfBirth: String!
}

type Query {
  getAuthor(id: ID!): Author
}`,
  'JSON-schema': ``,
  'Simple-Schema': ``,
  'Simple-Schema-2': ``,
  Zod: ``,
};
