import React from 'react';
import { Form, FormControl, FormGroup, Radio, Button } from 'react-bootstrap';

export default class RegisterForm extends React.Component {
  constructor(){
    super();
    this.onChange = this.onChange.bind(this)
    this.state = {
      username: ''
    }
  }
  
  onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      })
  }
  render () {
    return (
      <Form 
      horizontal 
      method="post" 
      action={"http://localhost:3000/api/v1/register/"+this.state.username}
    >
      <FormGroup controlId="formHorizontalEmail">
        <FormControl 
          type="name" 
          name="username" 
          placeholder="Choose a username" 
          onChange={e => this.onChange(e)} 
          value={this.state.username}
        />
      </FormGroup>    
      <FormGroup controlId="formHorizontalPassword">
        <FormControl 
          type="password" 
          name="password" 
          placeholder="Choose a password" 
          onChange={e => this.onChange(e)} 
          value={this.state.password}/>
      </FormGroup>
      <FormGroup onChange={event => this.setMentor(event)}>
        <Radio name="mentor" value="mentor" inline>
          Mentor
        </Radio>
        {' '}
        <Radio name="mentor" value="mentee" inline>
          Mentee
        </Radio>
        {' '}
      </FormGroup>
      <FormGroup>
        <Button className="green-button" type="submit">
          Submit
        </Button>
      </FormGroup>
    </Form>
    )
  }
}