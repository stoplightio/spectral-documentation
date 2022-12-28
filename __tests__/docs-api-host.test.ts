import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-api-host", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      host: "stoplight.io",
    },
    errors: [],
  },

  {
    name: "missing host",
    document: {
      swagger: "2.0",
      paths: {},
    },
    errors: [
      {
        message: "API host must be present and non-empty string.",
        path: [],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
