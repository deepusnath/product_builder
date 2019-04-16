import React, { Component } from 'react';
import { Layer, Rect, Shape} from 'react-konva';

class OverlayLayer extends Component {
  drawGridOverlay(context) {
    const gridOverlay = this.refs['grid-overlay'];
    var bw = this.props.builderState.getProductDimension().get('width');
    var bh = this.props.builderState.getProductDimension().get('height');
    var t = this.props.builderState.getProductDimension().get('top');
    var l = this.props.builderState.getProductDimension().get('left');
    var x = 0;

    context.beginPath();
    for (x = 30; x <= bw; x += 30) {
        context.moveTo(x + l, t);
        context.lineTo(x + l, bh + t);
    }
    for (x = 30; x <= bh; x += 30) {
        context.moveTo(l, x + t);
        context.lineTo(bw + l, x + t);
    }
    context.closePath();
    if(typeof(gridOverlay) !== 'undefined'){
      context.fillStrokeShape(gridOverlay);
    }

  }

  drawBleedOverlay(context) {
      const bleedOverlay = this.refs['bleed-overlay'];
      context.beginPath();
      context.rect(
        0, 
        0, 
        this.props.builderState.getWidth(), 
        this.props.builderState.getProductDimension().getIn(['bleed', 'top'])
      );
      context.rect(
        this.props.builderState.getProductDimension().getIn(['bleed', 'top']), 
        0, 
        this.props.builderState.getProductDimension().getIn(['bleed', 'left']), 
        this.props.builderState.getHeight()
      );
      context.rect(
        this.props.builderState.getProductDimension().getIn(['bleed', 'left']), 
        this.props.builderState.getProductDimension().getIn(['bleed', 'height']) + this.props.builderState.getProductDimension().getIn(['bleed', 'top']),
        this.props.builderState.getWidth(),
        this.props.builderState.getHeight()
      );
      context.rect(
        this.props.builderState.getProductDimension().getIn(['bleed', 'left']) + this.props.builderState.getProductDimension().getIn(['bleed', 'width']), 
        this.props.builderState.getProductDimension().getIn(['bleed', 'top']),
        this.props.builderState.getWidth(),
        this.props.builderState.getHeight()
      );
      context.closePath();
      if(typeof(bleedOverlay) !== 'undefined'){
        context.fillStrokeShape(bleedOverlay);
      }
  }

  render() {
    var showBleed = true;
    if(
      !this.props.builderState.getShowGuideLines() || (
        this.props.builderState.getProductDimension().getIn(['bleed', 'top']) === 0 &&
        this.props.builderState.getProductDimension().getIn(['bleed', 'right']) === 0 &&
        this.props.builderState.getProductDimension().getIn(['bleed', 'bottom']) === 0 &&
        this.props.builderState.getProductDimension().getIn(['bleed', 'left']) === 0
      )
    ) {
      showBleed = false;
    }

    var showSafe = true;
    if(
      !this.props.builderState.getShowGuideLines() || (
        this.props.builderState.getProductDimension().getIn(['safe', 'top']) === 0 &&
        this.props.builderState.getProductDimension().getIn(['safe', 'right']) === 0 &&
        this.props.builderState.getProductDimension().getIn(['safe', 'bottom']) === 0 &&
        this.props.builderState.getProductDimension().getIn(['safe', 'left']) === 0
      )
    ) {
      showSafe = false;
    }

    return (
      <Layer>
        {this.props.builderState.getShowGuideLines() && <Shape ref="bleed-overlay" x={0} y={0}  sceneFunc={this.drawBleedOverlay.bind(this)} fill={"rgba(0,0,0,0.6)"}/>}
        {showBleed && 
          <Rect 
            x={this.props.builderState.getProductDimension().getIn(['bleed', 'left'])} 
            y={this.props.builderState.getProductDimension().getIn(['bleed', 'top'])} 
            width={this.props.builderState.getProductDimension().getIn(['bleed', 'width'])} 
            height={this.props.builderState.getProductDimension().getIn(['bleed', 'height'])}
            stroke={"red"} 
            strokeWidth={2} />
        }
        {this.props.builderState.getShowGridLines() && <Shape ref="grid-overlay" x={0} y={0}  sceneFunc={this.drawGridOverlay.bind(this)} fill={"rgba(0,0,0,0.6)"} stroke={"black"} dash={[1, 2]}/>}
        {showSafe && 
          <Rect 
            x={this.props.builderState.getProductDimension().getIn(['safe', 'left'])} 
            y={this.props.builderState.getProductDimension().getIn(['safe', 'top'])} 
            width={this.props.builderState.getProductDimension().getIn(['safe', 'width'])} 
            height={this.props.builderState.getProductDimension().getIn(['safe', 'height'])}
            stroke={"green"} 
            strokeWidth={2}
            dash={[10, 10]}
          />
        }
        <Rect 
          x={this.props.builderState.getProductDimension().get('left')} 
          y={this.props.builderState.getProductDimension().get('top')} 
          width={this.props.builderState.getProductDimension().get('width')} 
          height={this.props.builderState.getProductDimension().get('height')} 
          stroke={"blue"} 
          strokeWidth={2} 
        />
      </Layer>
    );
  }

}

export default OverlayLayer;