/**
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React             = require('react');
var Immutable         = require('immutable');
var $__0= 
        Immutable,is=$__0.is,fromJS=$__0.fromJS,Map=$__0.Map,OrderedMap=$__0.OrderedMap; // jshint ignore:line
var invariant         = require('./invariant');
var messages          = require('./messages');
var ValidationResult  = require('./ValidationResult');
var Checkbox          = require('./Checkbox');

var EMPTY_MAP = Map(); // jshint ignore:line
var EMPTY_LIST = Immutable.List(); // jshint ignore:line

/**
 * Node represent schema for data.
 *
 * Hierarchy is the following:
 *
 *                       ScalarNode
 *                      /
 *   Node - ConcreteNode               MappingNode
 *                      \             /
 *                       CompositeNode
 *                                    \
 *                                     ListNode
 */


  function Node(props) {
    props = Map(this.getDefaultProps()).merge(props); // jshint ignore:line
    this.props = props;
  }

  Node.prototype.equals=function(node) {
    if (
      node === null || node === undefined ||
      node.constructor !== undefined &&
      node.constructor !== this.constructor
    ) {
      return false;
    }
    return is(this.props, node.props) && is(this.children, node.children);
  };

  Object.defineProperty(Node.prototype,"defaultValue",{enumerable:true,configurable:true,get:function() {
    if (this.__defaultValue === undefined) {
      this.__defaultValue = fromJS(this.props.get('defaultValue'));
    }
    return this.__defaultValue;
  }});

  Node.prototype.instantiate=function(value) {
    throw new Error('instantiate(value): not implemented');
  };

  Node.prototype.validate=function(value, childrenValidation) {
    throw new Error('validate(value, childrenValidation): not implemented');
  };

  Node.prototype.toString=function() {
    var props = this.props.map(function(v, k)  {return (k + ": " + v);}).toList().join(', ');
    return (this.constructor.name + " { " + props + " }");
  };

  Node.create=function(props) {
    props = props ? Map(props) : EMPTY_MAP; // jshint ignore:line
    return new this(props);
  };


for(var Node____Key in Node){if(Node.hasOwnProperty(Node____Key)){ConcreteNode[Node____Key]=Node[Node____Key];}}var ____SuperProtoOfNode=Node===null?null:Node.prototype;ConcreteNode.prototype=Object.create(____SuperProtoOfNode);ConcreteNode.prototype.constructor=ConcreteNode;ConcreteNode.__superConstructor__=Node;function ConcreteNode(){if(Node!==null){Node.apply(this,arguments);}}

  ConcreteNode.prototype.validate=function(value, childrenValidation) {
    if (value == null) { // jshint ignore:line
      return;
    }
    if (!childrenValidation.isSuccess) {
      return childrenValidation;
    }
    var result;
    var validate = this.props.get('validate');
    // `validate` could be an array for convenienve
    if (Array.isArray(validate)) {
      for (var i = 0, len = validate.length; i < len; i++) {
        result = validate[i](this, value);
        if (result instanceof Error) {
          result;
        }
      }
    } else  if (validate) {
      result = validate(this, value);
    }
    return result;
  };

  ConcreteNode.prototype.instantiate=function(value) {
    return {node: this, value:value};
  };


for(var ConcreteNode____Key in ConcreteNode){if(ConcreteNode.hasOwnProperty(ConcreteNode____Key)){CompositeNode[ConcreteNode____Key]=ConcreteNode[ConcreteNode____Key];}}var ____SuperProtoOfConcreteNode=ConcreteNode===null?null:ConcreteNode.prototype;CompositeNode.prototype=Object.create(____SuperProtoOfConcreteNode);CompositeNode.prototype.constructor=CompositeNode;CompositeNode.__superConstructor__=ConcreteNode;function CompositeNode(){if(ConcreteNode!==null){ConcreteNode.apply(this,arguments);}}

  Object.defineProperty(CompositeNode.prototype,"children",{enumerable:true,configurable:true,get:function() {
    if (this.__children === undefined) {
      this.__children = this.getChildren();
    }
    return this.__children;
  }});

  CompositeNode.prototype.getChildren=function() {
    throw new Error('getChildren(): not implemented');
  };

  CompositeNode.prototype.get=function(key) {
    throw new Error('get(key): not implemented');
  };

  CompositeNode.prototype.getIn=function(keyPath) {
    var cur = this;
    for (var i = 0, len = keyPath.length; i < len; i++) {
      cur = cur.get(keyPath[i]);
    }
    return cur;
  };

  CompositeNode.prototype.has=function(key) {
    throw new Error('has(key): not implemented');
  };

  CompositeNode.prototype.keys=function(value) {
    throw new Error('keys(value): not implemented');
  };


