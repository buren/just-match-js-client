function buildError(error) {
  return {
    status: error.status,
     // "/data/attributes/first-name" => "first-name"
    attribute: error.source.pointer.substr(17),
    detail: error.detail
  };
}

function parseErrors(rawErrors) {
  var errors = [];
  for (error of rawErrors.errors) {
    errors.push(buildError(error));
  }
  return errors;
};

module.exports = parseErrors;
