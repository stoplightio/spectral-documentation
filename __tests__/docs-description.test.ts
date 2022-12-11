import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-description", [
	{
		name: "valid case: over 20 chars, upper first, and full stop at the end.",
		document: {
			openapi: "3.1.0",
			info: { description: "Bla bla bla very interesting mmm yes." },
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
		name: "invalid: shorter than 20 characters",
		document: {
			openapi: "3.1.0",
			info: { description: "Bit short." },
			paths: {
				"/foo/{id}": {
				},
			},
		},
		errors: [
			{
        // TODO: Spectral bug, when its shorter than the minimum it says `must not be longer than` (not should go away)
        // https://github.com/stoplightio/spectral/pull/2355
				message: '"description" property must not be longer than 20.',
				path: ["info", "description"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

  {
		name: "valid: longer than 20 characters",
		document: {
			openapi: "3.1.0",
			info: { description: "Bit short? Not anymore! Bahahah lots of wooooords." },
			paths: {
				"/foo/{id}": {
				},
			},
		},
		errors: [],
	},

  {
		name: "invalid: description does not start capital letter",
		document: {
			openapi: "3.1.0",
			info: { description: "lower case looks funny for most documentation tools and they dont wanna mess with your strings." },
			paths: {
				"/foo/{id}": {
				},
			},
		},
		errors: [
			{
				message: '"lower case looks funny for most documentation tools and they dont wanna mess with your strings." must match the pattern "/^[A-Z]/".',
				path: ["info", "description"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

  {
		name: "valid: description must start capital letter",
		document: {
			openapi: "3.1.0",
			info: { description: "Upper case looks more human for most documentation tools as they dont wanna mess with your strings." },
			paths: {
				"/foo/{id}": {
				},
			},
		},
    errors: [],
	},

  {
		name: "invalid: description needs a full stop at the end",
		document: {
			openapi: "3.1.0",
			info: { description: "Descriptions are strings for humans, and they are sentences or paragaphs, so should end with a" },
			paths: {
				"/foo/{id}": {
				},
			},
		},
		errors: [
			{
				message: '"Descriptions are strings for humans, and they are sentences or paragaphs, so should end with a" must match the pattern "\\\\.$".',
				path: ["info", "description"],
				severity: DiagnosticSeverity.Warning,
			},
		],
	},

  {
		name: "valid: description has a full stop at the end",
		document: {
			openapi: "3.1.0",
			info: { description: "Descriptions are strings for humans, and they are sentences or paragaphs, so should end with a '.'." },
			paths: {
				"/foo/{id}": {
				},
			},
		},
    errors: [],
	},
]);
