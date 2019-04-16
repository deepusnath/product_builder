var Immutable = require('immutable');
var ContentState = require('./ContentState.js');
var BuilderChangeType = require('./BuilderChangeType.js');
var {Record, List, Stack, fromJS} = Immutable;

var defaultRecord = {
  lastChangeType: null,
  currentContent: null,
  showGuideLines: true,
  showGridLines: true,
  selections: List(),
  redoStack: Stack(),
  undoStack: Stack(),
  width:640,
  height:640,
  product_dimension: fromJS({
    "width": 500, "height": 500, "left": 0, "top": 0,
    "bleed": {
      "left":0,
      "top":0,
      "width": 0,
      "height": 0,
      "position": [0, 0, 0, 0]
    },
    "safe": {
      "left":0,
      "top":0,
      "width": 0,
      "height": 0,
      "position": [0, 0, 0, 0]
    }
  })
};

var BuilderStateRecord = Record(defaultRecord);

class BuilderState {
  _immutable: BuilderStateRecord;

  constructor(immutable: BuilderStateRecord) {
    this._immutable = immutable;
  }

  getImmutable(): BuilderStateRecord {
    return this._immutable;
  }

  getWidth(): ContentState {
    return this.getImmutable().get('width');
  }

  getHeight(): ContentState {
    return this.getImmutable().get('height');
  }

  getProductDimension(): ContentState {
    return this.getImmutable().get('product_dimension');
  }

  getCurrentContent(): ContentState {
    return this.getImmutable().get('currentContent');
  }

  getShowGuideLines(): boolean {
    return this.getImmutable().get('showGuideLines');
  }

  getShowGuideLines(): boolean {
    return this.getImmutable().get('showGuideLines');
  }

  getShowGridLines(): boolean {
    return this.getImmutable().get('showGridLines');
  }

  getSelections(): List {
    return this.getImmutable().get('selections');
  }

  getUndoStack(): Stack<ContentState> {
    return this.getImmutable().get('undoStack');
  }

  getRedoStack(): Stack<ContentState> {
    return this.getImmutable().get('redoStack');
  }

  static set(builderState: BuilderState, put: object): BuilderState {
    var map = builderState.getImmutable().withMutations(state => {
      state.merge(put);
    });
    return new BuilderState(map);
  }

  static push(
    builderState: BuilderState,
    contentState: ContentState,
    changeType: BuilderChangeType,
  ): BuilderState {
    var selections = builderState.getSelections();
    var currentContent = builderState.getCurrentContent();
    var undoStack = builderState.getUndoStack();
    var newContent = contentState;

    if(changeType != 'no-log')
      undoStack = undoStack.push(currentContent);

    var builderStateChanges = {
      currentContent: newContent,
      undoStack,
      redoStack: Stack(),
      lastChangeType: changeType,
      selections: selections
    };

    return BuilderState.set(builderState, builderStateChanges);
  }

  static undo(builderState: BuilderState): BuilderState {
    var undoStack = builderState.getUndoStack();
    var newCurrentContent = undoStack.peek();
    if (!newCurrentContent) {
      return builderState;
    }

    var currentContent = builderState.getCurrentContent();

    return BuilderState.set(builderState, {
      currentContent: newCurrentContent,
      undoStack: undoStack.shift(),
      redoStack: builderState.getRedoStack().push(currentContent),
      lastChangeType: 'undo',
      selections: List([]),
    });
  }

  static redo(builderState: BuilderState): BuilderState {
    var redoStack = builderState.getRedoStack();
    var newCurrentContent = redoStack.peek();
    if (!newCurrentContent) {
      return builderState;
    }

    var currentContent = builderState.getCurrentContent();
    return BuilderState.set(builderState, {
      currentContent: newCurrentContent,
      undoStack: builderState.getUndoStack().push(currentContent),
      redoStack: redoStack.shift(),
      lastChangeType: 'redo',
      selections: List([]),
    });
  }

  static getDimensionFromDetails(details: object): object {
    var product_dimension = {}
    if(details.width + details.bleed[1] + details.bleed[3] > details.height + details.bleed[0] + details.bleed[2]) {
      product_dimension.width = details.builderWidth - details.bleed[1] - details.bleed[3]
      product_dimension.height = (details.height/details.width) * product_dimension.width
    } else {
      product_dimension.height = details.builderHeight - details.bleed[1] - details.bleed[2]
      product_dimension.width = (details.width/details.height) * product_dimension.height
    }
    product_dimension.left = (details.builderWidth - product_dimension.width) / 2
    product_dimension.top = (details.builderHeight - product_dimension.height) / 2
    product_dimension.bleed = {
      "position": details.bleed,
      "left": product_dimension.left - details.bleed[3],
      "top": product_dimension.top - details.bleed[0],
      "width":  product_dimension.width + details.bleed[1] + details.bleed[3],
      "height": product_dimension.height + details.bleed[0] + details.bleed[2]
    }
    product_dimension.safe = {
      "position": details.safe,
      "left": product_dimension.left + details.safe[3],
      "top": product_dimension.top + details.safe[0],
      "width":  product_dimension.width - details.safe[1] - details.safe[3],
      "height": product_dimension.height - details.safe[0] - details.safe[2]
    }

    return product_dimension
  }

  static createEmpty(details: object): BuilderState {
    defaultRecord.product_dimension = fromJS(BuilderState.getDimensionFromDetails(details))
    defaultRecord.width = details.builderWidth
    defaultRecord.height = details.builderHeight
    defaultRecord.currentContent = ContentState.createEmpty()
    return new BuilderState(new BuilderStateRecord(defaultRecord));
  }

}

module.exports = BuilderState;