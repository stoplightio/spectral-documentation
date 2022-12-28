import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-api-servers", [
  {
    name: "valid case",
    document: {
      openapi: "3.0.0",
      paths: {},
      servers: [{ url: "https://stoplight.io" }],
    },
    errors: [],
  },

  {
    name: "servers is missing",
    document: {
      openapi: "3.0.0",
      paths: {},
    },
    errors: [
      {
        message: "API servers should be present and non-empty array.",
        path: [],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "servers is an empty array",
    document: {
      openapi: "3.0.0",
      paths: {},
      servers: [],
    },
    errors: [
      {
        message: "API servers should be present and non-empty array.",
        path: ["servers"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
