/**
 * @jsx React.DOM
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var React     = require('react');
var PropTypes = React.PropTypes;
var Immutable = require('immutable');

var CheckboxGroup = React.createClass({displayName: "CheckboxGroup",

  propTypes: {
    options: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func
  },

  render:function() {
    var name = this._rootNodeID;
    var value = this.props.value;
    var options = this.props.options.map(function(option)  {
      var checked = value && value.indexOf(option.value) > -1;
      return (
        React.createElement("div", {
          className: "rf-CheckboxGroup__button", 
          key: option.value}, 
          React.createElement("label", {className: "rf-CheckboxGroup__label"}, 
            React.createElement("input", {
              onChange: this.onChange, 
              checked: checked, 
              className: "rf-CheckboxGroup__checkbox", 
              type: "checkbox", 
              name: name, 
              value: option.value}), 
            React.createElement("span", {className: "rf-CheckboxGroup__caption"}, 
              option.name
            )
          )
        )
      );
    }.bind(this));

    return (
      React.createElement("div", {className: "rf-CheckboxGroup"}, 
        options
      )
    );
  },

  getDefaultProps:function() {
    return {value: Immutable.List()};
  },

  onChange:function(e) {
    if (!this.props.onChange) {
      return;
    }

    var nextValue = this.props.value;

    if (e.target.checked) {
      nextValue = nextValue.push(e.target.value);
    } else {
      var idx = nextValue.indexOf(e.target.value);
      if (idx > -1) {
        nextValue = nextValue.splice(idx, 1);
      }
    }

    var values = this.props.options.map(function(o)  {return o.value;});
    nextValue.sort(function(a, b)  {return values.indexOf(a) - values.indexOf(b);});

    this.props.onChange(nextValue);
  }
});

module.exports = CheckboxGroup;
