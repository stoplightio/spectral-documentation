import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-description", [
  // -- info.description ---

  {
    name: "valid case: over 20 chars, upper first, and full stop at the end.",
    document: {
      openapi: "3.1.0",
      info: { description: "Bla bla bla very interesting mmm yes." },
      paths: {},
    },
    errors: [],
  },

  {
    name: "invalid case: no info.description",
    document: {
      openapi: "3.1.0",
      info: {},
      paths: {},
    },
    errors: [
      {
        message: '"info.description" property must be truthy.',
        path: ["info"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "invalid: shorter than 20 characters",
    document: {
      openapi: "3.1.0",
      info: { description: "Bit short." },
      paths: {
        "/foo/{id}": {},
      },
    },
    errors: [
      {
        message: '"description" property must be longer than 20.',
        path: ["info", "description"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "valid: longer than 20 characters",
    document: {
      openapi: "3.1.0",
      info: {
        description: "Bit short? Not anymore! Bahahah lots of wooooords.",
      },
      paths: {
        "/foo/{id}": {},
      },
    },
    errors: [],
  },

  // -- schema description --

  {
    name: "invalid case: no description",
    document: {
      openapi: "3.1.0",
      info: { description: "Bla bla bla very interesting mmm yes." },
      components: {
        schemas: {
          Tree: {},
        },
      },
    },
    errors: [
      {
        message: '"Tree.description" property must be truthy.',
        path: ["components", "schemas", "Tree"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "invalid: shorter than 20 characters",
    document: {
      openapi: "3.1.0",
      info: { description: "Bla bla bla very interesting mmm yes." },
      components: {
        schemas: {
          Tree: {
            description: "Its a tree genius.",
          },
        },
      },
    },
    errors: [
      {
        message: '"description" property must be longer than 20.',
        path: ["components", "schemas", "Tree", "description"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "valid: longer than 20 characters",
    document: {
      openapi: "3.1.0",
      info: { description: "Bla bla bla very interesting mmm yes." },
      components: {
        schemas: {
          Tree: {
            description:
              "A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree.",
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "valid: description must start capital letter",
    document: {
      openapi: "3.1.0",
      info: { description: "Bla bla bla very interesting mmm yes." },
      components: {
        schemas: {
          Tree: {
            description:
              "A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree.",
          },
        },
      },
    },
    errors: [],
  },

  // --- parameter examples ---

  {
    name: "valid top level path parameters",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          parameters: [
            {
              name: "limit",
              in: "query",
              description: "This is how it works.",
              type: "integer",
            },
          ],
        },
      },
    },
    errors: [],
  },

  {
    name: "valid operation level parameters",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            description: "Should be present here too since we look for it.",
            parameters: [
              {
                name: "limit",
                in: "query",
                description: "This is how it works.",
                type: "integer",
              },
            ],
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "invalid case: top level path parameter description is missing",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          parameters: [
            {
              name: "limit",
              in: "query",
              type: "integer",
            },
          ],
        },
      },
    },
    errors: [
      {
        message: '"[0].description" property must be truthy.',
        path: ["paths", "/todos", "parameters", "0"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "invalid case: operation level parameter description is missing",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            description: "Should be present here too since we look for it.",
            parameters: [
              {
                name: "limit",
                in: "query",
                type: "integer",
              },
            ],
          },
        },
      },
    },
    errors: [
      {
        message: '"[0].description" property must be truthy.',
        path: ["paths", "/todos", "get", "parameters", "0"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "does not throw on refs",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          parameters: [
            {
              $ref: "#/parameters/limit",
            },
          ],
        },
      },
    },
    errors: [],
  },
]);
