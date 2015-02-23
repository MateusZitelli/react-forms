/**
 * @copyright Prometheus Research, LLC 2014
 * @preventMungle
 */
'use strict';

var Immutable = require('immutable');
var $__0=   Immutable,Map=$__0.Map,is=$__0.is; // jshint ignore:line

var EMPTY_MAP = Map(); // jshint ignore:line

var VALIDATION_SUCCESS = new ValidationResult(null, EMPTY_MAP);



  function ValidationResult(error, children) {
    this.error = error;
    this.children = children ? Map(children).mapKeys(function(k)  {return String(k);}) : EMPTY_MAP; // jshint ignore:line
  }

  ValidationResult.prototype.equals=function(other)      {
    return (
      other != null && // jshint ignore:line
      is(this.error, other.error) &&
      is(this.children, other.children)
    );
  };

  ValidationResult.prototype.get=function(key)                  {
    return this.children.get(String(key), VALIDATION_SUCCESS);
  };

  ValidationResult.prototype.has=function(key) {
    return this.children.has(String(key));
  };

  Object.defineProperty(ValidationResult.prototype,"isSuccess",{enumerable:true,configurable:true,get:function() {
    return this.error === null && this.children.size === 0;
  }});

  Object.defineProperty(ValidationResult.prototype,"isFailure",{enumerable:true,configurable:true,get:function() {
    return !this.isSuccess;
  }});

  ValidationResult.prototype.toString=function() {
    if (this.isSuccess) {
      return (this.constructor.name + " { SUCCESS }");
    } else {
      return (this.constructor.name + " { error: " + this.error + ", children: " + this.children + " }");
    }
  };

  ValidationResult.prototype.toJS=function() {
    var $__0=   this,error=$__0.error,children=$__0.children;
    return {error:error, children:children};
  };

  ValidationResult.error=function(message) {
    return new ValidationResult(message, EMPTY_MAP);
  };

  ValidationResult.children=function(children) {
    return new ValidationResult(null, children);
  };

  ValidationResult.success=function() {
    return VALIDATION_SUCCESS;
  };



module.exports = ValidationResult;
