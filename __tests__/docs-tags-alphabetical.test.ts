import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule('docs-tags-alphabetical', [
  {
    name: 'valid case',
    document: {
      swagger: '2.0',
      paths: {},
      tags: [{ name: 'a-tag' }, { name: 'b-tag' }],
    },
    errors: [],
  },

  {
    name: 'tags is not in alphabetical order',
    document: {
      swagger: '2.0',
      paths: {},
      tags: [{ name: 'b-tag' }, { name: 'a-tag' }],
    },
    errors: [
      {
        message: 'Tags should be defined in alphabetical order',
        path: ['tags'],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
