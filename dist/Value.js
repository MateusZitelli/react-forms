'use strict';
/**
 * Value is a wrapper for form value and associated metadata such as form
 * validaton and dirtyness state.
 *
 * @copyright Prometheus Research, LLC 2014
 * @preventMungle
 */

var Immutable                   = require('immutable');
var $__0=         Immutable,List=$__0.List,Map=$__0.Map,is=$__0.is,fromJS=$__0.fromJS; // jshint ignore:line
var emptyFunction               = require('./emptyFunction');
var $__1=   require('./schema'),ScalarNode=$__1.ScalarNode,CompositeNode=$__1.CompositeNode;
var invariant                   = require('./invariant');
var ValidationResult            = require('./ValidationResult');
var defaultValue                = require('./defaultValue');

var EMPTY_MAP = Map(); // jshint ignore:line

var DIRTY_SENTINEL = '__react_forms_dirty__';
var DIRTY = EMPTY_MAP.set(DIRTY_SENTINEL, true);



  function Value(attributes, onUpdate, root, keyPath) {
    this.attributes = attributes;
    this.onUpdate = onUpdate;
    this.__root = root;
    this.keyPath = keyPath || [];
  }

  Value.prototype.is=function(nodeType) {
    return (this.node instanceof nodeType);
  };

  Value.prototype.equals=function(other) {
    return other && is(this.attributes, other.attributes);
  };

  Value.prototype.hashCode=function() {
    return this.attributes.hashCode();
  };

  Object.defineProperty(Value.prototype,"root",{enumerable:true,configurable:true,get:function() {
    return this.__root();
  }});

  Object.defineProperty(Value.prototype,"key",{enumerable:true,configurable:true,get:function() {
    if (this.keyPath.length > 0) {
      return this.keyPath[this.keyPath.length - 1];
    } else {
      return null;
    }
  }});

  Object.defineProperty(Value.prototype,"value",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('value');
  }});

  /**
   * Schema related attributes
   */
  Object.defineProperty(Value.prototype,"abstractNode",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('abstractNode');
  }});

  Object.defineProperty(Value.prototype,"node",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('node');
  }});

  /**
   * Validation related attributes
   */
  Object.defineProperty(Value.prototype,"validation",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('validation');
  }});

  Object.defineProperty(Value.prototype,"externalValidation",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('externalValidation');
  }});

  Object.defineProperty(Value.prototype,"isValid",{enumerable:true,configurable:true,get:function() {
    return (
      this.attributes.get('validation').isSuccess &&
      this.attributes.get('externalValidation', ValidationResult.success()).isSuccess
    );
  }});

  /**
   * Serialized value attribute
   */
  Object.defineProperty(Value.prototype,"serialized",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('serialized');
  }});

  /**
   * Dirtyness state attributes and methods
   */
  Object.defineProperty(Value.prototype,"dirty",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('dirty');
  }});

  Value.prototype.makeDirty=function() {
    var attributes = this.attributes.setIn(['dirty', DIRTY_SENTINEL], true);
    return this.__update(attributes);
  };

  Value.prototype.makeNotDirty=function() {
    var attributes = this.attributes.removeIn(['dirty', DIRTY_SENTINEL]);
    return this.__update(attributes);
  };

  Object.defineProperty(Value.prototype,"isDirty",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('dirty').get(DIRTY_SENTINEL, false);
  }});

  Object.defineProperty(Value.prototype,"hasDirty",{enumerable:true,configurable:true,get:function() {
    return this.attributes.get('dirty').size > 0;
  }});

  Value.prototype.keys=function() {
    return this.node.keys(this.value);
  };

  Value.prototype.get=function(key) {
    var abstractNode = this.node.get(key);
    invariant(
      abstractNode !== undefined,
      'Access to key "%s" which does not exist in schema', key
    );
    var value = this.value.get(key);
    if (value == undefined) {
      value = defaultValue(abstractNode);
    }
    var $__0=   abstractNode.instantiate(value, undefined),node=$__0.node,value=$__0.value;
    var externalValidation = this.externalValidation.has(key) ?
      this.externalValidation.get(key) :
      ValidationResult.success();
    var validation = this.validation.has(key) ?
      this.validation.get(key) :
      value != undefined ?
      validate(node, value, ValidationResult.success()) :
      ValidationResult.success();
    var serialized = this.serialized.has(key) ? this.serialized.get(key) : serialize(node, value);
    var dirty = this.dirty.has(key) ?
      this.dirty.get(key) :
      this.isDirty ? DIRTY : EMPTY_MAP;
    var attributes = Map({ // jshint ignore:line
      abstractNode:abstractNode, node:node,
      value:value, serialized:serialized,
      validation:validation, externalValidation:externalValidation,
      dirty:dirty
    });
    return new this.constructor(attributes, this.onUpdate, this.__root, this.keyPath.concat(key));
  };

  Value.prototype.getIn=function(keyPath) {
    if (keyPath.length === 0) {
      return this;
    }
    var current = this;
    for (var i = 0, len = keyPath.length; i < len; i++) {
      current = current.get(keyPath[i]);
    }
    return current;
  };

  Value.prototype.map=function(func) {
    var result = [];
    var iterator = this.node.keys(this.value);
    var step;
    while (!(step = iterator.next()).done) {
      result.push(func(this.get(step.value), step.value, this));
    }
    return result;
  };

  Value.prototype.set=function(value) {
    value = fromJS(value);
    var $__0=   this.abstractNode.instantiate(value, this.node),node=$__0.node,value=$__0.value;
    var attributes = {
      node:node, value:value,
      // either get a new serialized value for scalar nodes or destroy it
      // otherwise
      serialized: (node instanceof ScalarNode) ? node.serialize(value) : EMPTY_MAP
    };
    return this.__update(attributes);
  };

  Value.prototype.transform=function(updater) {
    return this.set(updater(this.value));
  };

  Value.prototype.setSerialized=function(serialized, options) {
    options = options || {};
    invariant(
      (this.node instanceof ScalarNode),
      'value should be a scalar'
    );
    var value = serialized !== '' ? this.node.deserialize(serialized) : null;
    var attributes = {value:value, serialized:serialized};
    if (options.dirtyOnChange) {
      attributes.dirty = DIRTY;
    }
    if (value instanceof Error) {
      attributes.validation = value;
      attributes.value = serialized;
    }
    return this.__update(attributes);
  };

  Value.prototype.setExternalValidation=function(externalValidation) {
    return this.__update({externalValidation:externalValidation});
  };

  Value.prototype.setSchema=function(abstractNode) {
    var $__0=   abstractNode.instantiate(this.value, this.node),node=$__0.node,value=$__0.value;
    return this.__update({value:value, node:node, abstractNode:abstractNode});
  };

  Value.prototype.notify=function() {
    console.warn(
      'Value: notify() method is deprecated, the onUpdate() callback ' +
      'is now called automatically by each mutative method'
    );
  };

  Value.prototype.__update=function(attributes) {
    var keyPath = this.keyPath;
    var cur = this.root;
    var prev = cur;
    var trace = [cur];
    for (var i = 0, len = keyPath.length; i < len; i++) {
      cur = cur.get(keyPath[i]);
      trace.push(cur);
    }

    cur = trace.pop();
    cur = cur.__with(attributes).__grow();

    while (trace.length > 0) {
      var par = trace.pop();
      cur = par.__onUpdate(cur);
    }

    this.onUpdate(cur, keyPath, prev);

    return cur;
  };

  Value.prototype.__onUpdate=function(child) {
    var value = this.value.set(child.key, child.value);
    var $__0=    this.abstractNode.instantiate(value, this.node),node=$__0.node,value=$__0.value,dirty=$__0.dirty;
    if (node.constructor !== this.node.constructor) {
      value = defaultValue(node);
      return this.__with({node:node, value:value, serialized: EMPTY_MAP, dirty: (dirty || EMPTY_MAP)}).__grow();
    } else if (!is(node, this.node)) {
      return this.__with({node:node, value:value, serialized: EMPTY_MAP, dirty: (dirty || EMPTY_MAP)}).__grow();
    } else {
      var childrenValidation = child.validation.isSuccess ?
        ValidationResult.children(this.validation.children.remove(String(child.key))) :
        ValidationResult.children(this.validation.children.set(String(child.key), child.validation));
      var validation = validate(node, value, childrenValidation);
      dirty = dirty ? dirty : (child.dirty.size > 0 ? this.dirty.set(child.key, child.dirty) : this.dirty.remove(child.key));
      var serialized = this.serialized.set(child.key, child.serialized);
      return this.__with({node:node, value:value, validation:validation, dirty:dirty, serialized:serialized});
    }
  };

  Value.prototype.__grow=function() {
    if (this.node instanceof CompositeNode) {
      var value = this.value.asMutable();
      var iterator = this.node.keys(this.value);
      var children = EMPTY_MAP.asMutable();

      var areChildrenValid = true;

      var step;
      while (!(step = iterator.next()).done) {
        if (
          this.value.get(step.value) != undefined ||
          this.node.get(step.value).defaultValue != undefined
        ) {
          var child = this.get(step.value).__grow();
          if (!child.validation.isSuccess) {
            areChildrenValid = false;
          }
          children = children.set(child.key, child);
          value = value.set(step.value, child.value)
        }
      }
      value = value.asImmutable();
      var $__0=    this.abstractNode.instantiate(value, this.node),node=$__0.node,value=$__0.value,dirty=$__0.dirty;
      var childrenValidation = areChildrenValid ?
        ValidationResult.success() :
        new ValidationResult(null, children.map(function(c)  {return c.validation;}).filter(function(v)  {return !v.isSuccess;}));
      var validation = validate(node, value, childrenValidation);
      dirty = dirty ? dirty : this.dirty.merge(children.filter(function(c)  {return c.dirty.size > 0;}).map(function(c)  {return c.dirty;}));
      var serialized = this.serialized.merge(children.map(function(c)  {return c.serialized;}));
      return this.__with({node:node, value:value, validation:validation, dirty:dirty, serialized:serialized});
    } else {
      var validation = validate(this.node, this.value, ValidationResult.success());
      return this.__with({validation:validation});
    }
  };

  Value.prototype.__with=function(attributes) {
    attributes = this.attributes.merge(attributes);
    return new this.constructor(
      attributes,
      this.onUpdate,
      this.__root,
      this.keyPath
    );
  };

  Value.create=function(abstractNode, value, onUpdate, root) {
    onUpdate = onUpdate || emptyFunction;
    value = fromJS(value);
    // check for both undefined and null
    if (value == undefined) {
      value = defaultValue(abstractNode);
    }
    var $__0=   abstractNode.instantiate(value, undefined),node=$__0.node,value=$__0.value;
    var externalValidation = ValidationResult.success();
    var validation = ValidationResult.success();
    var serialized = serialize(node, value);
    var dirty = EMPTY_MAP;
    var attributes = Map({ // jshint ignore:line
      abstractNode:abstractNode, node:node,
      value:value, serialized:serialized,
      validation:validation, externalValidation:externalValidation,
      dirty:dirty
    });
    var created = new this(attributes, onUpdate, root, null);
    created = created.__grow();
    return created;
  };




/**
 * Validate value against schema node.
 */
function validate(node, value, childrenValidation) {
  var result = node.validate(value, childrenValidation);
  if (result instanceof ValidationResult) {
    return result;
  } else if (result instanceof Error) {
    return new ValidationResult(result.message);
  } else {
    return ValidationResult.success();
  }
}


/**
 * Serialize value.
 */
function serialize(node, value) {
  if (node instanceof CompositeNode) {
    return EMPTY_MAP;
  } else {
    return node.serialize(value);
  }
}

module.exports = Value;
