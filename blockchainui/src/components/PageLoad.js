import React from 'react';
import loader from '../assets/loader.gif';

export default class PageLoad extends React.Component {
  render (){
    return (
      <img src={loader} alt="loader"/>
    )
  }
}

