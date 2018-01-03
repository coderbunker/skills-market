import React from 'react';
import  {createFilter} from 'react-search-input';
import { Row, Col, Media } from 'react-bootstrap';
import PopUp from './PopUp';
import PageLoad from './PageLoad';
import '../styles/cards.css';

const KEYS_TO_FILTERS = ['name', 'demand hours']

export default class CardsList extends React.Component {
  constructor(props){
    super(props);

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

    this.state = {
      showModal: false,
      activeItem: ''
    }
  }

  close() {
    this.setState({ showModal: false });
  }

  open(index) {
    this.setState({ showModal: true, activeItem: index});
    console.log(this.state.activeItem)
  }

  render() {
    console.log("cards: " + this.props.data)
    const AllCards = this.props.data
    .filter(createFilter(this.props.searchTerm, KEYS_TO_FILTERS))
    .map((SingleCard) => 
      <Col md={6} sm={6} xs={12} key={SingleCard.name}>
        <div className="rounded-card" onClick={() => this.open(SingleCard.skill)}>
          <Media>
            <Media.Body>
              <Media.Heading>{SingleCard.skill}</Media.Heading>
              {/* <Media.Heading className="small-head">{SingleCard['demand hours']===8?"Mentor": "Peer"}</Media.Heading> */}
              <div style={{marginTop: 10}}>
                <Col md={6} xs={6}>
                  <h5 className="thin">Available Hours</h5>
                  <p>{1}</p>
                </Col>
                <Col md={6} xs={6}>
                  <h5 className="thin">Hourly Rate</h5>
                  <p>{3}</p>
                </Col>
              </div>
            </Media.Body>
          </Media>
        </div>
      </Col>
    )

    return (
      <div className="container card-container">
        <Row>
          {this.props.data===[]? <div />: AllCards}
        </Row>

        {/* {console.log(this.props.data[0])} */}
        {
          this.props.data===[] || this.props.data===undefined? 
          <PageLoad />: 
          <PopUp
            showModal={this.state.showModal} 
            close={this.close}
            user={this.props.user}
            data={
              this.props.data===[]?
              this.props.data[0]:
              this.props.data[this.props.data.findIndex(p => p.skill === this.state.activeItem)]
            }
          />
        }
      </div>
    )
  }
}