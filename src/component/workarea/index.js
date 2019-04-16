import React, { Component } from 'react';
import { Stage } from 'react-konva';

import OverlayLayer from './OverlayLayer';
import PreviewLayer from './PreviewLayer';
import WorkpadLayer from './WorkpadLayer';

class Workarea extends Component {

  handleClick(context){
    if(this.props.builderState.getSelections().size > 0){
      let node = context.target
      let attrs = node.getAttrs()
      if(typeof(attrs.name) === "undefined" || !attrs.name.includes("node_work_")){
        this.props.handles.updateSelection([])
      }
    }
  }

  render() {
    return (
      <div className="workarea">
        <div className="workarea-container">
          <Stage width={this.props.builderState.getWidth()} height={this.props.builderState.getHeight()} onClick={this.handleClick.bind(this)}>
            <PreviewLayer builderState={this.props.builderState} handles={this.props.handles} />
            <OverlayLayer builderState={this.props.builderState} />
            <WorkpadLayer builderState={this.props.builderState} handles={this.props.handles} />
          </Stage>
        </div>
      </div>
    );
  }

}

export default Workarea;