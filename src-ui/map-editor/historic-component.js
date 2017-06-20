/*jshint esversion: 6 */

var React = require('react');
var _ = require('underscore');
import {getStyleForType} from './component-styles';
import {Glyphicon} from 'react-bootstrap';


var itemCaptionStyle = {
  top: -10,
  left: 10,
  position: 'absolute',
  zIndex: 20,
  textShadow: '0 0 5px white, 0 0 3px white, 0 0 7px white, 0 0 1px white',
  height: 22,
  maxWidth: 100,
  maxHeight: 22,
  marginBottom: -20,
  fontSize: 10,
  lineHeight: '11px'
};

var inertiaStyle = {
  top: -15,
  left: 15,
  position: 'absolute',
  zIndex: 10,
  backgroundColor: 'grey',
  height: 40
};

var HistoricComponent = React.createClass({

  getInitialState: function() {
    return {focus: false};
  },

  renderInertia: function(inertia){
    if(inertia === 0 || inertia === null || inertia === undefined){
      return null;
    }
    var width = 15* inertia;

    var style = _.extend(inertiaStyle, {
        width : width
    });
    return <div style={style}></div>;
  },

  renderName(node){
    if(node.constraint == 20){
      return <span>{node.name}<Glyphicon glyph="minus-sign"/></span>;
    }
    if(node.constraint == 10){
      return <span>{node.name}<Glyphicon glyph="exclamation-sign"/></span>;
    }
    return node.name;
  },

  decorateDiffStyle(type, node, style, diff) {
    if(type === "DELETED"){
      style.boxShadow = "0 0 3px 3px red";
      style.opacity = "0.8";
    }
    if(type === "MOVED"){
      style.boxShadow = "0 0 3px 3px orange";
      style.opacity = "0.8";
      style.border = '1px solid dimgray';
    }
  },

  render: function() {

    if (!this.props.canvasStore.isDiffEnabled()) {
      return null;
    }

    var node = this.props.node;
    var diff = this.props.diff;
    var style = getStyleForType(node.type);
    var left = node.x * this.props.size.width;
    var top = node.y * this.props.size.height;
    style = _.extend(style, {
      left: left,
      top: top,
      position: 'absolute',
      cursor: 'pointer'
    });
    let type = this.props.type;
    this.decorateDiffStyle(type, node, style, diff);

    var name = this.renderName(node);
    var _this = this;
    var id = this.props.id;
    var mapID = this.props.mapID;
    var workspaceID = this.props.workspaceID;
    var inertia = this.renderInertia(this.props.inertia);
    var canvasStore = this.props.canvasStore;

    return (
      <div style={style} id={id} key={id}>
        <div style={itemCaptionStyle}>{name}</div>
        {inertia}
      </div>
    );
  }
});

module.exports = HistoricComponent;
