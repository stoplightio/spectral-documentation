import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-operation-tags", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            tags: [{ name: "todos" }],
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "tags is missing",

    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {},
        },
      },
    },
    errors: [
      {
        message: "Operation should have non-empty `tags` array.",
        path: ["paths", "/todos", "get"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "tags is empty",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            tags: [],
          },
        },
      },
    },
    errors: [
      {
        message: "Operation should have non-empty `tags` array.",
        path: ["paths", "/todos", "get", "tags"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
