import { alphabetical, pattern, schema, truthy, length } from "@stoplight/spectral-functions";
import { oas2, oas3 } from "@stoplight/spectral-formats";
import { DiagnosticSeverity } from "@stoplight/types";


export default {

  // extends: [
  //   'spectral:oas'
  // ],

  aliases: {
    
    // --- OAS Aliases ---
    // TODO Remove these once they're available in spectral:oas
    PathItem: ['$.paths[*]'],
    OperationObject: ['#PathItem[get,put,post,delete,options,head,patch,trace]'],

    // --- Custom Aliases --- 

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
            '$.definitions[*]',
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
            '$.components.schemas[*]',
            '$.servers[*]',
          ],
        }
      ]
    },

    SharedSchemaObjects: {
      description: "Shared schemas (a.k.a Models) are the main domain objects which are referenced elsewhere.",
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

    MediaTypeObjects: {
      description: "Media Type objects are what OpenAPI calls the object that describes requests and responses, or in OAS2 it was parameters with in=body.",
      targets: [
        {
          formats: [oas2],
          given: [
            '$.paths[*][*]..parameters[?(@ && @.in == "body")]',
            '$.paths[*][*].responses[*]',
          ],
        },
        {
          formats: [oas3],
          given: [
            '$.paths[*][*].requestBody.content[*]',
            '$.paths[*][*].responses[*].content[*]',
          ],
        }
      ]
    },
  },

  rules: {

    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-description': {
      message: "{{error}}.",
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
            match: '/^[A-Z]/'
          }
        },
        {
          field: 'description',
          function: pattern,
          functionOptions: {
            match: '\\.$'
          }
        },
      ]
    },
    
    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-schema-description': {
      message: "{{error}}.",
      description: "API consumers have less context than the API developers, so providing high quality descriptions of shared schemas (a.k.a Models or Definitions) can help a lot. Explain what this schema is, in terms useful to an API consumer who might be coming across these terms for the first time, or might assume a different meaning to the one intended.",
      severity: DiagnosticSeverity.Warning,
      given: "#SharedSchemaObjects",
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
            match: '/^[A-Z]/'
          }
        },
        {
          field: 'description',
          function: pattern,
          functionOptions: {
            match: '\\.$'
          }
        },
      ],
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

    'docs-parameters-anything-useful': {
      message: "No example or schema provided for {{property}}",
      description: 'In order to make a good sample request doc tools will need an x-example, default, enum, or maybe even a format. The more information you can provide the more useful the sample request will be.',
      severity: DiagnosticSeverity.Error,
      formats: [oas2],
      // given: '$.paths[*][*]..parameters[?(@ && @.in != "body")]',
      given: '$.paths[*][*]..parameters',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              { required: ['x-example'] },
              { required: ['example'] },
              { required: ['default'] },
              { required: ['enum'] },
              { required: ['format'] },
            ]
          }
        }
      },
    },

    'docs-parameters-examples-or-schema': {
      message: "No example or schema provided for {{property}}",
      description: 'Without providing a well defined schema or example(s) an API consumer will have a hard time knowing how to interact with this API.',
      severity: DiagnosticSeverity.Error,
      formats: [oas3],
      given: '$.paths[*][*]..parameters[*]',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              { required: ['example'] },
              { required: ['examples'] },
              { required: ['schema'] },
            ]
          }
        }
      },
    },

    'docs-media-types-examples-or-schema': {
      message: "No example or schema provided for {{property}}",
      description: 'To generate useful API reference documentation a sample request and response should be provided, which can either be provided statically as an "example", or tooling can infer a sample from the schema provided (and any examples, defaults, enums, etc. provided for each property). Please provide one or the other. Both would be fantastic.',
      severity: DiagnosticSeverity.Error,
      formats: [oas3],
      given: '#MediaTypeObjects',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              { required: ['example'] },
              { required: ['examples'] },
              { required: ['schema'] },
            ]
          }
        }
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
      message: 'operationId must be URL friendly.',
      description: 'Most documentation tools use the operationId to produce URLs, so the characters used must be URL friendly.',
      severity: DiagnosticSeverity.Error,
      given: '#OperationObject',
      then: {
        field: 'operationId',
        function: pattern,
        functionOptions: {
          match: "^[A-Za-z0-9-._~:/?#\\[\\]@!\\$&'()*+,;=]*$",
        },
      },
    },

    'docs-tags': {
      description: 'Tags help group logic into conceptual groups instead of making end-users dig through URLs or lists of operation names.',
      severity: DiagnosticSeverity.Warning,
      given: '$',
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

    'docs-operation-tags': {
      message: 'Operation should have non-empty `tags` array.',
      description: 'Once tags are defined they should be references in the operation, otherwise they will not be doing anything.',
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
  },
};
