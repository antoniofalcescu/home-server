export const HTTP_RESPONSE = {
  OK: {
    CODE: 200,
    MESSAGE: 'OK',
  },
  CREATED: {
    CODE: 201,
    MESSAGE: 'Created',
  },
  ACCEPTED: {
    CODE: 202,
    MESSAGE: 'Accepted',
  },
  BAD_REQUEST: {
    CODE: 400,
    MESSAGE: 'Bad Request',
  },
  NOT_FOUND: {
    CODE: 404,
    MESSAGE: 'Not Found',
  },
  INTERNAL_SERVER_ERROR: {
    CODE: 500,
    MESSAGE: 'Internal Server Error',
  },
  SERVICE_UNAVAILABLE: {
    CODE: 503,
    MESSAGE: 'Service Unavailable',
  },
} as const;
