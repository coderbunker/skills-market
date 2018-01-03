import React from 'react';
import { Modal, Button, Media, Col, DropdownButton, MenuItem } from 'react-bootstrap';

import axios from 'axios';

const host = 'http://10.1.2.186:3000/api/v1';

export default class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameChosen: 'Choose your name',
      status: '',
      users: [],
      user: this.props.user,
    }
    this.setName = this.setName.bind(this);
  }

  componentWillMount() {
    axios.get(`${host}/users`)
      .then(response => {
        console.log(response);
        this.setState({ users: response.data.users })
      });
  }


  helpRequest() {
    console.log(this.props.data);
    const url = `${host}/help/${this.props.user}/${this.props.data.skill}/10`;
    console.log(this.props.data.skill);
    axios.post(url)
      .then((response) => {
        console.log(response);
        this.setState({ status: `Thanks ${this.props.user}, you ${response.data}` });
      });
  }

  setName(e, name) {
    e.preventDefault();
    this.setState({ nameChosen: name });
  }



  render() {
    console.log(this.props.data==="undefined"? "waiting": this.props.data)
    return (
      <Modal show={this.props.showModal} onHide={this.props.close} className="modal-dialog">
        <Modal.Body>
          <Media>
            <Media.Body>
              <Media.Heading className="text-center" style={{marginTop: 15}}>{this.props.data===undefined?'': this.props.data.skill}</Media.Heading> 
              {/* <Media.Heading className="small-head text-center">
                {this.props.data===undefined?'': 
                this.props.data['demand hours']===8? "Mentor": "Peer"}
              </Media.Heading> */}
              <Col md={6} xs={6}>
                <div className="text-center">
                  <h5 className="thin">Available Hours</h5>
                  <p>3</p>
                </div>
              </Col>
              <Col md={6} xs={6}>
                <div className="text-center">
                <h5 className="thin">Hourly Rate</h5>
                <p>3</p>
                </div>
              </Col>
            </Media.Body>
          </Media>
          
        </Modal.Body>
          <div style={{textAlign: 'right'}}>
            {/* <DropdownButton title={this.state.nameChosen} id={1}>
            {this.state.users.map((name, index) => <MenuItem key={index} onClick={(e) => this.setName(e, name.user)}>{name.user}</MenuItem>)}
            </DropdownButton> */}
            <Button style={{margin: 10, color: 'white', backgroundColor: '#5cb85c', borderRadius: 0}} onClick={() => this.helpRequest()}>Ask for help</Button>
            <Button style={{margin: 10, borderRadius: 0}} onClick={this.props.close}>Close</Button>
            <div style={{textAlign: 'right', padding: '20px'}}>{this.state.status}</div>
          </div>
      </Modal>
    )
  }
}
