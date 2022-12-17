import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-info-contact", [
	{
		name: "valid case",
		document: {
			openapi: "3.1.0",
			info: { 
        contact: {
        } 
      },
			paths: {},
		},
		errors: [],
	},

	{
		name: "invalid case",
		document: {
			openapi: "3.1.0",
			info: {
      },
			paths: {},
		},
		errors: [
			{
				message: '"info.contact" property must be truthy.',
				path: ["info"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

]);
