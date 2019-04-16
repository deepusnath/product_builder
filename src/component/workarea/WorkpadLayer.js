import React, { Component } from 'react';
import { Layer, Rect, Group } from 'react-konva';
import { List } from 'immutable';
import BuilderModifier from '../../model/modifier/BuilderModifier';
import BuilderUtils from '../../model/modifier/BuilderUtils';

class WorkpadLayer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      overElement:false
    }
    this.node_selection_id = "node_selection"
    this.node_selection_position = {
      x:0,
      y:0,
      width:0,
      height:0
    }
  }

  handleClick(context){
    var node = context.target
    var attrs = node.getAttrs()
    var index = attrs.name.replace('node_work_', '')
    this.props.handles.updateSelection([index * 1])
  }

  onDragEndElement(context){
    var node = context.target
    var attrs = node.getAttrs()
    var index = attrs.name.replace('node_work_', '')
    var builderState = this.props.builderState
    var contentState = builderState.getCurrentContent()
    var changes = {
      x: attrs.x,
      y: attrs.y
    }
    contentState = BuilderModifier.updateElement(
      contentState, 
      index,
      changes
    )
    builderState = BuilderUtils.updateSelection(
      builderState,
      List([index * 1])
    )
    this.props.handles.onChange(
      BuilderUtils.updateElements(
        builderState,
        contentState
      )
    )
  }

  onDragMoveElement(context){
    var node = context.target
    var attrs = node.getAttrs()
    var index = attrs.name.replace('node_work_', '')
    var previewNode = node.getStage().find('.node' + index)[0]
    previewNode.setX(attrs.x)
    previewNode.setY(attrs.y)
    node.getStage().find('.node' + index)[0].getParent().draw();
  }

  onMouseDown(context){
    var node = context.target
    if(node.getStage().find('.' + this.node_selection_id + "Group").length > 0) {
      node.getStage().find('.' + this.node_selection_id + "Group")[0].destroy()
    }
  }

  onMouseOver(i){
    var state = this.state
    state.overElement = i
    this.setState(state)
  }

  onMouseOut(i){
    var state = this.state
    state.overElement = false
    this.setState(state)
  }

  onDragEndSelection(context){
    var node = context.target
    var attrs = node.getAttrs()
    var contentState = this.props.builderState.getCurrentContent()
    this.props.builderState.getSelections().forEach(function(index) {
      var currentElement = contentState.getElements().get(index)
      var changes = {
        x: currentElement.getIn(['attrs', 'x']) + attrs.x - this.node_selection_position.x,
        y: currentElement.getIn(['attrs', 'y']) + attrs.y - this.node_selection_position.y
      }
      contentState = BuilderModifier.updateElement(
        contentState, 
        index,
        changes
      )
    }.bind(this));

    this.props.handles.onChange(
      BuilderUtils.updateElements(
        this.props.builderState,
        contentState
      )
    )
  }

  onDragMoveSelection(context) {
    if(this.props.builderState.getSelections().size > 0){
      var node = context.target
      var attrs = node.getAttrs()
      this.props.builderState.getSelections().forEach(function(index) {
        var previewNode = node.getStage().find('.node' + index)[0]
        var currentElement = this.props.builderState.getCurrentContent().getElements().get(previewNode.getAttrs().name.replace('node', '') * 1)
        previewNode.setX(attrs.x + currentElement.getIn(['attrs', 'x']) - this.node_selection_position.x)
        previewNode.setY(attrs.y + currentElement.getIn(['attrs', 'y']) - this.node_selection_position.y)
      }.bind(this));

      var topLeft = node.getStage().find('.' + this.node_selection_id + 'topLeft')[0]
      var topRight = node.getStage().find('.' + this.node_selection_id + 'topRight')[0]
      var bottomLeft = node.getStage().find('.' + this.node_selection_id + 'bottomLeft')[0]
      var bottomRight = node.getStage().find('.' + this.node_selection_id + 'bottomRight')[0]

      topLeft.setX(attrs.x - 5)
      topLeft.setY(attrs.y - 5)

      topRight.setX(attrs.x + attrs.width - 5)
      topRight.setY(attrs.y - 5)

      bottomLeft.setX(attrs.x - 5)
      bottomLeft.setY(attrs.y + attrs.height - 5)

      bottomRight.setX(attrs.x + attrs.width - 5)
      bottomRight.setY(attrs.y + attrs.height - 5)

      node.getStage().find('.node0')[0].getParent().draw();
    }
  }

  anchorMovement(activeAnchor){
    var stage = activeAnchor.getStage();
    var group = activeAnchor.getParent();
    var previewLayer = stage.find('.preview-layer')[0];
    var topLeft = group.get('.' + this.node_selection_id + 'topLeft')[0];
    var topRight = group.get('.' + this.node_selection_id + 'topRight')[0];
    var bottomRight = group.get('.' + this.node_selection_id + 'bottomRight')[0];
    var bottomLeft = group.get('.' + this.node_selection_id + 'bottomLeft')[0];
    var selectionRect = group.get('.' + this.node_selection_id)[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    switch (activeAnchor.getName()) {
        case this.node_selection_id + 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case this.node_selection_id + 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case this.node_selection_id + 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case this.node_selection_id + 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    selectionRect.position({x:topLeft.position().x + 5, y:topLeft.position().y + 5});

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();

    this.props.builderState.getSelections().forEach(function(index) {
      var previewNode = stage.find('.node' + index)[0]
      var currentElement = this.props.builderState.getCurrentContent().getElements().get(previewNode.getAttrs().name.replace('node', '') * 1)
      if(width && height) {
          var deviation = (width / this.node_selection_position.width)
          if(currentElement.get('className') == "Text"){
            previewNode.fontSize(deviation * currentElement.getIn(['attrs', 'fontSize']))
          }
          var newWidth = deviation * currentElement.getIn(['attrs', 'width'])
          var newHeight = (currentElement.getIn(['attrs', 'height']) / currentElement.getIn(['attrs', 'width'])) * newWidth
          var delta = {
              x: ((currentElement.getIn(['attrs', 'x']) - this.node_selection_position.x) * deviation), 
              y: ((currentElement.getIn(['attrs', 'y']) - this.node_selection_position.y) * deviation)
          }
          previewNode.width(newWidth);
          previewNode.height(newHeight);
          switch (activeAnchor.getName()) {
              case this.node_selection_id + 'topLeft':
                  previewNode.setX(selectionRect.position().x + delta.x)
                  previewNode.setY(selectionRect.position().y + delta.y)
                  break;
              case this.node_selection_id + 'topRight':
                  previewNode.setX(this.node_selection_position.x + delta.x)
                  previewNode.setY(selectionRect.position().y + delta.y)
                  break;
              case this.node_selection_id + 'bottomRight':
                  previewNode.setX(this.node_selection_position.x + delta.x)
                  previewNode.setY(this.node_selection_position.y + delta.y)
                  break;
              case this.node_selection_id + 'bottomLeft':
                  previewNode.setX(selectionRect.position().x + delta.x)
                  previewNode.setY(this.node_selection_position.y + delta.y)
                  break;
          }
      }
    }.bind(this));

    if(width && height) {
        selectionRect.width(width);
        selectionRect.height(height);
    }
    group.getParent().draw();
    previewLayer.draw();
  }

  onDragMoveAnchor(context){
    this.anchorMovement(context.target)
  }

  onMouseDownTouchStartAnchor(context){
    var node = context.target;
    node.getParent().setDraggable(false);
    node.moveToTop();
  }

  onDragEndAnchor(context){
    var activeAnchor = context.target;
    var stage = activeAnchor.getStage();
    var group = activeAnchor.getParent();
    var previewLayer = stage.find('.preview-layer')[0];
    var contentState = this.props.builderState.getCurrentContent()

    activeAnchor.getParent().setDraggable(false);
    activeAnchor.getParent().getParent().draw();

    this.props.builderState.getSelections().forEach(function(index) {
      var previewNode = stage.find('.node' + index)[0]
      var currentElement = contentState.getElements().get(index)
      var changes = {
        x:previewNode.getAttrs().x,
        y:previewNode.getAttrs().y,
        width:previewNode.getAttrs().width,
        height:previewNode.getAttrs().height,
      }
      if(currentElement.get('className') === 'Text') {
        changes.fontSize = previewNode.getAttrs().fontSize
      }
      contentState = BuilderModifier.updateElement(
        contentState, 
        index,
        changes
      )
    }.bind(this));

    this.props.handles.onChange(
      BuilderUtils.updateElements(
        this.props.builderState,
        contentState
      )
    )
  }

  dragBoundFunc(name, pos){
    var points, prevX, prevY, newX, newY, aspectRatio, newPos, newWidth, newHeight
    newPos = {x:pos.x + 5, y: pos.y + 5}
    points = {
      topLeft: {x:this.node_selection_position.x, y:this.node_selection_position.y},
      topRight: {x: this.node_selection_position.x + this.node_selection_position.width, y: this.node_selection_position.y},
      bottomRight: {x: this.node_selection_position.x + this.node_selection_position.width, y: this.node_selection_position.y + this.node_selection_position.height},
      bottomLeft: {x: this.node_selection_position.x, y: this.node_selection_position.y + this.node_selection_position.height}
    }
    aspectRatio = this.node_selection_position.width / this.node_selection_position.height
    switch (name) {
        case 'topLeft':
            pos = {x:pos.x + 5, y: pos.y + 5}
            newWidth = points.bottomRight.x - pos.x
            newHeight = newWidth / aspectRatio
            if(points.bottomRight.y - newHeight < pos.y){
              newPos.x = pos.x - 5
              newPos.y = points.bottomRight.y - newHeight - 5
            } else {
              newHeight = points.bottomRight.y - pos.y
              newWidth = newHeight * aspectRatio
              newPos.y = pos.y - 5
              newPos.x = points.bottomRight.x - newWidth - 5
            }
            if(newPos.x + 15 > points.bottomRight.x) {
              newPos = {x:points.bottomRight.x - 15, y:points.bottomRight.y - 15}
            }
            break;
        case 'topRight':
            pos = {x:pos.x + 5, y: pos.y + 5}
            newWidth = pos.x - points.bottomLeft.x
            newHeight = newWidth / aspectRatio
            if(points.bottomLeft.y - newHeight < pos.y) {
              newPos.x = pos.x - 5
              newPos.y = points.bottomLeft.y - newHeight - 5
            } else {
              newHeight = points.bottomLeft.y - pos.y
              newWidth = newHeight * aspectRatio
              newPos.y = pos.y - 5
              newPos.x = points.bottomLeft.x + newWidth - 5
            }
            if(newPos.x < points.bottomLeft.x + 5) {
              newPos = {x:points.bottomLeft.x + 5, y:points.bottomLeft.y - 15}
            }
            break;
        case 'bottomRight':
            pos = {x:pos.x + 5, y: pos.y + 5}
            newWidth = pos.x - points.topLeft.x
            newHeight = newWidth / aspectRatio
            if(newHeight + points.topLeft.y > pos.y) {
              newPos.x = pos.x - 5
              newPos.y = newHeight + points.topLeft.y - 5
            } else {
              newHeight = pos.y - points.topLeft.y
              newWidth = newHeight * aspectRatio
              newPos.y = pos.y - 5
              newPos.x = newWidth + points.topLeft.x - 5
            }
            if(newPos.x < points.topLeft.x + 5) {
              newPos = {x:points.topLeft.x + 5, y:points.topLeft.y + 5}
            }
            break;
        case 'bottomLeft':
            pos = {x:pos.x + 5, y: pos.y + 5}
            newWidth = points.topRight.x - pos.x
            newHeight = newWidth / aspectRatio
            if(points.topRight.y + newHeight > pos.y) {
              newPos.x = pos.x - 5
              newPos.y = points.topRight.y + newHeight - 5
            } else {
              newHeight = pos.y - points.topRight.y
              newWidth = newHeight * aspectRatio
              newPos.y = pos.y - 5
              newPos.x = points.topRight.x - newWidth - 5
            }
            if(newPos.x > points.topRight.x - 15) {
              newPos = {x:points.topRight.x - 15, y:points.topRight.y + 5}
            }
            break;
    }
    return newPos
  }

  renderRectNode(i, element) {
    var attrs = {
        stroke:'',
        strokeWidth: 0
    }
    if(this.state.overElement === i){
      attrs = {
          stroke:'black',
          strokeWidth: 1,
          dash: [3, 3]
      }
    }
    return <Rect 
              key={'node_work_' + i} 
              name={'node_work_' + i}
              x={element.getIn(['attrs', 'x'])}
              y={element.getIn(['attrs', 'y'])}
              width={element.getIn(['attrs', 'width'])}
              height={element.getIn(['attrs', 'height'])}
              draggable={"true"}
              {...attrs}
              onClick={this.handleClick.bind(this)}
              onDragEnd={this.onDragEndElement.bind(this)}
              onDragMove={this.onDragMoveElement.bind(this)}
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseOver={() => this.onMouseOver(i)}
              onMouseOut={() => this.onMouseOut(i)}
            />
  }

  renderElements() {
    var renderElements = [];
    this.props.builderState.getCurrentContent().getElements().forEach(function(element, index) {
      if(element.get('className') === "Text" || element.get('className') === "Image") {
        if(this.props.builderState.getSelections().indexOf(index) === -1 && element.getIn(['attrs', 'x']) !== 'undefined' && element.getIn(['attrs', 'y']) !== 'undefined' && element.getIn(['attrs', 'width']) !== 'undefined' && element.getIn(['attrs', 'height']) !== 'undefined'){
          renderElements.push(this.renderRectNode(index, element))
        }
      }
    }.bind(this));
    return renderElements
  }

  renderAnchorNode(attrs, name) {
    return <Rect 
              key={this.node_selection_id + name} 
              name={this.node_selection_id + name} 
              width={10}
              height={10}
              {...attrs}
              stroke={"black"}
              strokeWidth={1}
              fill={'white'}
              draggable={true}
              onDragMove={this.onDragMoveAnchor.bind(this)}
              onMouseDown={this.onMouseDownTouchStartAnchor.bind(this)}
              onTouchStart={this.onMouseDownTouchStartAnchor.bind(this)}
              onDragEnd={this.onDragEndAnchor.bind(this)}
              dragBoundFunc={this.dragBoundFunc.bind(this, name)}
            />
  }

  renderSelections() {
    if(this.props.builderState.getSelections().size > 0){
      this.node_selection_id = 'node_selection_' + Math.random()
      let attrs = {
        x:false,
        y:false,
        bottomLeft:false,
        bottomTop:false
      }
      this.props.builderState.getSelections().forEach(function(index) {
        let element = this.props.builderState.getCurrentContent().getElements().get(index);
        if(element.getIn(['attrs', 'x']) !== 'undefined' && element.getIn(['attrs', 'y']) !== 'undefined' && element.getIn(['attrs', 'width']) !== 'undefined' && element.getIn(['attrs', 'height']) !== 'undefined') {
          let bottomLeft = element.getIn(['attrs', 'x']) + element.getIn(['attrs', 'width'])
          let bottomTop = element.getIn(['attrs', 'y']) + element.getIn(['attrs', 'height'])
          if(!attrs.x || attrs.x > element.getIn(['attrs', 'x'])){
            attrs.x = element.getIn(['attrs', 'x'])
          }
          if(!attrs.y || attrs.y > element.getIn(['attrs', 'y'])){
            attrs.y = element.getIn(['attrs', 'y'])
          }
          if(!attrs.bottomLeft || attrs.bottomLeft < bottomLeft){
            attrs.bottomLeft = bottomLeft
          }
          if(!attrs.bottomTop || attrs.bottomTop < bottomTop){
            attrs.bottomTop = bottomTop
          }
        }
      }.bind(this));

      if(attrs['bottomTop']){
        this.node_selection_position = {
          x: attrs.x,
          y: attrs.y,
          width: attrs.bottomLeft - attrs.x,
          height: attrs.bottomTop - attrs.y
        }
        return <Group 
                  key={this.node_selection_id + "Group"} 
                  name={this.node_selection_id + "Group"}
                >
                <Rect
                  key={this.node_selection_id} 
                  name={this.node_selection_id}
                  x={this.node_selection_position.x}
                  y={this.node_selection_position.y}
                  width={this.node_selection_position.width}
                  height={this.node_selection_position.height}
                  draggable={"true"}
                  stroke={"black"}
                  strokeWidth={1}
                  dash={[3, 3]}
                  onDragEnd={this.onDragEndSelection.bind(this)}
                  onDragMove={this.onDragMoveSelection.bind(this)}
                />
                {this.renderAnchorNode({x: this.node_selection_position.x - 5, y: this.node_selection_position.y - 5}, 'topLeft')}
                {this.renderAnchorNode({x: this.node_selection_position.x + this.node_selection_position.width - 5, y: this.node_selection_position.y - 5}, 'topRight')}
                {this.renderAnchorNode({x: this.node_selection_position.x - 5, y: this.node_selection_position.y + this.node_selection_position.height - 5}, 'bottomLeft')}
                {this.renderAnchorNode({x: this.node_selection_position.x + this.node_selection_position.width - 5, y: this.node_selection_position.y + this.node_selection_position.height - 5}, 'bottomRight')}
              </Group>
      }
    }
  }

  render() {
    return (
      <Layer>
        {this.renderElements()}
        {this.renderSelections()}
      </Layer>
    );
  }

}

export default WorkpadLayer;