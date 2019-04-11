import React, { Component } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import "./style.css";
import logo from "../../assets/logo.svg";
import api from '../../services/api';

export default class Box extends Component {

  state = {
    box: {}
  }

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const respose = await api.get(`showBox/${box}`);

    this.setState({ box: respose.data });
  };

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://thibasbox-api.herokuapp.com');

    io.emit('connectRoom', box);
    console.log(io);

    io.on('file', data => {
      console.log(data);
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

      data.append('file', file);
      api.post(`boxes/${box}/storeFile`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {
            ({ getRootProps, getInputProps }) =>
              (
                <div className="upload" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Jogue arquivos ou selecione...</p>
                </div>
              )
          }
        </Dropzone>

        <ul>
          {this.state.box.files && this.state.box.files.map(file =>

            <li key={file._id}>
              <a className="fileInfo" href={file.url}>
                <MdInsertDriveFile size={24} color="#fec338" />
                <strong>{file.title} </strong>

                <span> Criado à {distanceInWords(file.createdAt, new Date(), { locale: pt })} </span>
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
