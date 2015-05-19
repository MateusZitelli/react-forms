/**
 * `<Form />` component is a stateful wrapper around `<Element />` component.
 *
 * The basic usage is as follows:
 *
 *    <Form
 *      schema={...}
 *      defaultValue={...}
 *      onChange={function(value) { ... }}
 *      onUpdate={function(value, validation) { ... }}
 *      />
 *
 * Property `defaultValue` is used to set the initial value of the form. It only
 * takes effect on initial render, after that form uses its own value from the
 * state.
 *
 * Callback `onUpdate` is called on every change to a form value, `onChange` is
 * only called when form value is valid after the change.
 *
 * Alternatively one can read current form value by calling `getValue()` method
 * (you can access form by keeping a ref to it).
 *
 * @copyright Prometheus Research, LLC 2014
 */
'use strict';

var $__0=           require('immutable'),is=$__0.is;
var React         = require('react/addons');
var PropTypes     = React.PropTypes;
var cx            = React.addons.classSet;
var FormPropTypes = require('./PropTypes');
var Element       = require('./Element');
var Value         = require('./Value');
var emptyFunction = require('./emptyFunction');
var FocusStore    = require('./FocusStore');

var Form = React.createClass({displayName: "Form",

  mixins: [FocusStore.ScopeMixin],

  propTypes: {
    component: PropTypes.constructor,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    externalValidation: PropTypes.object,
    schema: FormPropTypes.Schema,
    onChange: PropTypes.func,
    onUpdate: PropTypes.func
  },

  render:function() {
    var $__0=
        
       
       
      
      this.props,Component=$__0.component,className=$__0.className,onUpdate=$__0.onUpdate,onChange=$__0.onChange,defaultValue=$__0.defaultValue,externalValidation=$__0.externalValidation,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{component:1,className:1,onUpdate:1,onChange:1,defaultValue:1,externalValidation:1});
    var $__1=  this.state,value=$__1.value;
    var classNames = cx(
      className,
      'rf-Form',
      !value.isValid && 'rf-Form--invalid'
    );
    return (
      React.createElement(Component, React.__spread({},  props, {className: classNames}), 
        React.createElement(Element, {value: this.state.value})
      )
    );
  },

  getDefaultProps:function() {
    return {
      component: 'form',
      onChange: emptyFunction,
      onUpdate: emptyFunction
    };
  },

  getInitialState:function() {
    var $__0=    this.props,schema=$__0.schema,defaultValue=$__0.defaultValue,externalValidation=$__0.externalValidation;
    var value = Value.create(schema, defaultValue, this.onUpdate, this.root);
    if (externalValidation) {
      value = value.setExternalValidation(externalValidation);
    }
    return {value:value};
  },

  componentWillReceiveProps:function($__0 ) {var schema=$__0.schema,externalValidation=$__0.externalValidation;
    var value = this.root();
    if (!is(schema, this.props.schema)) {
      value = value.setSchema(schema);
    }
    if (!is(externalValidation, this.props.externalValidation)) {
      value = value.setExternalValidation(externalValidation);
    }
    this.setState({value:value});
  },

  root:function() {
    return this._pendingState && this._pendingState.value ?
      this._pendingState.value :
      this.state.value;
  },

  onUpdate:function(value, keyPath) {
    this.setState({value:value});
    this.props.onUpdate(value.value, value.validation, keyPath);
    if (value.isValid) {
      this.props.onChange(value.value, value.validation, keyPath);
    }
  },

  getValue:function() {
    return this.state.value.value;
  },

  makeDirty:function() {
    this.state.value.makeDirty();
  },

  setValue:function(newValue) {
    var value = this.state.value.set(newValue);
    this.setState({value:value});
  },

  getValidation:function() {
    return this.state.value.validation;
  },

  isValid:function() {
    return this.state.value.isValid;
  }
});

module.exports = Form;
