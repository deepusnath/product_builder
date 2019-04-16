import React, { Component } from 'react';
import { Button } from 'mdbreact';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
class TopToolbox extends Component {

  constructor(props) {
    super(props);
    this.toggleEdit = this.toggleEdit.bind(this)
    this.state = {
      dropdownOpen: false
    }
  }

  addText() {
    this.props.handles.addText("sdsdsdsdsdsdsdsdsdsdsd")
  }

  addImage() {
    this.props.handles.addImage({
      "src":"http://konvajs.github.io/assets/yoda.jpg",
      "width": 106,
      "height": 118
    })
  }

  toggleEdit() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render() {
    return (
      <div>
        {this.state.clipBoard}
        <Dropdown isOpen = { this.state.dropdownOpen } toggle = { this.toggleEdit } dropup className="float-left">
          <DropdownToggle caret color="primary" size="sm">
            Edit
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#" onClick={this.props.handles.selectAllElements}>Select all</DropdownItem>
            <DropdownItem divider/>
            <DropdownItem href="#" onClick={this.props.handles.selectAllNone} disabled = { this.props.builderState.getSelections().size > 0 ? false : true }>Select none</DropdownItem>
            <DropdownItem href="#" onClick={this.props.handles.cutElements} disabled = { this.props.builderState.getSelections().size > 0 ? false : true }>Cut</DropdownItem>
            <DropdownItem href="#" onClick={this.props.handles.copyElements} disabled = { this.props.builderState.getSelections().size > 0 ? false : true }>Copy</DropdownItem>
            <DropdownItem href="#" onClick={this.props.handles.pasteElements} disabled = { this.props.clipBoard.length > 0 ? false : true }>Paste</DropdownItem>
            <DropdownItem divider/>
            <DropdownItem href="#" onClick={this.props.handles.deleteAllElements}>Clear</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button onClick={this.addText.bind(this)} size="sm" color="primary">Add Text</Button>
        <Button onClick={this.addImage.bind(this)} size="sm" color="primary">Add Image</Button>
        <Button onClick={this.props.handles.toggleGuideLines} size="sm" color={this.props.builderState.getShowGuideLines() ? 'secondary' : 'primary'}>Guide Lines</Button>
        <Button onClick={this.props.handles.toggleGridLines} size="sm" color={this.props.builderState.getShowGridLines() ? 'secondary' : 'primary'}>Grid Lines</Button>
        <Button onClick={this.props.handles.undo} size="sm" color="primary" disabled={this.props.builderState.getUndoStack().size == 0 ? true : false}>Undo</Button>
        <Button onClick={this.props.handles.redo} size="sm" color="primary" disabled={this.props.builderState.getRedoStack().size == 0 ? true : false}>Redo</Button>
      </div>
    )
  }
}

export default TopToolbox;