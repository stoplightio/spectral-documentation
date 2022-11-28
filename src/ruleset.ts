import { pattern, schema, truthy, length } from "@stoplight/spectral-functions";
import { oas2, oas3 } from "@stoplight/spectral-formats";
import { DiagnosticSeverity } from "@stoplight/types";


export default {
  aliases: {
    SchemaObjects: {
      description: "Schemas, and/or sub-schemas should define an inline example, default, enum, or some sort of static value.",
      targets: [
        {
          formats: [oas2],
          given: [
            '$.paths[*][*]..content[*]',
            '$.paths[*][*]..headers[*]',
            '$.paths[*][*]..parameters[*]',
          ]
        },
        {
          formats: [oas3],
          given: [
            '$.paths[*][*]..headers[*].schema',
            '$.paths[*][*]..parameters[*].schema',
            
            // TODO is this redundant because of $ref?
            '$.components.headers[*].schema',
            '$.components.parameters[*].schema',

            // TODO Ok for now but x-examples with a 'type' show up in it
            "$.components.schemas[*]..[?(@property !== 'properties' && @property === 'type' && @ && (@.items === void 0 || @.properties === void 0 ))]^",

            // All schemas should have an example defined inline, unless its got items or properties in which case _they_ should.
            // This relies on type, but tbh I could not find a less greedy JSON Path.
            "$.paths[*][*]..content[*].schema..*[?(@property !== 'properties' && @property === 'type' && @ && (@.items === void 0 || @.properties === void 0 ))]^",
            "$..responses[*].content[*].schema..*[?(@property !== 'properties' && @property === 'type' && @ && (@.items === void 0 || @.properties === void 0 ))]^",
          ]
        }
      ]
    },

    OasObjectsThatShouldHaveExampleOrExamples: {
      description: "Not Schemes, but these OpenAPI objects should define some sort of example or examples directly.",
      targets: [
        {
          formats: [oas2],
          given: [
            '$.paths[*][*]..content[*]',
            '$.paths[*][*]..headers[*]',
            '$.paths[*][*]..parameters[*]',
          ]
        },
        {
          formats: [oas3],
          given: [
            '$.paths[*][*]..headers[*]',
            '$.paths[*][*]..parameters[*]',
            
            '$.components.headers[*]',
            '$.components.parameters[*]',

            // TODO Ok for now but x-examples with a 'type' show up in it
            "$.components.schemas[*]..[?(@property !== 'properties' && @property === 'type' && @ && (@.items === void 0 || @.properties === void 0 ))]^",

            // All schemas should have an example defined inline, unless its got items or properties in which case _they_ should.
            // This relies on type, but tbh I could not find a less greedy JSON Path.
            "$.paths[*][*]..content[*].schema..*[?(@property !== 'properties' && @property === 'type' && @ && (@.items === void 0 || @.properties === void 0 ))]^",
            "$..responses[*].content[*].schema..*[?(@property !== 'properties' && @property === 'type' && @ && (@.items === void 0 || @.properties === void 0 ))]^",
          ]
        }
      ]
    }
  },

  rules: {

    /**
     * @author: Phil Sturgeon <https://github.com/philsturgeon>
     */
    'docs-definitions-description': {
      message: "Definitions SHOULD contain descriptions.",
      description: "Definition descriptions should be used to explain what this domain object is, in terms useful to an API consumer who may have less context.",
      severity: DiagnosticSeverity.Warning,
      given: "$..definitions",
      formats: [oas2],
      then: {
        field: 'description',
        function: truthy,
      }
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

    'docs-parameter-example': {
      message: "Parameters SHOULD contain examples.",
      description: "Documentation tools use examples to provide more realistic representations of wht is contained in the parameter, so users can send valid requests sooner.",
      severity: DiagnosticSeverity.Warning,
      given: "$..parameters[*].schema",
      formats: [oas3],
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              { required: ['examples'] },
              { required: ['example'] },
              { required: ['default'] },
              { required: ['enum'] },
              { required: ['const'] },
            ]
          }
        }
      }
    },

    'docs-response-example': {
      message: "Responses SHOULD contain examples.",
      description: "Documentation tools use examples to provide more realistic representations of the request/response bodies.",
      severity: DiagnosticSeverity.Warning,
      given: "$..responses[*].content[*]",
      formats: [oas3],
      then: {
        function: schema,
        functionOptions: {
          schema: {
            oneOf: [
              { required: ['examples'] },
              { required: ['example'] },
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
              { required: ['examples'] },
              { required: ['example'] },
              { required: ['x-examples'] },
              { required: ['x-example'] },
              { required: ['default'] },
              { required: ['enum'] },
              { required: ['const'] },
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


    // ### Grammar check

    // We could shove this in there? 

    // [https://github.com/api-stuff/spectral-spelling-grammar](https://github.com/api-stuff/spectral-spelling-grammar)

    // ### Other ideas

    // -
  },
};
