import React, { Component } from 'react';

import FilesView from './filesView.component';

class FilesContainer extends Component {
  componentDidMount() {
    this.props.actions.onShowModal();
  }

  render() {
    return (
      <FilesView
        actions={this.props.actions}
        appState={this.props.appState}
      />
    );
  }
}

export default FilesContainer;