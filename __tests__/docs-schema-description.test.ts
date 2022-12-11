import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-schema-description", [
	{
		name: "invalid case: no info.description",
		document: {
			openapi: "3.1.0",
			info: {},
			components: {
        schemas: {
          Tree: {
          }
        }
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
			info: {},
			components: {
        schemas: {
          Tree: {
            description: 'Its a tree genius.'
          }
        }
      },
		},
		errors: [
			{
        // TODO: Spectral bug, when its shorter than the minimum it says `must not be longer than` (not should go away)
        // https://github.com/stoplightio/spectral/pull/2355
				message: '"description" property must not be longer than 20.',
				path: ["components", "schemas", "Tree", "description"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

  {
		name: "valid: longer than 20 characters",
		document: {
			openapi: "3.1.0",
			info: {},
      components: {
        schemas: {
          Tree: {
            description: 'A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree.'
          }
        }
      },
		},
		errors: [],
	},

  {
		name: "invalid: description should start with capital letter",
		document: {
			openapi: "3.1.0",
			info: {},
      components: {
        schemas: {
          Tree: {
            description: 'a sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree.'
          }
        }
      },
		},
		errors: [
			{
				message: '"a sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree." must match the pattern "/^[A-Z]/".',
				path: ["components", "schemas", "Tree", "description"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

  {
		name: "valid: description must start capital letter",
		document: {
			openapi: "3.1.0",
			info: {},
      components: {
        schemas: {
          Tree: {
            description: 'A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree.'
          }
        }
      },
		},
    errors: [],
	},

  {
		name: "invalid: description needs a full stop at the end",
		document: {
			openapi: "3.1.0",
			info: {},
      components: {
        schemas: {
          Tree: {
            description: 'A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree'
          }
        }
      },
		},
		errors: [
			{
				message: '"A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree" must match the pattern "\\\\.$".',
				path: ["components", "schemas", "Tree", "description"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

  {
		name: "valid: description has a full stop at the end",
		document: {
			openapi: "3.1.0",
			info: { description: "Descriptions are strings for humans, and they are sentences or paragaphs, so should end with a '.'." },
      components: {
        schemas: {
          Tree: {
            description: 'A sapling, whether its tree, or a shrub, woodland or hedgerow, its all a Tree.'
          }
        }
      },
		},
    errors: [],
	},
]);
