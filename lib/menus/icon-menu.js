'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react/addons');
var ClickAwayable = require('../mixins/click-awayable');
var StylePropable = require('../mixins/style-propable');
var Transitions = require('../styles/transitions');
var KeyCode = require('../utils/key-code');
var Menu = require('../menus/menu');

var IconMenu = React.createClass({
  displayName: 'IconMenu',

  mixins: [StylePropable, ClickAwayable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    desktop: React.PropTypes.bool,
    iconButtonElement: React.PropTypes.element.isRequired,
    menuPosition: React.PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),
    menuStyle: React.PropTypes.object,
    onKeyDown: React.PropTypes.func,
    width: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      menuPosition: 'bottom-left'
    };
  },

  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },

  componentClickAway: function componentClickAway() {
    this.close();
  },

  render: function render() {
    var _this2 = this;

    var _props = this.props;
    var desktop = _props.desktop;
    var iconButtonElement = _props.iconButtonElement;
    var menuPosition = _props.menuPosition;
    var menuStyle = _props.menuStyle;
    var width = _props.width;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['desktop', 'iconButtonElement', 'menuPosition', 'menuStyle', 'width', 'style']);

    var open = this.state.open;
    var openDown = menuPosition.split('-')[0] === 'bottom';
    var openLeft = menuPosition.split('-')[1] === 'left';

    var styles = {
      root: {
        display: 'inline-block',
        position: 'relative'
      },

      //This is needed bacause the container scales x faster than
      //it scales y
      menuContainer: {
        transition: Transitions.easeOut('250ms', 'transform'),
        transitionDelay: open ? '0ms' : '250ms',
        position: 'absolute',
        zIndex: 10,
        top: openDown ? 12 : null,
        bottom: !openDown ? 12 : null,
        left: !openLeft ? 12 : null,
        right: openLeft ? 12 : null,
        transform: open ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: openLeft ? 'right' : 'left'
      },

      menu: {
        transition: Transitions.easeOut(null, ['transform', 'opacity']),
        transitionDuration: open ? '500ms' : '200ms',
        transform: open ? 'scaleY(1) translate3d(0,0,0)' : 'scaleY(0) translate3d(0,-8px,0)',
        transformOrigin: openDown ? 'top' : 'bottom',
        opacity: open ? 1 : 0
      },

      menuItem: {
        transition: Transitions.easeOut(null, 'opacity'),
        transitionDelay: open ? '400ms' : '0ms',
        opacity: open ? 1 : 0
      }
    };

    var _this = this;
    var mergedRootStyles = this.mergeAndPrefix(styles.root, style);
    var mergedMenuContainerStyles = this.mergeAndPrefix(styles.menuContainer);
    var mergedMenuStyles = this.mergeStyles(styles.menu, menuStyle);

    var iconButton = React.cloneElement(iconButtonElement, {
      onTouchTap: function onTouchTap(e) {
        _this._handleIconButtonTouchTap(e, _this2);
      }
    }, iconButtonElement.props.children);

    //Cascade children opacity
    var childrenTransitionDelay = openDown ? 175 : 325;
    var childrenTransitionDelayIncrement = Math.ceil(150 / React.Children.count(this.props.children));
    var children = React.Children.map(this.props.children, function (child) {

      if (openDown) {
        childrenTransitionDelay += childrenTransitionDelayIncrement;
      } else {
        childrenTransitionDelay -= childrenTransitionDelayIncrement;
      }

      var mergedChildrenStyles = _this2.mergeStyles(styles.menuItem, {
        transitionDelay: open ? childrenTransitionDelay + 'ms' : '0ms'
      }, child.props.style);

      var clonedChild = React.cloneElement(child, {
        onTouchTap: function onTouchTap(e) {
          _this._handleChildTouchTap(e, _this2);
        }
      }, child.props.children);

      return React.createElement(
        'div',
        { style: mergedChildrenStyles },
        clonedChild
      );
    });

    return React.createElement(
      'div',
      _extends({}, other, {
        style: mergedRootStyles,
        onKeyDown: this._handleKeyDown }),
      iconButton,
      React.createElement(
        'div',
        { style: mergedMenuContainerStyles },
        React.createElement(
          Menu,
          {
            desktop: desktop,
            width: width,
            style: mergedMenuStyles },
          children
        )
      )
    );
  },

  close: function close() {
    if (!this.state.close) {
      this.setState({
        open: false
      });
    }
  },

  open: function open() {
    if (!this.state.open) {
      this.setState({
        open: true
      });
    }
  },

  _handleIconButtonTouchTap: function _handleIconButtonTouchTap(e, iconButton) {
    this.open();
    if (iconButton.props.onTouchTap) iconButton.props.onTouchTap(e);
  },

  _handleKeyDown: function _handleKeyDown(e) {
    switch (e.which) {
      case KeyCode.ESC:
        this.close();
      default:
        return;
    }
    e.preventDefault();
  },

  _handleChildTouchTap: function _handleChildTouchTap(e, child) {
    var _this3 = this;

    setTimeout(function () {
      _this3.close();
      if (child.props.onTouchTap) child.props.onTouchTap(e);
    }, 200);
  }
});

module.exports = IconMenu;