/**
 * Represents an expected application-level failure.
 *
 * Controllers can convert this error into a predictable HTTP response
 * without exposing database or implementation details to the client.
 */
class ApplicationError extends Error {
    constructor(status, message, code = 'APPLICATION_ERROR') {
        super(message);

        this.name = 'ApplicationError';
        this.status = status;
        this.code = code;

        Error.captureStackTrace(this, ApplicationError);
    }
}

module.exports = ApplicationError;
