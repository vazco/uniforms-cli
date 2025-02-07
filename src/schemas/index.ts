const GraphQlBridge = `
import { GraphQLBridge } from 'uniforms-bridge-graphql';
import { buildASTSchema, parse } from 'graphql';

const schema = \`
    type Author {
        name: String!
        birthYear: Int
        bookCount: Int
    }

    # This is required by buildASTSchema
    type Query { anything: ID }
\`;

const schemaType = buildASTSchema(parse(schema)).getType('Author');
const schemaExtras = {
  id: {
    options: [
      { label: 1, value: 1 },
      { label: 2, value: 2 },
      { label: 3, value: 3 },
    ],
  },
  title: {
    options: [
      { label: 1, value: 'a' },
      { label: 2, value: 'b' },
    ],
  },
  'author.firstName': {
    placeholder: 'John',
  },
};

const schemaValidator = (model: object) => {
  const details = [];

  if (!model.id) {
    details.push({ name: 'id', message: 'ID is required!' });
  }

  if (!model.author.id) {
    details.push({ name: 'author.id', message: 'Author ID is required!' });
  }

  if (model.votes < 0) {
    details.push({
      name: 'votes',
      message: 'Votes must be a non-negative number!',
    });
  }

  return details.length ? { details } : null;
};

const bridge = new GraphQLBridge({
  schema: schemaType,
  validator: schemaValidator,
  extras: schemaExtras,
});`;

const JSONSchemaBridge = `import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';

const ajv = new Ajv({ allErrors: true, useDefaults: true });

const schema = {
  title: 'Person',
  type: 'object',
  properties: {
    authorName: { type: 'string' },
    birthYear: { type: 'integer' },
    bookCount: {
      description: 'Count of books created by author',
      type: 'integer',
      minimum: 0,
    },
  },
  required: ['authorName'],
};

function createValidator(schema: object) {
  const validator = ajv.compile(schema);

  return (model: object) => {
    validator(model);
    return validator.errors?.length ? { details: validator.errors } : null;
  };
}

const validator = createValidator(schema);

const bridge = new JSONSchemaBridge({ schema, validator });`;

const SimpleSchema2Bridge = `import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

const schema = new SimpleSchema({
  authorName: {
    type: String,
  },
  birthYear: {
    type: Number,
    optional: true,
  },
  bookCount: {
    type: Number,
    optional: true,
  }
});

const bridge = new SimpleSchema2Bridge({ schema });`;

const SimpleSchemaBridge = `import SimpleSchemaBridge from 'uniforms-bridge-simple-schema';
import { SimpleSchema } from 'aldeed:simple-schema';

const schema = new SimpleSchema({
  authorName: {
    type: String,
  },
  birthYear: {
    type: Number,
    optional: true,
  },
  bookCount: {
    type: Number,
    optional: true,
  }
});

const bridge = new SimpleSchemaBridge({ schema });`;

const ZodBridge = `import ZodBridge from 'uniforms-bridge-zod';
import z from 'zod';

const schema = z.object({ authorName: z.string(), birthYear: z.number(), bookCount: z.number() });

const bridge = new ZodBridge({ schema });`;

export const formSchemas = {
  GraphQl: GraphQlBridge,
  'JSON-schema': JSONSchemaBridge,
  'Simple-Schema': SimpleSchemaBridge,
  'Simple-Schema-2': SimpleSchema2Bridge,
  Zod: ZodBridge,
};
