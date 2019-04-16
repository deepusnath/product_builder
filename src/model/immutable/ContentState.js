var {Record, List} = require('immutable');

var defaultRecord = {
  elements: List()
};

var ContentStateRecord = Record(defaultRecord);

class ContentState extends ContentStateRecord {

  getElements(): List {
    return this.get('elements');
  }

  static createEmpty(): ContentState {
    return new ContentState(defaultRecord);
  }

}

module.exports = ContentState;
