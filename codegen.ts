import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clcrreocx0oot01ur229906i3/master',
  documents: ['./**/*.tsx', './**/*.ts', '!src/gql/**/*'],
  generates: {
    './gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;