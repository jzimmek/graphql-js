'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphql = graphql;

var _parser = require('./language/parser');

var _validate = require('./validation/validate');

var _execute = require('./execution/execute');

/**
 * This is the primary entry point function for fulfilling GraphQL operations
 * by parsing, validating, and executing a GraphQL document along side a
 * GraphQL schema.
 *
 * More sophisticated GraphQL servers, such as those which persist queries,
 * may wish to separate the validation and execution phases to a static time
 * tooling step, and a server runtime step.
 *
 * Accepts either an object with named arguments, or individual arguments:
 *
 * schema:
 *    The GraphQL type system to use when validating and executing a query.
 * source:
 *    A GraphQL language formatted string representing the requested operation.
 * rootValue:
 *    The value provided as the first argument to resolver functions on the top
 *    level type (e.g. the query object type).
 * variableValues:
 *    A mapping of variable name to runtime value to use for all variables
 *    defined in the requestString.
 * operationName:
 *    The name of the operation to use if requestString contains multiple
 *    possible operations. Can be omitted if requestString contains only
 *    one operation.
 * fieldResolver:
 *    A resolver function to use when one is not provided by the schema.
 *    If not provided, the default field resolver is used (which looks for a
 *    value or method on the source value with the field's name).
 */

/* eslint-disable no-redeclare */
function graphql(argsOrSchema, source, rootValue, contextValue, variableValues, operationName, fieldResolver) {
  // Extract arguments from object args if provided.
  var args = arguments.length === 1 ? argsOrSchema : undefined;
  var schema = args ? args.schema : argsOrSchema;
  if (args) {
    /* eslint-disable no-param-reassign */
    source = args.source;
    rootValue = args.rootValue;
    contextValue = args.contextValue;
    variableValues = args.variableValues;
    operationName = args.operationName;
    fieldResolver = args.fieldResolver;
    /* eslint-enable no-param-reassign, no-redeclare */
  }

  return new Promise(function (resolve) {
    var document = (0, _parser.parse)(source);
    var validationErrors = (0, _validate.validate)(schema, document);
    if (validationErrors.length > 0) {
      resolve({ errors: validationErrors });
    } else {
      resolve((0, _execute.execute)(schema, document, rootValue, contextValue, variableValues, operationName, fieldResolver));
    }
  }).then(undefined, function (error) {
    return { errors: [error] };
  });
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */