'use strict'

function buildError(error) {
  return {
    status: error.status,
     // "/data/attributes/first-name" => "first-name"
    attribute: error.source.pointer.substr(17),
    detail: error.detail
  }
}

function parseErrors(rawErrors) {
  return rawErrors.errors.map(function(error) {
    return buildError(error)
  })
}

module.exports = parseErrors
