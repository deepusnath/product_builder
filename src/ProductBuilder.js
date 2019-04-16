import React, { Component } from 'react';
import { render } from 'react-dom';
import ProductPreview from './component/ProductPreview';
import Workarea from './component/workarea/index';
import TopToolbox from './component/toolbar/TopToolbox';
import BottomToolbox from './component/toolbar/BottomToolbox';
import BuilderState from './model/immutable/BuilderState';
import BuilderModifier from './model/modifier/BuilderModifier';
import BuilderUtils from './model/modifier/BuilderUtils';
import keydown, { Keys } from 'react-keydown';
import {List} from 'immutable';

import './index.css';

class ProductBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipBoard: [],
      builderState: (() => {
        return BuilderState.createEmpty({
          "builderHeight": 640, "builderWidth": 640,
          "width": 500, "height": 800,
          "bleed": [10, 10, 10, 10],
          "safe": [10, 10, 10, 10]
        })
      })()
    };

    this.onChange = function(builderState) {
      this.setState({builderState});      
    }.bind(this);

    this.topToolBoxHandle = {
      "toggleGuideLines": this._toggleGuideLines.bind(this),
      "toggleGridLines": this._toggleGridLines.bind(this),
      "addText": this._addText.bind(this),
      "addImage": this._addImage.bind(this),
      "selectAllElements": this._selectAllElements.bind(this),
      "selectAllNone": this._selectAllNone.bind(this),
      "cutElements": this._cutElements.bind(this),
      "copyElements": this._copyElements.bind(this),
      "pasteElements": this._pasteElements.bind(this),
      "deleteAllElements": this._deleteAllElements.bind(this),
      "redo": this._redo.bind(this),
      "undo": this._undo.bind(this),
    }

    this.workAreaHandle = {
      "onChange": this.onChange,
      "updateElement": this._updateElement.bind(this),
      "updateSelection": this._updateSelection.bind(this),
      "deleteElements": this._deleteElements.bind(this)
    }

    this.bottomToolBoxHandle = {
      "onChange": this.onChange,
      "moveUpSmall": this._moveUpSmall.bind(this),
      "moveRightSmall": this._moveRightSmall.bind(this),
      "moveDownSmall": this._moveDownSmall.bind(this),
      "moveLeftSmall": this._moveLeftSmall.bind(this)
    }

  }

  componentDidMount() {
    this._addText("ddddd")
  }

  render() {
    return (
      <div className="designer-container">
        <div className="row blue-grey lighten-5 mb-3 z-depth-1">
            <div className="col"><TopToolbox builderState={this.state.builderState} handles={this.topToolBoxHandle} clipBoard={this.state.clipBoard}/></div>
        </div>
        <div className="row">
            <div className="preview-container z-depth-1"><ProductPreview/></div>
            <div className="col workarea"><Workarea builderState={this.state.builderState} handles={this.workAreaHandle}/></div>
            <div className="right-tool-bar blue-grey lighten-5 z-depth-1" data-spy="scroll" data-offset="0">test</div>
        </div>
        <div className="row">
            <div className="col"><BottomToolbox builderState={this.state.builderState} handles={this.bottomToolBoxHandle} /></div>
        </div>
      </div>
    );
  }

  @keydown( 'shift+ctrl+z', 'shift+command+z' )
  _redo(){
    this.onChange(
      BuilderState.redo(this.state.builderState)
    )
  }

  @keydown( 'ctrl+z', 'command+z' )
  _undo(){
    this.onChange(
      BuilderState.undo(this.state.builderState)
    )
  }

  _toggleGuideLines() {
    this.onChange(
      BuilderUtils.toggleGuideLines(this.state.builderState)
    )
  }

  _toggleGridLines() {
    this.onChange(
      BuilderUtils.toggleGridLines(this.state.builderState)
    )
  }

  _addText(text) {
    this.onChange(
      BuilderUtils.addElements(
        this.state.builderState,
        BuilderModifier.addText(
          this.state.builderState.getCurrentContent(),
          text
        )
      )
    )
  }

  _addImage(image) {
    this.onChange(
      BuilderUtils.addElements(
        this.state.builderState,
        BuilderModifier.addImage(
          this.state.builderState.getCurrentContent(),
          image
        )
      )
    )
  }

  _updateElement(i, attrs, type) {
    this.onChange(
      BuilderUtils.updateElements(
        this.state.builderState,
        BuilderModifier.updateElement(
          this.state.builderState.getCurrentContent(),
          i,
          attrs
        ),
        type
      )
    )
  }

  _updateSelection(selections) {
    this.onChange(
      BuilderUtils.updateSelection(
        this.state.builderState,
        List(selections)
      )
    )
  }

  @keydown( 'backspace' )
  _deleteElements() {
    var builderState = BuilderUtils.deleteElements(
      this.state.builderState,
      BuilderModifier.deleteElements(
        this.state.builderState.getCurrentContent(),
        this.state.builderState.getSelections().toArray()
      )
    )

    this.onChange(
      BuilderUtils.updateSelection(
        builderState,
        List([])
      )
    )
  }

  _deleteAllElements() {
    var builderState = BuilderUtils.deleteElements(
      this.state.builderState,
      BuilderModifier.deleteElements(
        this.state.builderState.getCurrentContent(),
        Array.apply(null, {length: this.state.builderState.getCurrentContent().getElements().size}).map(Number.call, Number)
      )
    )

    this.onChange(
      BuilderUtils.updateSelection(
        builderState,
        List([])
      )
    )
  }

  _selectAllNone(){
    this.onChange(
      BuilderUtils.updateSelection(
        this.state.builderState,
        List([])
      )
    )
  }

  @keydown( 'ctrl+a', 'command+a' )
  _selectAllElements(event) {
    event.preventDefault()
    this._updateSelection(Array.apply(null, {length: this.state.builderState.getCurrentContent().getElements().size}).map(Number.call, Number))
  }

  @keydown( 'ctrl+c', 'command+c' )
  _copyElements() {
    var clipBoard = []
    if(this.state.builderState.getSelections().size > 0){
      this.state.builderState.getSelections().forEach(function(index) {
        clipBoard.push(this.state.builderState.getCurrentContent().getElements().get(index))
      }.bind(this));
    }
    this._updateClipBoard(clipBoard)
  }

  @keydown( 'ctrl+x' , 'command+x' )
  _cutElements() {
    var clipBoard = []
    if(this.state.builderState.getSelections().size > 0){
      this.state.builderState.getSelections().forEach(function(index) {
        clipBoard.push(this.state.builderState.getCurrentContent().getElements().get(index))
      }.bind(this));
    }
    this._deleteElements()
    this._updateClipBoard(clipBoard)
  }

  @keydown( 'ctrl+v' , 'command+v' )
  _pasteElements() {
    if(this.state.clipBoard.length > 0){
      var selections = []
      var contentState = this.state.builderState.getCurrentContent()
      for (var i = 0; i < this.state.clipBoard.length; i++) {
        contentState = BuilderModifier.copyElement(contentState, this.state.clipBoard[i])
        selections.push(contentState.getElements().size - 1)
      }
      var builderState = BuilderUtils.updateSelection(this.state.builderState, selections)
      this.onChange(
        BuilderUtils.copyElements(
          builderState,
          contentState
        )
      )
    }
  }

  _move(cord, by) {
    if(this.state.builderState.getSelections().size > 0){
      var currentContent = this.state.builderState.getCurrentContent()

      this.state.builderState.getSelections().forEach(function(index) {
        var change = {}
        change[cord] = currentContent.getElements().get(index).getIn(['attrs', cord]) + by
        currentContent = BuilderModifier.updateElement(
          currentContent,
          index,
          change
        )
      }.bind(this));

      this.onChange(
        BuilderUtils.updateElements(
          this.state.builderState,
          currentContent
        )
      )
    }
  }

  @keydown( 'up' )
  _moveUp() {
    this._move('y', -1)
  }

  @keydown( 'down' )
  _moveDown() {
    this._move('y', 1)
  }

  @keydown( 'left' )
  _moveLeft() {
    this._move('x', -1)
  }

  @keydown( 'right' )
  _moveRight() {
    this._move('x', 1)
  }

  @keydown( 'shift+up' )
  _moveUpLarge() {
    this._move('y', -50)
  }

  @keydown( 'shift+down' )
  _moveDownLarge() {
    this._move('y', 50)
  }

  @keydown( 'shift+left' )
  _moveLeftLarge() {
    this._move('x', -50)
  }

  @keydown( 'shift+right' )
  _moveRightLarge() {
    this._move('x', 50)
  }

  @keydown( 'alt+up' )
  _moveUpSmall() {
    this._move('y', -20)
  }

  @keydown( 'alt+down' )
  _moveDownSmall() {
    this._move('y', 20)
  }

  @keydown( 'alt+left' )
  _moveLeftSmall() {
    this._move('x', -20)
  }

  @keydown( 'alt+right' )
  _moveRightSmall() {
    this._move('x', 20)
  }

  _updateClipBoard(clipBoard) {
    this.setState({clipBoard});
  }

}

render(<ProductBuilder />, document.getElementById('root'));