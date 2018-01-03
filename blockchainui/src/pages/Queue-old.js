import React from 'react';
import { createFilter } from 'react-search-input';
import { Row, Col, Media, Navbar, Nav, NavItem, DropdownButton, MenuItem, Button } from 'react-bootstrap';
import PageLoad from '../components/PageLoad';
import '../styles/cards.css';

import PopUp from '../components/PopUpQueue';

import axios from 'axios';

var url = 'http://127.0.0.1:3000';

export default class CardsList extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.open = this.open.bind(this);

        this.state = {
            data: [],
            users: [],
            activeItem: '',
            showModal: false,
            nameChosen: 'Find your name',
        }
    }

    componentWillMount() {
        axios.get(url + '/api/v1/queue')
            .then((response) => {
                this.setState({ data: response.data });
                console.log(response.data);
            });
        axios.get(url + `/api/v1/users`)
            .then(response => {
                console.log(response);
                this.setState({ users: response.data.users })
                console.log(this.state.users);
            });
    }

    close() {
        this.setState({ showModal: false });
    }


    open(index) {
        this.setState({ showModal: true, activeItem: index });
        console.log(this.state.activeItem)
    }

    setName(e, name) {
        e.preventDefault();
        this.setState({ nameChosen: name });
    }

    render() {
        console.log("cards: " + this.props.data)
        const AllCards = this.state.data
            .filter(item => !item.mentored)
            .map((SingleCard) =>
                <Col md={6} sm={6} xs={12} key={SingleCard.name}>
                    <div className="rounded-card" onClick={() => this.open(SingleCard.name)}>
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
                                    <DropdownButton title={this.state.nameChosen} id={1} className="dropmenu">
                                        {this.state.users.map((name, index) => <MenuItem key={index} onClick={(e) => this.setName(e, name.user)} className="dropitem">{name.user}</MenuItem>)}
                                    </DropdownButton>
                                    <Button style={{ margin: 10, color: 'white', backgroundColor: '#5cb85c', borderRadius: 0 }} onClick={() => this.helpRequest()}>Provide help</Button>
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
                    </Nav>
                </Navbar>
                <div className="container card-container">
                    <Row>
                        {this.state.data === [] ? <PageLoad /> : AllCards}
                    </Row>

                    {/* {console.log(this.props.data[0])} */}
                    {/* {
                        this.state.data === [] || this.state.data === undefined ?
                            <PageLoad /> :
                            <PopUp
                                showModal={this.state.showModal}
                                close={this.close}
                                data={
                                    this.state.data === [] ?
                                        this.state.data[0] :
                                        this.state.data[this.state.data.findIndex(p => p.skill === this.state.activeItem)]
                                }
                            />
                    } */}
                </div>

            </div>
        )
    }
}
