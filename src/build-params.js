'use strict';

function buildFilterParams(filter) {
  var builtFilter = [];
  var value, paramName;

  for (var name in filter) {
    if (filter.hasOwnProperty(name)) {
      value = filter[name];
      paramName = 'filter[' + name + ']=';
      builtFilter.push(encodeURIComponent(paramName + filter[name]));
    }
  }
  return builtFilter.join('&');
}

function buildSortParams(sort) {
  return 'sort=' + sort.join(',');
}

function buildParams(params) {
  var params = params || {};
  var paramList = [];

  if (params.sort) {
    paramList.push(buildSortParams(params.sort));
  }

  if (params.filter) {
    paramList.push(buildFilterParams(params.filter));
  }

  return paramList.join('&');
}

module.exports = buildParams;
