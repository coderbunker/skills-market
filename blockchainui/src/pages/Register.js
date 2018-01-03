import React from 'react';
import { Col, Button, ButtonToolbar } from 'react-bootstrap';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

import '../styles/register.css';

export default class Register extends React.Component {
  constructor(){
    super();
    this.changeActive=this.changeActive.bind(this);
    this.state = {
      activeButton: 0
    }
  }


  changeActive(num){
    this.setState({
      activeButton: 1
    })
  }

  render () {
    return (
      <div style={{height:'100vh'}}>
        <Col smOffset={3} sm={6}>
          <div className="no-highlight" style={{padding: 30, marginTop: '20vh'}}>
            {/* <ButtonToolbar style={{marginTop: 10, marginBottom: 40}}>
              {/* <Button 
                bsStyle="primary" 
                bsSize="large" 
                style={this.state.activeButton===0? styles.active: styles.inactive} 
                active
                onClick={() => this.changeActive(0)}
              >
                Register
              </Button> */}
              {/* <Button 
                bsStyle="primary"
                bsSize="large" 
                active 
                style={styles.active}
                onClick={() => this.changeActive(1)}
              >
                Login
              </Button>
            </ButtonToolbar> */}
              <LoginForm />

          </div>
        </Col>
      </div>
    )
  }
}

const styles = {
  active: {
    border: 'none',
    backgroundColor: '#5cb85c',
    color: 'white'
  },
  inactive: {
    border: 'none',
    backgroundColor: 'Transparent',
    color: '#5cb85c',
    borderShadow: 'none'
  }
}