'use strict'

exports.createErrorResponse = function(error, status) {
  if (!error) return null

  if (typeof error === 'string') {
    return {
      error: { message: error },
      status
    }
  } else {
    return { error, status }
  }
}
