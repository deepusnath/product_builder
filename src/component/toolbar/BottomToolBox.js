import React, { Component } from 'react';
import { Button, Popover, PopoverBody, PopoverHeader } from 'mdbreact';
import BuilderUtils from '../../model/modifier/BuilderUtils';
import BuilderModifier from '../../model/modifier/BuilderModifier';

class BottomToolbox extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  positionSelection(where) {
    if(this.props.builderState.getSelections().size > 0) {
      this.props.handles.onChange(
        BuilderUtils.updateElements(
          this.props.builderState,
          BuilderModifier.positionElements(
            this.props.builderState.getCurrentContent(),
            this.props.builderState,
            where
          )
        )
      )
    }
  }

  scaleSelections(by) {
    if(this.props.builderState.getSelections().size > 0) {
      this.props.handles.onChange(
        BuilderUtils.updateElements(
          this.props.builderState,
          BuilderModifier.scaleSelections(
            this.props.builderState.getCurrentContent(),
            this.props.builderState,
            by
          )
        )
      )
    }
  }

  alignSelections(position) {
    if(this.props.builderState.getSelections().size > 0) {
      this.props.handles.onChange(
        BuilderUtils.updateElements(
          this.props.builderState,
          BuilderModifier.alignSelections(
            this.props.builderState.getCurrentContent(),
            this.props.builderState,
            position
          )
        )
      )
    }
  }

  spaceSelections(orientation) {
    if(this.props.builderState.getSelections().size > 0) {
      this.props.handles.onChange(
        BuilderUtils.updateElements(
          this.props.builderState,
          BuilderModifier.spaceSelections(
            this.props.builderState.getCurrentContent(),
            this.props.builderState,
            orientation
          )
        )
      )
    }
  }

  render() {
    if(this.props.builderState.getSelections().size > 0) {
      var toolboxType = BuilderUtils.getSelectionType(this.props.builderState)
      return (
        <center>
          <div className="bottom-tool-box">
            <div className="position-tool">
              <a className="material-icons topleft" onClick={this.positionSelection.bind(this, 'topleft')}>call_made</a>
              <a className="material-icons topcenter" onClick={this.positionSelection.bind(this, 'topcenter')}>call_made</a>
              <a className="material-icons topright" onClick={this.positionSelection.bind(this, 'topright')}>call_made</a>
              <a className="material-icons rightcenter" onClick={this.positionSelection.bind(this, 'rightcenter')}>call_made</a>
              <a className="material-icons bottomright" onClick={this.positionSelection.bind(this, 'bottomright')}>call_made</a>
              <a className="material-icons bottomcenter" onClick={this.positionSelection.bind(this, 'bottomcenter')}>call_made</a>
              <a className="material-icons bottomleft" onClick={this.positionSelection.bind(this, 'bottomleft')}>call_made</a>
              <a className="material-icons leftcenter" onClick={this.positionSelection.bind(this, 'leftcenter')}>call_made</a>
              <a className="material-icons movecenter" onClick={this.positionSelection.bind(this, 'movecenter')}>center_focus_strong</a>
              <a className="material-icons movetop" onClick={this.props.handles.moveUpSmall}>arrow_drop_up</a>
              <a className="material-icons moveright" onClick={this.props.handles.moveRightSmall}>arrow_drop_up</a>
              <a className="material-icons movebottom" onClick={this.props.handles.moveDownSmall}>arrow_drop_down</a>
              <a className="material-icons moveleft" onClick={this.props.handles.moveLeftSmall}>arrow_drop_down</a>
            </div>
            <div className="scale-tool">
              <div>Scale</div>
              <div><a className="material-icons" onClick={this.scaleSelections.bind(this, 10)}>add</a></div>
              <div><a className="material-icons" onClick={this.scaleSelections.bind(this, -10)}>remove</a></div>
            </div>
            <div className="common-tools">
              <div className="space-layer-tools">
                <div>Space Evenly</div>
                <div>
                  <a className="material-icons horizonatal" onClick={this.spaceSelections.bind(this, 'horizonatal')}>format_line_spacing</a>
                  <a className="material-icons vertical" onClick={this.spaceSelections.bind(this, 'vertical')}>format_line_spacing</a>
                </div>
              </div>
              <div className="align-layer-tools">
                <div>Align Layers</div>
                <div>
                  <a className="material-icons" onClick={this.alignSelections.bind(this, 'left')}>format_align_left</a>
                  <a className="material-icons" onClick={this.alignSelections.bind(this, 'center')}>format_align_center</a>
                  <a className="material-icons" onClick={this.alignSelections.bind(this, 'right')}>format_align_right</a>
                  <a className="material-icons align-top" onClick={this.alignSelections.bind(this, 'top')}>format_align_left</a>
                  <a className="material-icons align-middle" onClick={this.alignSelections.bind(this, 'middle')}>format_align_center</a>
                  <a className="material-icons align-bottom" onClick={this.alignSelections.bind(this, 'bottom')}>format_align_right</a>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </center>
      )
    }
    return ""
  }
}

export default BottomToolbox;