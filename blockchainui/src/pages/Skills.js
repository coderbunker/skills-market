import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import SearchBar from '../components/SearchBar';
import CardsList from '../components/CardsList';

import { Row, Col, Media, Navbar, Nav, NavItem } from 'react-bootstrap';

var url = 'http://127.0.0.1:3000';

class Skills extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.addSearchTerm = this.addSearchTerm.bind(this);
    this.state = {
      data: [],
      searchTerm: '',
      user: '',
      skill: '',
    }
  }

  async componentWillMount() {
    const user = await window.localStorage.getItem('user');
    const skill = await window.localStorage.getItem('skill');
    if (!user && !skill) {
      window.location.href = "/login";
    }
    this.setState({ user, skill });
    console.log(this.state.user, this.state.skill);
    axios.get(url + '/api/v1/skills')
    .then((response) => {
      console.log(response)
      console.log(response.data)
      this.setState({data: response.data})
    });
    // const user = await window.localStorage.getItem('user');
    // const skill = await window.localStorage.getItem('skill');
    
  }

  onChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  addSearchTerm(text){
    text!=="Role"?
    this.setState({searchTerm: text}):
    this.setState({searchTerm: ''})
  }

  render() {
    console.log(this.state.data)
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">UTSEUS</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="/skills">Skills</NavItem>
            <NavItem eventKey={2} href="/dashboard">Dashboard</NavItem>
            <NavItem eventKey={2} href="/queue">Queue</NavItem>
            <NavItem eventKey={2} href="/queue">| {this.state.user} : {this.state.skill} |</NavItem>
          </Nav>
        </Navbar>
        <h1>Skills</h1>
        {/* <SearchBar data={this.state.data} 
          updateFilter={this.onChange}
          addSearchTerm={this.addSearchTerm}
        /> */}
        <CardsList 
          data={this.state.data} 
          searchTerm={this.state.searchTerm}
          user={this.state.user}
        />
      </div>
    );
  }
}

export default Skills;
