import ContentState from '../immutable/ContentState';
import BuilderState from '../immutable/BuilderState';

var { fromJS, Map, List } = require('immutable');

var BuilderModifier = {

  _uniqueId: function(): string {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  },

  addText: function(
    contentState: ContentState,
    text: string,
  ): ContentState {
    var elements = contentState.getElements().push(fromJS({
      "id": BuilderModifier._uniqueId(),
      "attrs":{  
        "x":300,
        "y":300,
        "text":text,
        "fontSize":18,
        "fontFamily":"Calibri",
        "fill":"#555",
        "padding":2,
        "align":"center"
      },
      "className":"Text"
    }))
    return contentState.merge({
        'elements': elements
    })
  },

  addImage: function(
    contentState: ContentState,
    image: object,
  ): ContentState {
    var elements = contentState.getElements().push(fromJS({
      "id": BuilderModifier._uniqueId(),
      "attrs":{  
        "x":300,
        "y":300,
        "width":image.width,
        "height":image.height
      },
      "className":"Image",
      "src": image.src
    }))
    return contentState.merge({
        'elements': elements
    })
  },

  copyElement: function(
    contentState: ContentState,
    element: Map,
  ): ContentState {
    var newElement = element.setIn(['id'], BuilderModifier._uniqueId())
    newElement = newElement.setIn(['attrs', 'x'], newElement.getIn(['attrs', 'x']) + 5)
    newElement = newElement.setIn(['attrs', 'y'], newElement.getIn(['attrs', 'y']) + 5)
    var elements = contentState.getElements().push(newElement)
    return contentState.merge({
        'elements': elements
    })
  },

  updateElement: function(
    contentState: ContentState,
    index: int,
    changes: object,
  ): ContentState {
    var currentElements = contentState.getElements()
    var currentElement = currentElements.get(index)
    for (var key in changes) {
      currentElement = currentElement.setIn(['attrs', key], changes[key])
    }

    currentElements = currentElements.set(index, currentElement)
    return contentState.merge({
        'elements': currentElements
    })
  },

  deleteElements: function(
    contentState: ContentState,
    indexes: array,
  ): ContentState {
    return contentState.merge({
      'elements': contentState.getElements().filter(function(value, key) {
        return indexes.indexOf(key) < 0;
      })
    })
  },

  getSelectionDimenstion: function(
    contentState: ContentState,
    selections: List,
  ): object {
    let attrs = {
      x:false,
      y:false,
      bottomLeft:false,
      bottomTop:false
    }
    selections.forEach(function(index) {
      let element = contentState.getElements().get(index);
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
    });
    return {
      x: attrs.x,
      y: attrs.y,
      width: attrs.bottomLeft - attrs.x,
      height: attrs.bottomTop - attrs.y
    }
  },

  positionElements: function(
    contentState: ContentState,
    builderState: BuilderState,
    where: string
  ): ContentState {
    var selection_position = BuilderModifier.getSelectionDimenstion(
      contentState,
      builderState.getSelections()
    )
    var new_selection_position = {
      x:selection_position.x,
      y:selection_position.y
    }
    switch (where) {
      case 'topleft':
        new_selection_position.x = builderState.getProductDimension().get('left')
        new_selection_position.y = builderState.getProductDimension().get('top')
        break;
      case 'topcenter':
        new_selection_position.x = builderState.getProductDimension().get('left') + ((builderState.getProductDimension().get('width') - selection_position.width) / 2)
        new_selection_position.y = builderState.getProductDimension().get('top')
        break;
      case 'topright':
        new_selection_position.x = builderState.getProductDimension().get('left') + builderState.getProductDimension().get('width') - selection_position.width
        new_selection_position.y = builderState.getProductDimension().get('top')
        break;
      case 'rightcenter':
        new_selection_position.x = builderState.getProductDimension().get('left') + builderState.getProductDimension().get('width') - selection_position.width
        new_selection_position.y = builderState.getProductDimension().get('top') + ((builderState.getProductDimension().get('height') - selection_position.height) / 2)
        break;
      case 'bottomright':
        new_selection_position.x = builderState.getProductDimension().get('left') + builderState.getProductDimension().get('width') - selection_position.width
        new_selection_position.y = builderState.getProductDimension().get('top') + builderState.getProductDimension().get('height') - selection_position.height
        break;
      case 'bottomcenter':
        new_selection_position.x = builderState.getProductDimension().get('left') + ((builderState.getProductDimension().get('width') - selection_position.width) / 2)
        new_selection_position.y = builderState.getProductDimension().get('top') + builderState.getProductDimension().get('height') - selection_position.height
        break;
      case 'bottomleft':
        new_selection_position.x = builderState.getProductDimension().get('left')
        new_selection_position.y = new_selection_position.y = builderState.getProductDimension().get('top') + builderState.getProductDimension().get('height') - selection_position.height
        break;
      case 'leftcenter':
        new_selection_position.x = builderState.getProductDimension().get('left')
        new_selection_position.y = builderState.getProductDimension().get('top') + ((builderState.getProductDimension().get('height') - selection_position.height) / 2)
        break;
      case 'movecenter':
        new_selection_position.x = builderState.getProductDimension().get('left') + ((builderState.getProductDimension().get('width') - selection_position.width) / 2)
        new_selection_position.y = builderState.getProductDimension().get('top') + ((builderState.getProductDimension().get('height') - selection_position.height) / 2)
        break;
    }
    builderState.getSelections().forEach(function(index) {
      var currentElement = contentState.getElements().get(index)
      contentState = BuilderModifier.updateElement(
        contentState,
        index,
        {
          x: currentElement.getIn(['attrs', 'x']) + new_selection_position.x - selection_position.x,
          y: currentElement.getIn(['attrs', 'y']) + new_selection_position.y - selection_position.y
        }
      )
    });
    return contentState
  },

  scaleSelections: function(
    contentState: ContentState,
    builderState: BuilderState,
    by: int
  ): ContentState {
    var selection_position = BuilderModifier.getSelectionDimenstion(contentState, builderState.getSelections())
    var new_selection_position = {
      x:selection_position.x - by / 2,
      y:selection_position.y - by / 2,
      width: selection_position.width + by,
      height:selection_position.height + by
    }
    var deviation = (new_selection_position.width / selection_position.width)
    builderState.getSelections().forEach(function(index) {
      var currentElement = contentState.getElements().get(index)
      var delta = {
          x: ((currentElement.getIn(['attrs', 'x']) - selection_position.x) * deviation), 
          y: ((currentElement.getIn(['attrs', 'y']) - selection_position.y) * deviation)
      }
      var change = {
        "width": deviation * currentElement.getIn(['attrs', 'width']),
        "height": (currentElement.getIn(['attrs', 'height']) / currentElement.getIn(['attrs', 'width'])) * deviation * currentElement.getIn(['attrs', 'width']),
        "x": new_selection_position.x + delta.x,
        "y": new_selection_position.y + delta.y
      }
      if(currentElement.get('className') == "Text"){
        change.fontSize = deviation * currentElement.getIn(['attrs', 'fontSize'])
      }
      contentState = BuilderModifier.updateElement(
        contentState,
        index,
        change
      )
    });
    return contentState
  },

  alignSelections: function(
    contentState: ContentState,
    builderState: BuilderState,
    position: string
  ): ContentState {
    var selection_position = BuilderModifier.getSelectionDimenstion(contentState, builderState.getSelections())
    builderState.getSelections().forEach(function(index) {
      var currentElement = contentState.getElements().get(index)
      var change = {}
      switch (position) {
        case 'left':
          change = {
            x: selection_position.x,
            y: currentElement.getIn(['attrs', 'y'])
          }
          break;
        case 'center':
          change = {
            x: selection_position.x + ((selection_position.width - currentElement.getIn(['attrs', 'width'])) / 2 ),
            y: currentElement.getIn(['attrs', 'y'])
          }
          break;
        case 'right':
          change = {
            x: selection_position.x + (selection_position.width - currentElement.getIn(['attrs', 'width'])),
            y: currentElement.getIn(['attrs', 'y'])
          }
          break;
        case 'top':
          change = {
            x: currentElement.getIn(['attrs', 'x']),
            y: selection_position.y
          }
          break;
        case 'middle':
          change = {
            x: currentElement.getIn(['attrs', 'x']),
            y: selection_position.y + ((selection_position.height - currentElement.getIn(['attrs', 'height'])) / 2 )
          }
          break;
        case 'bottom':
          change = {
            x: currentElement.getIn(['attrs', 'x']),
            y: selection_position.y + (selection_position.height - currentElement.getIn(['attrs', 'height'])),
          }
          break;
      }
      contentState = BuilderModifier.updateElement(
        contentState,
        index,
        change
      )
    });
    return contentState
  },

  spaceSelections: function(
    contentState: ContentState,
    builderState: BuilderState,
    orientation: string
  ): ContentState {
    var selection_position = BuilderModifier.getSelectionDimenstion(contentState, builderState.getSelections())
    var sortedSelections = builderState.getSelections().sort((a, b) => {
      a = contentState.getElements().get(a)
      b = contentState.getElements().get(b)
      if (a.getIn(['attrs', orientation == 'horizonatal' ? 'x' : 'y']) < b.getIn(['attrs', orientation == 'horizonatal' ? 'x' : 'y'])) { return -1; }
      if (a.getIn(['attrs', orientation == 'horizonatal' ? 'x' : 'y']) > b.getIn(['attrs', orientation == 'horizonatal' ? 'x' : 'y'])) { return 1; }
      if (a.getIn(['attrs', orientation == 'horizonatal' ? 'x' : 'y']) === b.getIn(['attrs', orientation == 'horizonatal' ? 'x' : 'y'])) { return 0; }
    });
    var fromOrgin = 0
    sortedSelections.forEach(function(index, key) {
      if(key != 0 && key != sortedSelections.size - 1) {
        var currentElement = contentState.getElements().get(index)
        var change = {}
        switch (orientation) {
          case 'horizonatal':
            change = {
              x: selection_position.x + fromOrgin,
              y: currentElement.getIn(['attrs', 'y'])
            }
            fromOrgin = fromOrgin + (selection_position.width / sortedSelections.size)
            break;
          case 'vertical':
            change = {
              x: currentElement.getIn(['attrs', 'x']),
              y: selection_position.y + fromOrgin,
            }
            fromOrgin = fromOrgin + (selection_position.height / sortedSelections.size)
            break;
        }
        contentState = BuilderModifier.updateElement(
          contentState,
          index,
          change
        )
      } else {
        switch (orientation) {
          case 'horizonatal':
            fromOrgin = fromOrgin + (selection_position.width / sortedSelections.size)
            break;
          case 'vertical':
            fromOrgin = fromOrgin + (selection_position.height / sortedSelections.size)
            break;
        }
      }
    });

    return contentState
  },
  
}

module.exports = BuilderModifier;