import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-tags", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      tags: [{ name: "todos" }],
    },
    errors: [],
  },

  {
    name: "missing tags",
    document: {
      swagger: "2.0",
      paths: {},
    },
    errors: [
      {
        message: '"tags" property must exist.',
        path: [],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "empty tags",
    document: {
      swagger: "2.0",
      paths: {},
      tags: [],
    },
    errors: [
      {
        message: '"tags" property must not have fewer than 1 items.',
        path: ["tags"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
