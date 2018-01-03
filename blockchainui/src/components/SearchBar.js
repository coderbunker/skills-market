import React from 'react';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Filters from './Filters';
import '../styles/search.css';

export default class Search extends React.Component {
  render() {
    return (
      <div >
        <div className="container search-container">
        <h1 style={{fontWeight: 400}}>Search for help</h1>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" onChange={this.props.updateFilter.bind(this)}/>
              <InputGroup.Addon style={{cursor: 'pointer'}}>
                <Glyphicon glyph="search" />
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          <Filters 
            data={this.props.data} 
            onChange={this.props.updateFilter} 
            // lowSort={this.props.lowSort}
            // highSort={this.props.highSort}
            addSearchTerm={this.props.addSearchTerm}
          />
        </div>
      </div>
    )
  }
}