/**
 * @flow
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React = require('react');

var Demo = React.createClass({displayName: "Demo",

  render:function()                {
    var $__0=   this.props,children=$__0.children,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{children:1});
    children = React.Children.only(children);
    children = React.addons.cloneWithProps(children, {
      onUpdate: this.onUpdate,
      ref: 'form'
    });
    return (
      React.createElement("div", React.__spread({},  props, {className: "rf-Demo"}), 
        React.createElement("div", {className: "rf-Demo__form"}, 
          children
        ), 
        React.createElement("div", {className: "rf-Demo__inspector"}, 
          React.createElement("h6", {className: "rf-Demo__label"}, "Value:"), 
          React.createElement("pre", {className: "rf-Demo__value"}, 
            JSON.stringify(this.state.value, null, 2)
          ), 
          React.createElement("h6", {className: "rf-Demo__label"}, "Validation State:"), 
          React.createElement("pre", {className: "rf-Demo__value"}, 
            JSON.stringify(this.state.validation, null, 2)
          )
        )
      )
    );
  },

  getInitialState:function()                {
    return {value: null, validation: null};
  },

  onUpdate:function(value     , validation     , keyPath               ) {
    this.setState({value: value.toJS(), validation: validation.toJS()});
  },

  componentDidMount:function() {
    var value = this.refs.form.getValue().toJS();
    var validation = this.refs.form.getValidation().toJS();
    this.setState({value:value, validation:validation});
  }
});

module.exports = Demo;
