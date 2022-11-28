import { alphabetical, pattern, schema, truthy, length } from "@stoplight/spectral-functions";
import { oas2, oas3 } from "@stoplight/spectral-formats";
import { DiagnosticSeverity } from "@stoplight/types";


export default {

  // extends: [
  //   'spectral:oas'
  // ],

  aliases: {
    // OAS Aliases
    // TODO Remove these once they're available in spectral:oas
    PathItem: ['$.paths[*]'],
    OperationObject: ['#PathItem[get,put,post,delete,options,head,patch,trace]'],

    // Custom Aliases
    SharedSchemaObjects: {
      description: "Shared schemas (a.k.a Models) are the main domain models and need to be well documented.",
      targets: [
        {
          formats: [oas2],
          given: ['$.definitions[*]'],
        },
        {
          formats: [oas3],
          given: ['$.components.schemas[*]'],
        }
      ]
    },

    DescribableObjects: {
      description: "All objects that should be described.",
      targets: [
        {
          formats: [oas2],
          given: [
            '$.info',
            '$.tags[*]',
            '#OperationObject',
            '$.paths[*][*].responses[*]',
            '$..parameters[?(@ && @.in)]',
          ],
        },
        {
          formats: [oas3],
          given: [
            '$.info',
            '$.tags[*]',
            '#OperationObject',
            '$.paths[*][*].responses[*]',
            '$..parameters[?(@ && @.in)]',
            '$.definitions[*]',
            '$.components.schemas[*]',
            '$.servers[*]',
          ],
        }
      ]
    },

  },

  rules: {

    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-descriptions': {
      description: "Documentation tools use description to provide more context to users of the API who are not as familiar with the concepts as the API designers are.",
      severity: DiagnosticSeverity.Warning,
      given: "#DescribableObjects",
      then: [
        {
          field: 'description',
          function: truthy,
        },
        {
          field: 'description',
          function: length,
          functionOptions: {
            min: 20
          }
        },
        {
          field: 'description',
          function: pattern,
          functionOptions: {
            match: '.$'
          }
        },
        {
          field: 'description',
          function: pattern,
          functionOptions: {
            match: '/^[A-Z]/'
          }
        },
      ]
    },
    
    'docs-info-contact': {
      description: 'Providing contact means that API consumers can get in touch with you, which can be confusing even if you all work at the same company. This could be a specific developer or a team, depending on the organization.',
      severity: DiagnosticSeverity.Warning,
      given: '$',
      then: {
        field: 'info.contact',
        function: truthy,
      },
    },

    'docs-tags-alphabetical': {
      message: "Tags should be defined in alphabetical order",
      description: 'Many documentation tools show tags in the order they are defined, so defining them not in alphabetical order can look funny to API consumers.',
      severity: DiagnosticSeverity.Warning,
      given: '$',
      then: {
        field: 'tags',
        function: alphabetical,
        functionOptions: {
          keyedBy: 'name',
        },
      },
    },

    'docs-operationId-valid-in-url': {
      message: 'operationId must not characters that are invalid when used in URL.',
      description: 'Most documentation tools use the operationId to produce URLs, so the characters used must be URL friendly.',
      given: '#OperationObject',
      severity: DiagnosticSeverity.Error,
      then: {
        field: 'operationId',
        function: pattern,
        functionOptions: {
          match: "^[A-Za-z0-9-._~:/?#\\[\\]@!\\$&'()*+,;=]*$",
        },
      },
    },

    'docs-operation-tags': {
      description: 'Operation must have non-empty `tags` array.',
      severity: DiagnosticSeverity.Warning,
      given: '#OperationObject',
      then: {
        field: 'tags',
        function: schema,
        functionOptions: {
          schema: {
            type: 'array',
            minItems: 1,
          },
        },
      },
    },

    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-schema-description': {
      message: "Schemas should contain descriptions.",
      description: "API consumers have less context than the API developers, so providing high quality descriptions of shared schemas (a.k.a Models or Definitions) can help a lot. Explain what this schema is, in terms useful to an API consumer who might be coming across these terms for the first time, or might assume a different meaning to the one intended.",
      severity: DiagnosticSeverity.Warning,
      given: "#SharedSchemaObjects",
      then: {
        field: 'description',
        function: truthy,
      }
    },

    // ### Grammar check

    // https://github.com/api-stuff/spectral-spelling-grammar
  },
};
