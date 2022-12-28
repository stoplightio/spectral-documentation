import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-api-schemes", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      schemes: ["http"],
    },
    errors: [],
  },

  {
    name: "schemes is missing",
    document: {
      swagger: "2.0",
      paths: {},
    },
    errors: [
      {
        message: "API schemes should be present and non-empty array.",
        path: [],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "schemes is an empty array",
    document: {
      swagger: "2.0",
      paths: {},
      schemes: [],
    },
    errors: [
      {
        message: "API schemes should be present and non-empty array.",
        path: ["schemes"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
