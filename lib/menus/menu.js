'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react/addons');
var StylePropable = require('../mixins/style-propable');
var Dom = require('../utils/dom');
var List = require('../lists/list');

var Menu = React.createClass({
  displayName: 'Menu',

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    desktop: React.PropTypes.bool,
    width: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      zDepth: 1
    };
  },

  getInitialState: function getInitialState() {
    return {
      keyWidth: this.props.desktop ? 64 : 56
    };
  },

  componentDidMount: function componentDidMount() {
    this._setWidth();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._setWidth();
  },

  render: function render() {
    var _props = this.props;
    var desktop = _props.desktop;
    var style = _props.style;
    var width = _props.width;

    var other = _objectWithoutProperties(_props, ['desktop', 'style', 'width']);

    var styles = {
      root: {
        display: 'table-cell',
        paddingBottom: desktop ? 16 : 8,
        paddingTop: desktop ? 16 : 8,
        userSelect: 'none',
        width: width
      }
    };

    var mergedRootStyles = this.mergeStyles(styles.root, style);

    var children = React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, { desktop: desktop }, child.props.children);
    });

    return React.createElement(
      List,
      _extends({}, other, { style: mergedRootStyles }),
      children
    );
  },

  _setWidth: function _setWidth() {

    var el = React.findDOMNode(this);
    var elWidth = el.offsetWidth;
    var keyWidth = this.state.keyWidth;
    var minWidth = keyWidth * 1.5;
    var keyIncrements = elWidth / keyWidth;
    var newWidth = undefined;

    keyIncrements = keyIncrements <= 1.5 ? 1.5 : Math.ceil(keyIncrements);
    newWidth = keyIncrements * keyWidth;

    if (newWidth < minWidth) newWidth = minWidth;

    el.style.width = newWidth + 'px';
  }

});

module.exports = Menu;