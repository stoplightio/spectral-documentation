import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-descriptions", [
	{
		name: "valid case",
		document: {
			openapi: "3.1.0",
			info: { description: "Bla bla bla very interesting mmm yes" },
			paths: {},
		},
		errors: [],
	},

	{
		name: "invalid case: no info.description",
		document: {
			openapi: "3.1.0",
			info: {},
			paths: {},
		},
		errors: [
			{
				message: '"info.description" property must be truthy.',
				path: ["info"],
				severity: DiagnosticSeverity.Warning,
			},
			
		],
	},

  {
		name: "invalid if its an integer",
		document: {
			openapi: "3.1.0",
			info: { description: "Bit short" },
			paths: {
				"/foo/{id}": {
				},
			},
		},
		errors: [
			{
				message: '"info.description" property must be longer than 20.',
				path: ["info"],
				severity: DiagnosticSeverity.Warning,
			},
			
		],
	},

  {
		name: "invalid if its an integer",
		document: {
			openapi: "3.1.0",
			info: { description: "lower case looks funny for most documentation tools and they dont wanna mess with your strings" },
			paths: {
				"/foo/{id}": {
				},
			},
		},
		errors: [
			{
				message: '"info.description" property must be longer than 20.',
				path: ["info"],
				severity: DiagnosticSeverity.Warning,
			},
			
		],
	},
]);
