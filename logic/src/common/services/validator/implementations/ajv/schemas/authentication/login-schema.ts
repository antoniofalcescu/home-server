export const LOGIN_SCHEMA = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        login: {
          type: 'string',
          pattern: '^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|[a-zA-Z0-9_.-]{4,32})$',
        },
        password: {
          type: 'string',
          pattern: '^[a-zA-Z0-9!@#$%^&*()_+={}\\[\\]:;\'"<>,.?/\\\\|-]{6,32}$',
        },
      },
      required: ['login', 'password'],
      additionalProperties: false,
    },
  },
} as const;
