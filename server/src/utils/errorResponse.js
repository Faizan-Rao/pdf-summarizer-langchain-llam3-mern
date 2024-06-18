class ErrorResponse extends Error {
    constructor(
        statusCode,
        message = "",
        data = null,
        stack = []
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = false
        if(stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ErrorResponse }