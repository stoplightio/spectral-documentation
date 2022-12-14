import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-api-host-not-example", [
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
    name: "server is example.com",
    document: {
      swagger: "2.0",
      paths: {},
      host: "https://example.com",
    },
    errors: [
      {
        message: "Host URL should not point at example.com.",
        path: ["host"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
