import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-parameters-examples-or-schema", [
	{
		name: "invalid case",
		document: {
			openapi: "3.0.0",
			info: {},
			paths: {
        "/user_busy_times": {
          get: {
            summary: "List User Busy Times",
            parameters: [
              {
                name: "user",
                in: "query",
                schema: {
                  type: "string",
                  format: "uri"
                },
                description: "The uri associated with the user",
                example: "https://api.calendly.com/users/AAAAAAAAAAAAAAAA",
                required: true
              }
            ],
            responses: {
              "200": {
                description: "OK",
              }
            }
          }
        }
      },
		},
		errors: [],
	},

  {
		name: "invalid case",
		document: {
			openapi: "3.0.0",
			info: {},
			paths: {
        "/user_busy_times": {
          get: {
            summary: "List User Busy Times",
            parameters: [
              {
                name: "user",
                in: "query",
                description: "neither a schema or an example",
                required: true
              },
            ],
            responses: {
              "200": {
                description: "OK",
              }
            }
          }
        }
      },
		},
		errors: [
			{
				message: 'No example or schema provided for 0',
				path: ["paths", "/user_busy_times", "get", "parameters", "0"],
				severity: DiagnosticSeverity.Error,
			},
		],
	},
]);
