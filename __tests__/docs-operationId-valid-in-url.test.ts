import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-operationId-valid-in-url", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            operationId: "A-Za-z0-9-._~:/?#[]@!$&'()*+,;=",
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "operationId contains invalid characters",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            operationId: "foo-^^",
          },
        },
      },
    },
    errors: [
      {
        message: "operationId must only contain URL friendly characters.",
        path: ["paths", "/todos", "get", "operationId"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);
