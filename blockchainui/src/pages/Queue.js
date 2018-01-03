import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';
import SearchBar from '../components/SearchBar';
import CardsList from '../components/CardsList';
import PageLoad from '../components/PageLoad';
import PopUp from '../components/PopUpQueue';

import { Row, Col, Media, Navbar, Nav, NavItem, Button } from 'react-bootstrap';

var url = 'http://127.0.0.1:3000';

class Skills extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.addSearchTerm = this.addSearchTerm.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.state = {
            data: [],
            searchTerm: '',
            showModal: false,
            activeItem: '',
            user: '',
            skill: '',
        }
    }

    async componentWillMount() {
        // axios.get('http://10.1.10.236:3000/api/v1/skills')
        //     .then((response) => {
        //         console.log(response)
        //         console.log(response.data)
        //         this.setState({ data: response.data })
        //     });
        axios.get(url + '/api/v1/queue')
            .then((response) => {
                this.setState({ data: response.data });
                console.log(response.data);
            });
        const user = await window.localStorage.getItem('user');
        const skill = await window.localStorage.getItem('skill');
        this.setState({ user, skill });
        console.log(this.state.user, this.state.skill);
    }

    onChange(event) {
        this.setState({ searchTerm: event.target.value })
    }

    addSearchTerm(text) {
        text !== "Role" ?
            this.setState({ searchTerm: text }) :
            this.setState({ searchTerm: '' })
    }

    close() {
        this.setState({ showModal: false });
    }

    open(index) {
        this.setState({ showModal: true, activeItem: index });
        console.log(this.state.activeItem)
    }

    render() {
        const AllCards = this.state.data
            .filter(item => !item.mentored && item.skill === this.state.skill)
            .map((SingleCard) =>
                <Col md={6} sm={6} xs={12} key={SingleCard.name}>
                    <div className="rounded-card" onClick={() => this.open(SingleCard.skill)}>
                        <Media>
                            <Media.Body>
                                <Media.Heading>Request for help from {SingleCard.person}</Media.Heading>
                                {/* <Media.Heading className="small-head">{SingleCard['demand hours'] === 8 ? "Mentor" : "Peer"}</Media.Heading> */}
                                <div style={{ marginTop: 10 }}>
                                    <Col md={6} xs={6}>
                                        <h5 className="thin">Skill</h5>
                                        <p>{SingleCard.skill}</p>
                                    </Col>
                                    <Col md={6} xs={6}>
                                        <h5 className="thin">Time</h5>
                                        <p>{SingleCard.time}</p>
                                    </Col>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Button style={{ margin: 10, color: 'white', backgroundColor: '#5cb85c', borderRadius: 0 }}>Provide help</Button>
                                    {/* <Button style={{ margin: 10, borderRadius: 0 }} onClick={this.props.close}>Help</Button> */}
                                    {/* <div style={{ textAlign: 'right', padding: '20px' }}>{this.state.status}</div> */}
                                </div>
                            </Media.Body>
                        </Media>
                    </div>
                </Col>
            )

        return (
            <div>
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
                <div className="container card-container">
                    <Row>
                        {this.state.data === [] ? <div /> : AllCards}
                    </Row>

                    {/* {console.log(this.props.data[0])} */}
                    {
                        this.state.data === [] || this.state.data === undefined ?
                            <PageLoad /> :
                            <PopUp
                                showModal={this.state.showModal}
                                close={this.close}
                                user={this.state.user}
                                data={
                                    this.state.data === [] ?
                                        this.state.data[0] :
                                        this.state.data[this.state.data.findIndex(p => p.skill === this.state.activeItem)]
                                }
                            />
                    }
                </div>
            </div>
        )
    }
}

export default Skills;
