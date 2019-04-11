import React, { Component } from 'react';

import logo from "../../assets/logo.svg";
import api from "../../services/api";
import "./style.css";
//import Routes from '../../routes';

export default class Main extends Component {

  //Toda e qualquer mutação executa o render novamente (nome deve ser sempre state)
  state = {
    newBox: '',
  };

  handleSubmit = async e => {
    e.preventDefault();

    const response = await api.post('storeBoxe', {
      title: this.state.newBox
    });

    this.props.history.push(`/box/${response.data._id}`);
    
  };

  handleInputChange = e => {
    this.setState({ newBox: e.target.value });
  };

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="thibasbox"></img>
          <span id="title-logo">THIBASBOX</span>

          <input placeholder="Novo box" 
            value={this.state.newBox} 
            onChange={this.handleInputChange}/>
          
          <button type="submit">CRIAR</button>
        </form>
      </div>
    );
  }
}
