import React from 'react';
import { createFilter } from 'react-search-input';
import { Row, Col, Media, Navbar, Nav, NavItem } from 'react-bootstrap';
import PageLoad from '../components/PageLoad';
import '../styles/cards.css';

import axios from 'axios';

var url = 'http://127.0.0.1:3000';

export default class CardsList extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.open = this.open.bind(this);

        this.state = {
            data: [],
        }
    }

    componentWillMount() {
        axios.get(url + '/api/v1/dashboard')
            .then((response) => {
                this.setState({ data: response.data });
                console.log(response.data);
            });
    }

    close() {
        this.setState({ showModal: false });
    }


    open(index) {
        this.setState({ showModal: true, activeItem: index });
        console.log(this.state.activeItem)
    }

    render() {
        console.log("cards: " + this.props.data)
        const AllCards = this.state.data
            .map((SingleCard) =>
                <Col md={6} sm={6} xs={12} key={SingleCard.name}>
                    <div className="rounded-card" onClick={() => this.open(SingleCard.name)}>
                        <Media>
                            <Media.Body>
                                <Media.Heading>{SingleCard.to === "Organisation" ? `Request for help from ${SingleCard.from}` : `Help provided by ${SingleCard.from} to ${SingleCard.to}` }</Media.Heading>
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
                </div>

            </div>
        )
    }
}
