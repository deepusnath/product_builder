import React, { Component } from 'react';
import { Layer, Text, Image } from 'react-konva';

class PreviewImage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      image: null
    }
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = this.props.src;
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  render() {
    return <Image name={'node' + this.props.i} image={this.state.image} {...this.props.attrs}/>;
  }
}

class PreviewLayer extends Component {

  componentDidUpdate() {
    this.refs["preview-layer"].children.forEach(function(element, index) {
      var currentElement = this.props.builderState.getCurrentContent().getElements().get(index)
      if( currentElement.getIn(['attrs', 'width']) === 'undefined' || 
          currentElement.getIn(['attrs', 'width']) !== element.width() ||
          currentElement.getIn(['attrs', 'height']) === 'undefined' || 
          currentElement.getIn(['attrs', 'height']) !== element.height()
      ) {
        this.props.handles.updateElement(index, {'width': element.width(), 'height': element.height()}, 'no-log')
      }
    }.bind(this));
  }

  renderTextNode(i, element) {
    return <Text key={'node' + i} name={'node' + i} {...element.get('attrs').toObject()} />
  }

  renderElements() {
    var renderElements = [];
    this.props.builderState.getCurrentContent().getElements().forEach(function(element, index) {
      if(element.get('className') === "Text"){
        renderElements.push(this.renderTextNode(index, element))
      } else if(element.get('className') === "Image") {
        renderElements.push(<PreviewImage key={'node' + index} i={index} src={element.get('src')} attrs={element.get('attrs').toObject()} />)
      }
    }.bind(this));
    return renderElements
  }

  render() {
    return (
      <Layer ref="preview-layer" name="preview-layer">
        {this.renderElements()}
      </Layer>
    );
  }

}

export default PreviewLayer;