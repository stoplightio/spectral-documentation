import { pattern, schema, truthy, length } from "@stoplight/spectral-functions";
import { oas2, oas3 } from "@stoplight/spectral-formats";
import { DiagnosticSeverity } from "@stoplight/types";

export default {
  aliases: {
    'ObjectsThatShouldHaveExamples': [
      '$.components.headers[*]',
      '$.components.parameters[*]',
      '$.paths[*][*]..content[*]',
      '$.paths[*][*]..headers[*]',
      '$.paths[*][*]..parameters[*]',
    ],

    // SharedParameterObject: [
    //   description: an optional property describing the purpose of the alias
    //   targets:
    //     - formats:
    //         - oas2
    //       given:
    //         - $.parameters[*]
    //     - formats:
    //         - oas3
    //       given:
    //         - $.components.parameters[*]
  },

  rules: {
    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-definitions-example': {
      message: "Definitions SHOULD contain examples.",
      description: "Documentation tools use examples to provide more realistic representations of the request/response bodies.",
      severity: DiagnosticSeverity.Warning,
      given: "$..definitions..[?(@property !== 'properties' && @ && (@.items === void 0 || @.properties === void 0 ))]",
      formats: [oas2],
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              'examples',
              'example',
              'x-example',
              'default',
              'enum',
            ]
          }
        }
      }
    },

    'docs-parameter-example': {
      message: "Parameters SHOULD contain examples.",
      description: "Documentation tools use examples to provide more realistic representations of the request/response bodies.",
      severity: DiagnosticSeverity.Warning,
      given: "$..parameters..[?(@property !== 'properties' && @ && (@.items === void 0 || @.properties === void 0 ))",
      formats: [oas3],
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              'examples',
              'default',
              'enum',
              'const',
            ]
          }
        }
      }
    },

    'docs-response-example': {
      message: "Responses SHOULD contain examples.",
      description: "Documentation tools use examples to provide more realistic representations of the request/response bodies.",
      severity: DiagnosticSeverity.Warning,
      given: "$..responses..[?(@property !== 'properties' && @ && (@.items === void 0 || @.properties === void 0 ))",
      formats: [oas3],
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              'examples',
              'example',
              'default',
              'enum',
              'const',
            ]
          }
        }
      }
    },
    
  
    'docs-examples-or-defaults':{
      message: "Responses SHOULD contain some sort of examples or default value.",
      description: "Documentation tools use examples or any other form of default value, enum, or const defined to pick a value to show in an example.",
      severity: DiagnosticSeverity.Warning,
      given: "#ObjectsThatShouldHaveExamples",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              'examples',
              'example',
              'x-example',
              'x-examples',
              'default',
              'enum',
              'const',
            ]
          }
        }
      }
    },
        
    //     - field: examples
    //     - function: truthy
    // - docs-media-examples-oas3
    //     - given
            
    //         ```jsx
    //         '$..content..[?(@ && @.schema)]',
    //         '$..headers..[?(@ && @.schema)]',
    //         '$..parameters..[?(@ && @.schema)]',
    //         ```
            
    //     - function: schema
    //     - oneOf: example or examples
    // - docs-media-examples-oas2 (maybe dont bother with OAS2?)
    //     - given: `$..responses..[?(@ && @.schema)]`
    //     - truthy: `examples`

    // ### Enforce descriptions and length

    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-info-description': {
      message: "Descriptions are important, don't scrimp on them.",
      description: "Documentation tools use description to provide more context to users of the API who are not as familiar with the concepts as the API designers are.",
      severity: DiagnosticSeverity.Warning,
      given: "$.info",
      formats: [oas2],
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

    // - docs-description
    //     - given:
    //         - $.info
    //         - $..parameters[?(@ && @.in)]
    //         - #PathItem.parameters[?(@ && @.in)]'
    //         - #OperationObject.parameters[?(@ && @.in)]
    //         - $.components.parameters[?(@ && @.in)]
    //     - field: description
    //     - truthy
        
    // - docs-description-length
    //     - given: ditto 👆
    //     - field: description
    //     - minLength: 20
        
    // - docs-description-end-stop - Always end with a full stop
    //     - given: ditto 👆
    //     - field: description
    //     - endWith: `.`
        
    // - docs-description-capitalize
    //     - given: ditto 👆
    //     - field: description
    //     - pattern: /^[A-Z]/

    // ### Grammar check

    // We could shove this in there? 

    // [https://github.com/api-stuff/spectral-spelling-grammar](https://github.com/api-stuff/spectral-spelling-grammar)

    // ### Other ideas

    // -
  },
};
