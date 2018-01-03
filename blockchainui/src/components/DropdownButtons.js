import React from 'react';
import { DropdownButton, MenuItem} from 'react-bootstrap';

export default class DropdownButtons extends React.Component {
  constructor(props){
    super(props);

    this.changeActiveOne = this.changeActiveOne.bind(this)
    this.changeActiveTwo = this.changeActiveTwo.bind(this)
    this.state = {
      activeIndex: 0,
      activeText: 'Role'
    }
  }

  changeActiveOne(text){
    this.setState({activeText: text})
  }


  changeActiveTwo(index){
    this.setState({activeIndex: index})
  }

  render () {
    return (
      <div>
        <DropdownButton title={this.state.activeText} className="dropdown" id="bg-nested-dropdown">
          <MenuItem 
            eventKey={1}
            onClick={() => { this.changeActiveOne("All"); this.props.addSearchTerm('');}}
          >
          All
          </MenuItem>
          <MenuItem 
            eventKey={2}
            onClick={() => { this.changeActiveOne("Mentors"); this.props.addSearchTerm('8');}}
          >
            Mentors
          </MenuItem>
          <MenuItem 
            eventKey={3}
            onClick={() => { this.changeActiveOne("Peers"); this.props.addSearchTerm('3');}}
          >
            Peers
          </MenuItem>
        </DropdownButton>
      </div>
    )
  }
}