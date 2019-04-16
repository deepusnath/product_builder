import ContentState from '../immutable/ContentState';
import BuilderState from '../immutable/BuilderState';
import {List} from 'immutable';

var BuilderUtils = {
  toggleGuideLines: function(
    builderState: BuilderState
  ): BuilderState {
    return BuilderState.set(builderState, {
      showGuideLines: !builderState.getShowGuideLines(),
    });
  },

  toggleGridLines: function(
    builderState: BuilderState
  ): BuilderState {
    return BuilderState.set(builderState, {
      showGridLines: !builderState.getShowGridLines(),
    });
  },

  updateSelection: function(
    builderState: BuilderState,
    indexes: array,
  ): BuilderState {
    return BuilderState.set(builderState, {
      selections: List(indexes),
    });
  },

  getSelectionType: function(
    builderState: BuilderState
  ): string {
    if(builderState.getSelections().size > 0){
      var types = {}
      builderState.getSelections().forEach(function(index) {
        var className = builderState.getCurrentContent().getElements().get(index).get('className')
        types[className] = Object.keys(types).indexOf(className) == -1 ? 1 : types[className] + 1
      });
      if(Object.keys(types).length > 1) {
        return "Mixed"
      } else {
        var type = Object.keys(types)[0]
        return type + (types[type] > 1 ? "-Multiple" : "")
      }
    }
  },

  addElements: function(
    builderState: BuilderState,
    contentState: ContentState,
  ): BuilderState {
    builderState = BuilderUtils.updateSelection(
      builderState,
      [contentState.getElements().size - 1]
    )

    return BuilderState.push(
      builderState,
      contentState,
      'add-elements'
    )
  },

  updateElements: function(
    builderState: BuilderState,
    contentState: ContentState,
    changeType: string
  ): BuilderState {
    return BuilderState.push(
      builderState,
      contentState,
      typeof(changeType) == 'undefined' ? 'update-elements' : changeType
    )
  },

  copyElements: function(
    builderState: BuilderState,
    contentState: ContentState,
  ): BuilderState {
    return BuilderState.push(
      builderState,
      contentState,
      'copy-elements'
    )
  },

  deleteElements: function(
    builderState: BuilderState,
    contentState: ContentState,
  ): BuilderState {
    return BuilderState.push(
      builderState,
      contentState,
      'delete-elements'
    )
  },

}

module.exports = BuilderUtils;