var INPUT_TEXT = React.createElement("input", {type: "text"});

for(ConcreteNode____Key in ConcreteNode){if(ConcreteNode.hasOwnProperty(ConcreteNode____Key)){ScalarNode[ConcreteNode____Key]=ConcreteNode[ConcreteNode____Key];}}ScalarNode.prototype=Object.create(____SuperProtoOfConcreteNode);ScalarNode.prototype.constructor=ScalarNode;ScalarNode.__superConstructor__=ConcreteNode;function ScalarNode(){if(ConcreteNode!==null){ConcreteNode.apply(this,arguments);}}

  ScalarNode.prototype.getDefaultProps=function() {
    return {input: INPUT_TEXT};
  };

  ScalarNode.prototype.validate=function(value, childrenValidation) {
    if (value == null) { // jshint ignore:line
      return;
    }
    value = this.deserialize(value);
    if (value instanceof Error) {
      return value;
    } else {
      return ____SuperProtoOfConcreteNode.validate.call(this,value, childrenValidation)
    }
  };

  ScalarNode.prototype.serialize=function(value) {
    return value === null ? '' : value;
  };

  ScalarNode.prototype.deserialize=function(value) {
    return value === '' ? null : value;
  };


var INPUT_NUMBER = React.createElement("input", {type: "number"});

for(var ScalarNode____Key in ScalarNode){if(ScalarNode.hasOwnProperty(ScalarNode____Key)){NumberNode[ScalarNode____Key]=ScalarNode[ScalarNode____Key];}}var ____SuperProtoOfScalarNode=ScalarNode===null?null:ScalarNode.prototype;NumberNode.prototype=Object.create(____SuperProtoOfScalarNode);NumberNode.prototype.constructor=NumberNode;NumberNode.__superConstructor__=ScalarNode;function NumberNode(){if(ScalarNode!==null){ScalarNode.apply(this,arguments);}}

  NumberNode.prototype.getDefaultProps=function() {
    return {input: INPUT_NUMBER};
  };

  NumberNode.prototype.deserialize=function(value) {
    if (value === '') {
      return null;
    // based on http://stackoverflow.com/a/1830844/182954
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return parseFloat(value);
    } else {
      return new Error(messages.INVALID_VALUE);
    }
  };


var INPUT_CHECKBOX = React.createElement(Checkbox, null);

for(ScalarNode____Key in ScalarNode){if(ScalarNode.hasOwnProperty(ScalarNode____Key)){BoolNode[ScalarNode____Key]=ScalarNode[ScalarNode____Key];}}BoolNode.prototype=Object.create(____SuperProtoOfScalarNode);BoolNode.prototype.constructor=BoolNode;BoolNode.__superConstructor__=ScalarNode;function BoolNode(){if(ScalarNode!==null){ScalarNode.apply(this,arguments);}}

  BoolNode.prototype.getDefaultProps=function() {
    return {input: INPUT_CHECKBOX};
  };

  BoolNode.prototype.serialize=function(value) {
    return value;
  };

  BoolNode.prototype.deserialize=function(value) {
    return value;
  };



for(ScalarNode____Key in ScalarNode){if(ScalarNode.hasOwnProperty(ScalarNode____Key)){ArrayNode[ScalarNode____Key]=ScalarNode[ScalarNode____Key];}}ArrayNode.prototype=Object.create(____SuperProtoOfScalarNode);ArrayNode.prototype.constructor=ArrayNode;ArrayNode.__superConstructor__=ScalarNode;function ArrayNode(){if(ScalarNode!==null){ScalarNode.apply(this,arguments);}}

  ArrayNode.prototype.serialize=function(value) {
    return value ? value : EMPTY_LIST;
  };

  ArrayNode.prototype.deserialize=function(value) {
    return value;
  };


var IS_DATE_RE =  /^\d\d\d\d-\d\d-\d\d$/;
var INPUT_DATE = React.createElement("input", {type: "date"});

