import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("docs-media-type-examples-or-schema", [
  {
    name: "valid case",
    document: {
      openapi: "3.0.0",
      info: {
        title: "Calendars API",
        version: "2.0.0",
      },
      paths: {
        "/organization/invitees": {
          post: {
            summary: "Invite User to Organization",
            responses: {
              "201": {
                description: "Created",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                    },
                    examples: {
                      Invitation: {
                        value: {},
                      },
                    },
                  },
                },
              },
            },
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                  },
                  examples: {
                    Example: {
                      value: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "invalid case",
    document: {
      openapi: "3.0.0",
      info: {
        title: "Calendars API",
        version: "2.0.0",
      },
      paths: {
        "/organization/invitees": {
          post: {
            summary: "Invite User to Organization",
            responses: {
              "201": {
                description: "Created",
                content: {
                  "application/json": {},
                },
              },
            },
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  description: "no schema or examples!",
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "No example or schema provided for application/json",
        path: [
          "paths",
          "/organization/invitees",
          "post",
          "responses",
          "201",
          "content",
          "application/json",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message: "No example or schema provided for application/json",
        path: [
          "paths",
          "/organization/invitees",
          "post",
          "requestBody",
          "content",
          "application/json",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);
