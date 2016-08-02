'use strict'

var uriEncode = function(string) {
  return encodeURIComponent(string)
}

function buildFilterParams(filter) {
  var builtFilter = []
  var value, paramName

  for (var name in filter) {
    if (filter.hasOwnProperty(name)) {
      value = filter[name]
      paramName = uriEncode('filter[' + name + ']')
      builtFilter.push(paramName + '=' + value)
    }
  }
  return builtFilter.join('&')
}

function buildSortParams(sort) {
  return 'sort=' + sort.join(',')
}

function buildIncludeParams(include) {
  return 'include=' + include.join(',')
}

function buildPageFieldsParam(fields) {
  return 'fields=' + fields.join(',')
}

function buildPageSizeParam(size) {
  return uriEncode('page[size]') + '=' + size
}

function buildPageNumberParam(page) {
  return uriEncode('page[number]') + '=' + page
}

function buildParams(params) {
  var params = params || {}
  var paramList = []

  if (params.sort) {
    paramList.push(buildSortParams(params.sort))
  }

  if (params.filter) {
    paramList.push(buildFilterParams(params.filter))
  }

  if (params.include) {
    paramList.push(buildIncludeParams(params.include))
  }

  if (params.fields) {
    paramList.push(buildPageFieldsParam(params.fields))
  }

  if (params.size) {
    paramList.push(buildPageSizeParam(params.size))
  }

  if (params.page) {
    paramList.push(buildPageNumberParam(params.page))
  }

  return paramList.join('&')
}

module.exports = buildParams
