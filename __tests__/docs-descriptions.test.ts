import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-descriptions", [
	{
		name: "valid case",
		document: {
			openapi: "3.1.0",
			info: { version: "1.0" },
			paths: {
				"/foo/{id}": {
					get: {
					},
				},
			},
		},
		errors: [],
	},

	{
		name: "invalid if its an integer",
		document: {
			openapi: "3.1.0",
			info: { version: "1.0" },
			paths: {
				'/v1': {},
			},
		},
		errors: [
			{
				message: "#/info description missing ntains a version number. API paths SHOULD NOT have versioning in the path. It SHOULD be in the server URL instead.",
				path: ["info"],
				severity: DiagnosticSeverity.Warning,
			},
			
		],
	},
]);
