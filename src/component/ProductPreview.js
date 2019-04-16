import React, { Component } from 'react';
import { Carousel, CarouselItem, CarouselInner, CarouselControl } from 'mdbreact';

class ProductPreview extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.state = {
      activeItem: 1,
      maxLength: 2
    };
  }

  next() {
    const nextItem = this.state.activeItem + 1;
    if(nextItem > this.state.maxLength) {
      this.setState({ activeItem: 1 });
    } else {
      this.setState({ activeItem: nextItem });
    }
  }

  prev() {
    const prevItem = this.state.activeItem - 1;
    if(prevItem < 1) {
      this.setState({ activeItem: this.state.maxLength });
    } else {
      this.setState({ activeItem: prevItem });
    }
  }

  goToIndex(item) {
    if (this.state.activeItem !== item) {
      this.setState({
        activeItem: item
      });
    }
  }

  render() {
    return (
    	<div className="preview-container">
				<Carousel 
				  activeItem={this.state.activeItem}
				  next={this.next}
				  className="z-depth-1">
				  <CarouselInner>
				    <CarouselItem itemId="1">
				      <div className="view hm-black-light">
				        <img className="d-block w-10 h-10" src="https://www.zazzle.com/rlv/svc/view?realview=113305159362534445&design=5f3b9e55-73a7-4733-82bb-8d72be1b7ba7&rlvnet=1&size=7inch&max_dim=188&cacheDefeat=1522998513418" alt="First slide" />
				        <div className="mask"></div>
				      </div>
				    </CarouselItem>
				    <CarouselItem itemId="2">
				      <div className="view hm-black-light">
				        <img className="d-block w-10 h-10" src="https://www.zazzle.com/rlv/svc/view?realview=113840568075239358&design=5f3b9e55-73a7-4733-82bb-8d72be1b7ba7&rlvnet=1&size=7inch&max_dim=188&cacheDefeat=1522998513418" alt="First slide" />
				        <div className="mask"></div>
				      </div>
				    </CarouselItem>
				  </CarouselInner>
				  <CarouselControl direction="prev" role="button" onClick={() => { this.prev(); }} />
				  <CarouselControl direction="next" role="button" onClick={() => { this.next(); }} />
				</Carousel>
			</div>
    );
  }
}

export default ProductPreview;