for(ScalarNode____Key in ScalarNode){if(ScalarNode.hasOwnProperty(ScalarNode____Key)){DateNode[ScalarNode____Key]=ScalarNode[ScalarNode____Key];}}DateNode.prototype=Object.create(____SuperProtoOfScalarNode);DateNode.prototype.constructor=DateNode;DateNode.__superConstructor__=ScalarNode;function DateNode(){if(ScalarNode!==null){ScalarNode.apply(this,arguments);}}

  DateNode.prototype.getDefaultProps=function() {
    return {input: INPUT_DATE};
  };

  DateNode.prototype.serialize=function(value) {
    if (value == null) { // jshint ignore:line
      return '';
    }
    var year = value.getFullYear();
    var month = value.getMonth() + 1;
    var day = value.getDate();
    return (year + "-" + this.pad(month, 2) + "-" + this.pad(day, 2));
  };

  DateNode.prototype.deserialize=function(value) {
    if (value === '') {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    if (!IS_DATE_RE.exec(value)) {
      return new Error(messages.IS_NOT_A_DATE);
    }

    value = new Date(value);

    if (isNaN(value.getTime())) {
      return new Error(messages.INVALID_VALUE);
    }

    return value;
  };

  DateNode.prototype.pad=function(num, size) {
    return ('0000' + num).substr(-size);
  };


function Scalar(props) {
  switch (props && props.type || 'string') {
    case 'string':
      return ScalarNode.create(props);
    case 'number':
      return NumberNode.create(props);
    case 'array':
      return ArrayNode.create(props);
    case 'date':
      return DateNode.create(props);
    case 'bool':
      return BoolNode.create(props);
    default:
      invariant(
        false,
        ("invalid type \"" + props.type + "\" supplied to Scalar")
      );
  }
}

var VALUE_IS_REQUIRED = ValidationResult.error(messages.VALUE_IS_REQUIRED);

for(var CompositeNode____Key in CompositeNode){if(CompositeNode.hasOwnProperty(CompositeNode____Key)){MappingNode[CompositeNode____Key]=CompositeNode[CompositeNode____Key];}}var ____SuperProtoOfCompositeNode=CompositeNode===null?null:CompositeNode.prototype;MappingNode.prototype=Object.create(____SuperProtoOfCompositeNode);MappingNode.prototype.constructor=MappingNode;MappingNode.__superConstructor__=CompositeNode;

  function MappingNode(props) {
    CompositeNode.call(this,props);
    this.__requiredKeys = this.children
      .toSeq()
      .filter(function(child)  {return child.props.get('required');})
      .keySeq()
      .toSet();
  }

  MappingNode.prototype.validate=function(value, childrenValidation) {
    var missingKeys = this.__requiredKeys.subtract(value.filter(function(v)  {return v != null;}).keys()); // jshint ignore:line
    if (missingKeys.size > 0) {
      var missingKeysValidation = Map().asMutable(); // jshint ignore:line
      missingKeys.forEach(function(k) 
        {return missingKeysValidation = missingKeysValidation.set(k, VALUE_IS_REQUIRED);});
      return ValidationResult.children(childrenValidation.children.merge(missingKeysValidation));
    }
    return ____SuperProtoOfCompositeNode.validate.call(this,value, childrenValidation);
  };

  MappingNode.prototype.getChildren=function() {
    return this.props.get('children');
  };

  MappingNode.prototype.get=function(key) {
    return this.children.get(key);
  };

  MappingNode.prototype.has=function(key) {
    return this.children.has(key);
  };

  MappingNode.prototype.keys=function(value) {
    return this.children.keys();
  };


function Mapping(props, children) {
  if (children === undefined) {
    children = props;
    children = OrderedMap(children); // jshint ignore:line
    props = {children:children};
  } else {
    children = OrderedMap(children); // jshint ignore:line
    props = Object.assign({},props, {children:children});
  }
  props = Map(props); // jshint ignore:line
  return new MappingNode(props);
}

for(CompositeNode____Key in CompositeNode){if(CompositeNode.hasOwnProperty(CompositeNode____Key)){ListNode[CompositeNode____Key]=CompositeNode[CompositeNode____Key];}}ListNode.prototype=Object.create(____SuperProtoOfCompositeNode);ListNode.prototype.constructor=ListNode;ListNode.__superConstructor__=CompositeNode;function ListNode(){if(CompositeNode!==null){CompositeNode.apply(this,arguments);}}

  ListNode.prototype.getChildren=function() {
    return this.props.get('children');
  };

  ListNode.prototype.get=function(key) {
    return this.children;
  };

  ListNode.prototype.has=function(key) {
    return true;
  };

  ListNode.prototype.keys=function(value) {
    return value.keys();
  };


function List(props, children) {
  if (children === undefined) {
    children = props;
    props = {children:children};
  } else {
    var newProps = {};
    for (var k in props) {
      if (props.hasOwnProperty(k)) {
        newProps[k] = props[k];
      }
      newProps.children = children;
    }
    props = newProps;
  }
  props = Map(props); // jshint ignore:line
  return new ListNode(props);
}

module.exports = {
  Node:Node,
  ScalarNode:ScalarNode, NumberNode:NumberNode, ArrayNode:ArrayNode, BoolNode:BoolNode, DateNode:DateNode,
  CompositeNode:CompositeNode,
  MappingNode:MappingNode, ListNode:ListNode,
  Scalar:Scalar, Mapping:Mapping, List:List
};
