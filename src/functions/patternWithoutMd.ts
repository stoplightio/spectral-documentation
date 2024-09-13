import { createRulesetFunction } from '@stoplight/spectral-core';
import { PatternOptions, pattern } from '@stoplight/spectral-functions';

const removeMd = require('remove-markdown');

export default createRulesetFunction<string, PatternOptions>({
  input: {
    type: 'string',
  },
  options: {
    type: 'object',
    additionalProperties: false,
    properties: {
      match: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'object',
            properties: {
              exec: {},
              test: {},
              flags: {
                type: 'string',
              },
            },
            required: ['test', 'flags'],
            'x-internal': true,
          },
        ],
        errorMessage: `"pattern" function and its "match" option must be string or RegExp instance`,
        description: 'If provided, value must match this regex.',
      },
      notMatch: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'object',
            properties: {
              exec: {},
              test: {},
              flags: {
                type: 'string',
              },
            },
            required: ['test', 'flags'],
            'x-internal': true,
          },
        ],
        errorMessage: `"pattern" function and its "notMatch" option must be string or RegExp instance`,
        description: 'If provided, value must _not_ match this regex.',
      },
    },
    minProperties: 1,
    errorMessage: {
      type: `"pattern" function has invalid options specified. Example valid options: { "match": "^Stoplight" }, { "notMatch": "Swagger" }, { "match": "Stoplight", "notMatch": "Swagger" }`,
      minProperties: `"pattern" function has invalid options specified. Example valid options: { "match": "^Stoplight" }, { "notMatch": "Swagger" }, { "match": "Stoplight", "notMatch": "Swagger" }`,
    },
  },
}, (description: string, options, context) => {

  // Remove markdown syntax from the description
  const strippedDescription = removeMd(description);

  // Call the pattern function with the stripped description
  return pattern(strippedDescription, options, context);
});
