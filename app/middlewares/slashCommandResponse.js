'use strict'

/**
 * Transform the validation error response to a valid Slack's slash command response
 */
module.exports = function slashCommandResponse(err, req, res, next) {
  // Ensure `err` is validation error response
  if (!err.error || !err.error.details) return next(err)

  console.log(err)

  res.status(400).json({
    response_type: 'ephemeral',
    text: err.error.message
  })
}
