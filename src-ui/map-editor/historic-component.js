/*jshint esversion: 6 */

var React = require('react');
var _ = require('underscore');
var Constants = require('../constants');
import Actions from './single-map-actions';
import {getStyleForType} from './component-styles';
import {Button, Glyphicon} from 'react-bootstrap';
import {endpointOptions} from './component-styles';
import {actionEndpointOptions} from './component-styles';
import CanvasActions from './canvas-actions';
var LinkContainer = require('react-router-bootstrap').LinkContainer;

var jsPlumb = require("../../node_modules/jsplumb/dist/js/jsplumb.min.js").jsPlumb;

var activeStyle = {
  boxShadow: "0 0 10px #00789b",
  color: "#00789b"
};

var nonInlinedStyle = {
  position: 'absolute'
};

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

/* globals document */
/* globals window */
function getElementOffset(element)
{
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}

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


  // onClickHandler: function(e) {
  //   if (this.state.hover === "submap" && this.props.node.submapID) {
  //     return; //pass the event to link, this is a submap and actually has a submap
  //   }
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (this.state.hover === "submap"){
  //     // submap menu on non-submap, we want to turn the node into submap.
  //     Actions.openTurnIntoSubmapNodeDialog(this.props.workspaceID, this.props.mapID, this.props.id);
  //   }
  //   if (this.state.hover === "remove") {
  //     var id = this.props.id;
  //     var mapID = this.props.mapID;
  //     var workspaceID = this.props.workspaceID;
  //     Actions.deleteNode(workspaceID, mapID, id);
  //   }
  //   if (this.state.hover === "pencil") {
  //     var nodeID = this.props.id; //jshint ignore:line
  //     var mapID = this.props.mapID; //jshint ignore:line
  //     Actions.openEditNodeDialog(mapID, nodeID);
  //   }
  //   if (this.state.hover === "group") {
  //     var mapID = this.props.mapID; //jshint ignore:line
  //     Actions.openCreateSubmapDialog({
  //       mapID:mapID,
  //       nodes:this.props.canvasStore.getCanvasState().currentlySelectedNodes,
  //       comments: this.props.canvasStore.getCanvasState().currentlySelectedComments});
  //   }
  //   if (this.state.hover === "info") {
  //     var mapID = this.props.mapID; //jshint ignore:line
  //     var submapID = this.props.node.submapID;
  //     var currentName = this.props.node.name;
  //     var node = this.props.node; //jshint ignore:line
  //     var workspaceID = this.props.workspaceID;
  //     if(submapID){
  //       Actions.openSubmapReferencesDialog(
  //          currentName: currentName,
  //          mapID:mapID,
  //          submapID:submapID,
  //          node :node,
  //          workspaceID:workspaceID);
  //     } else {
  //       Actions.openReferencesDialog(
  //          currentName: currentName,
  //          node:node,
  //          workspaceID:workspaceID);
  //     }
  //   }
  //
  //   if(this.state.hover === 'action'){
  //     console.log('action!!!');
  //   }
  //   if((e.nativeEvent.ctrlKey || e.nativeEvent.altKey)){
  //     if (this.props.focused) {
  //       CanvasActions.deselectNode(this.props.id);
  //     } else {
  //       CanvasActions.focusAdditionalNode(this.props.id);
  //     }
  //   } else if (this.props.focused) {
  //     CanvasActions.deselectNodesAndConnections();
  //   } else {
  //     CanvasActions.focusNode(this.props.id);
  //   }
  // },

  // mouseOver: function(target) {
  //   if(this.props.focused){
  //     this.setState({hover: target});
  //   }
  //
  //   var n = this.props.node;
  //   // create and add everything to posse
  //   if(target === 'move' && n.action && n.action.length > 0){
  //     jsPlumb.addToPosse(n._id, n._id);
  //     for(var i = 0; i < n.action.length; i++){
  //         jsPlumb.addToPosse(n.action[i]._id, n._id);
  //     }
  //   }
  //   this.setState({'posse': true});
  // },

  // cleanPosse : function(){
  //   // clean posse
  //   if(this.state.posse){
  //     var n = this.props.node;
  //     if(n.action && n.action.length > 0){
  //       jsPlumb.removeFromPosse(n._id, n._id);
  //       for(var i = 0; i < n.action.length; i++){
  //           jsPlumb.removeFromPosse(n.action[i]._id, n._id);
  //       }
  //     }
  //     this.setState({'posse': false});
  //   }
  // },

  // mouseOut: function(target) {
  //   this.setState({hover: null});
  //   if(target === 'move'){
  //       this.cleanPosse();
  //   }
  // },

  // renderMenu() {
  //   if (!this.props.focused) {
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeSource(this.input);
  //       jsPlumb.makeTarget(this.input, endpointOptions, {anchor: "TopCenter"});
  //     }
  //     return null;
  //   }
  //   if(this.props.multi){
  //     var groupStyle = {
  //       position: "absolute",
  //       fontSize: "20px",
  //       color: "silver",
  //       top: "-25px",
  //       left: "-25px",
  //       zIndex: "30"
  //     };
  //     if (this.state.hover === "group") {
  //       groupStyle = _.extend(groupStyle, activeStyle);
  //       if (this.input) {
  //         jsPlumb.setDraggable(this.input, false);
  //         jsPlumb.unmakeTarget(this.input);
  //         jsPlumb.unmakeSource(this.input);
  //       }
  //     }
  //     return(<div><Glyphicon onMouseOver={this.mouseOver.bind(this, "group")} onMouseOut={this.mouseOut} glyph="resize-small" style={groupStyle}></Glyphicon></div>);
  //   }
  //   var pencilStyle = {
  //     position: "absolute",
  //     fontSize: "20px",
  //     color: "silver",
  //     top: "-25px",
  //     left: "-25px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "pencil") {
  //     pencilStyle = _.extend(pencilStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //     }
  //   }
  //   var removeStyle = {
  //     position: "absolute",
  //     color: "silver",
  //     top: "-25px",
  //     fontSize: "20px",
  //     left: "15px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "remove") {
  //     removeStyle = _.extend(removeStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //     }
  //   }
  //   var linkStyle = {
  //     position: "absolute",
  //     top: "15px",
  //     color: "silver",
  //     left: "15px",
  //     fontSize: "20px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "link") {
  //     linkStyle = _.extend(linkStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //       jsPlumb.makeSource(this.input, endpointOptions, {anchor: "BottomCenter"});
  //     }
  //   }
  //   var moveStyle = {
  //     position: "absolute",
  //     top: "15px",
  //     color: "silver",
  //     left: "-25px",
  //     fontSize: "20px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "move") {
  //     moveStyle = _.extend(moveStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, true);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //     }
  //   }
  //   var submapStyle = {
  //     position: "absolute",
  //     top: "20px",
  //     color: "silver",
  //     left: "-5px",
  //     fontSize: "20px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "submap") {
  //     submapStyle = _.extend(submapStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //     }
  //   }
  //   var infoStyle = {
  //     position: "absolute",
  //     top: "-33px",
  //     color: "silver",
  //     left: "-4px",
  //     fontSize: "20px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "info") {
  //     infoStyle = _.extend(infoStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //     }
  //   }
  //   var actionStyle = {
  //     position: "absolute",
  //     top: "-5px",
  //     color: "silver",
  //     left: "22px",
  //     fontSize: "20px",
  //     zIndex: "30"
  //   };
  //   if (this.state.hover === "action") {
  //     actionStyle = _.extend(actionStyle, activeStyle);
  //     if (this.input) {
  //       jsPlumb.setDraggable(this.input, false);
  //       jsPlumb.unmakeTarget(this.input);
  //       jsPlumb.unmakeSource(this.input);
  //       jsPlumb.makeSource(this.input, actionEndpointOptions, {anchor: "Right"});
  //     }
  //   }
  //   var menuItems = [];
  //   menuItems.push(<Glyphicon onMouseOver={this.mouseOver.bind(this, "pencil")} onMouseOut={this.mouseOut} glyph="pencil" style={pencilStyle}></Glyphicon>);
  //   menuItems.push(<Glyphicon onMouseOver={this.mouseOver.bind(this, "remove")} onMouseOut={this.mouseOut} glyph="remove" style={removeStyle}></Glyphicon>);
  //   menuItems.push(<Glyphicon onMouseOver={this.mouseOver.bind(this, "link")} onMouseOut={this.mouseOut} glyph="link" style={linkStyle}></Glyphicon>);
  //   menuItems.push(<Glyphicon onMouseOver={this.mouseOver.bind(this, "move")} onMouseOut={this.mouseOut} glyph="move" style={moveStyle}></Glyphicon>);
  //   menuItems.push(<Glyphicon onMouseOver={this.mouseOver.bind(this, "action")} onMouseOut={this.mouseOut} glyph="arrow-right" style={actionStyle}></Glyphicon>);
  //   if(this.props.node.type === Constants.SUBMAP){
  //     var href = "/map/" + this.props.node.submapID;
  //     var linkContainer = (
  //       <a href={href} key='zoom-in'><Glyphicon onMouseOver={this.mouseOver.bind(this, "submap")} onMouseOut={this.mouseOut} glyph="zoom-in" style={submapStyle} key='zoom-in'></Glyphicon></a>
  //     );
  //     var infoContainer = (<a href={href}><Glyphicon onMouseOver={this.mouseOver.bind(this, "info")} onMouseOut={this.mouseOut} glyph="info-sign" key='info-sign' style={infoStyle}></Glyphicon></a>);
  //     menuItems.push(linkContainer);
  //     menuItems.push(infoContainer);
  //   } else {
  //     var infoContainer = (<a href={href}><Glyphicon onMouseOver={this.mouseOver.bind(this, "info")} onMouseOut={this.mouseOut} glyph="info-sign" key='info-sign' style={infoStyle}></Glyphicon></a>);
  //     var linkContainer = (
  //       <Glyphicon onMouseOver={this.mouseOver.bind(this, "submap")} onMouseOut={this.mouseOut} glyph="zoom-in" style={submapStyle} onClick={null} key='zoom-in'></Glyphicon>
  //     );
  //     menuItems.push(linkContainer);
  //     menuItems.push(infoContainer);
  //   }
  //   return (
  //     <div>
  //       {menuItems}
  //     </div>
  //   );
  // },
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
    var menu = null;//this.renderMenu();
    var _this = this;
    var id = this.props.id;
    var mapID = this.props.mapID;
    var workspaceID = this.props.workspaceID;
    var inertia = this.renderInertia(this.props.inertia);
    var canvasStore = this.props.canvasStore;

    return (
      <div style={style} onClick={this.onClickHandler} id={id} key={id} ref={input => {
        if (input) {
          this.input = input;
        }
        if (!input) {
          return;
        }
      }}>
        <div style={itemCaptionStyle}>{name}</div>
        {inertia}
        {menu}
      </div>
    );
  }
});

module.exports = HistoricComponent;
