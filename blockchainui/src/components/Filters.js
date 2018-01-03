import React from 'react';
import DropdownButtons from './DropdownButtons';
import '../styles/filters.css';

export default class Filters extends React.Component {
  render () {
    return (
      <div style={{textAlign: 'left'}}>
        <DropdownButtons 
          addSearchTerm={this.props.addSearchTerm}
        />
      </div>
    )
  }
}