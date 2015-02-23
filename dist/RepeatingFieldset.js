/**
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React           = require('react/addons');
var PropTypes       = React.PropTypes;
var cx              = React.addons.classSet;
var cloneWithProps  = React.addons.cloneWithProps;
var Label           = require('./Label');
var Element         = require('./Element');
var FormPropTypes   = require('./PropTypes');
var emptyFunction   = require('./emptyFunction');
var defaultValue    = require('./defaultValue');

var Item = React.createClass({displayName: "Item",

  render:function() {
    var $__0=      this.props,className=$__0.className,noRemoveButton=$__0.noRemoveButton,onRemove=$__0.onRemove,value=$__0.value,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{className:1,noRemoveButton:1,onRemove:1,value:1});
    return (
      React.createElement("div", React.__spread({},  props, {className: cx('rf-RepeatingFieldset__item', className)}), 
        this.props.children, 
        !noRemoveButton &&
          React.createElement("button", {
            onClick: onRemove, 
            type: "button", 
            className: "rf-RepeatingFieldset__remove"}, 
            "×"
          )
      )
    );
  }
});

/**
 * A component which renders values which correspond to List schema node.
 */
var RepeatingFieldset = React.createClass({displayName: "RepeatingFieldset",

  propTypes: {
    value: FormPropTypes.Value,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    label: PropTypes.string,
    noLabel: PropTypes.bool,
    hint: PropTypes.string,
    noAddButton: PropTypes.bool,
    noRemoveButton: PropTypes.bool
  },

  render:function() {
    var $__0=
           
           
      this.props,Item=$__0.item,value=$__0.value,className=$__0.className,noAddButton=$__0.noAddButton,noRemoveButton=$__0.noRemoveButton,onAdd=$__0.onAdd,onRemove=$__0.onRemove,noLabel=$__0.noLabel,label=$__0.label,hint=$__0.hint,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{item:1,value:1,className:1,noAddButton:1,noRemoveButton:1,onAdd:1,onRemove:1,noLabel:1,label:1,hint:1});
    return (
      React.createElement("div", React.__spread({},  props, {className: cx('rf-RepeatingFieldset', className)}), 
        !noLabel &&
          React.createElement(Label, {
            className: "rf-RepeatingFieldset__label", 
            label: label || value.node.props.get('label'), 
            hint: hint || value.node.props.get('hint')}
            ), 
        React.createElement("div", {className: "rf-RepeatingFieldset__items"}, 
          value.map(function(value, key)  {
            var props = {
              value:value,
              key:key,
              index: key,
              ref: key,
              noRemoveButton:noRemoveButton,
              onRemove: this.onRemove.bind(null, key),
              children: (
                React.createElement(Element, {
                  className: "rf-RepeatingFieldset__child", 
                  value: value}
                  )
              )
            };
            return React.isValidElement(Item) ?
              cloneWithProps(Item, props) :
              React.createElement(Item, React.__spread({},  props));
          }.bind(this))
        ), 
        !noAddButton &&
          React.createElement("button", {
            type: "button", 
            onClick: this.onAdd, 
            className: "rf-RepeatingFieldset__add"}, 
            "Add"
          )
      )
    );
  },

  getDefaultProps:function() {
    return {
      item: Item,
      onAdd: emptyFunction,
      onRemove: emptyFunction
    };
  },

  onAdd:function() {
    var newIdx = this.props.value.size;
    var valueToAdd = defaultValue(this.props.value.node.get(newIdx));
    this.props.value.transform(function(value)  {return value.push(valueToAdd);});
    this.props.onAdd();
  },

  onRemove:function(index) {
    this.props.value.transform(function(value)  {return value.splice(index, 1);});
    this.props.onRemove(index);
  },

  getItemByIndex:function(index) {
    return this.refs[index];
  }

});

module.exports = RepeatingFieldset;
module.exports.Item = Item;
