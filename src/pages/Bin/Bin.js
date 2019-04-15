import React, { Component } from 'react';
import history from '../../utils/history.js';
import axios from 'axios';
import Editor from './Editor.js';
import './Bin.scss';

export default class Bin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: history.location.pathname.substr(history.location.pathname.lastIndexOf('/') + 1),
      name: 'New Bin',
      html: '',
      css: '',
      js: '',
      target: 'html',
      scrollTop: 0,
      width: window.innerWidth > 768 ? window.innerWidth / 2 : window.innerWidth,
      dragging: false,
      errMsg: ''
    };
    this.editorTextarea = React.createRef();
  }

  changeTab(tab) {
    this.setState({target: tab});
  }

  handleSave() {
    const { _id, name, html, css, js } = this.state;
    if (this.state._id === 'new' && !this.props.user.username) {
      this.props.set({ anonBin: { _id, name, html, css, js }});
      history.push('/signin?save=true&redirect=/bin/' + _id);
    } else {
      axios.put('/api/bin', { _id, name, html, css, js  })
      .then((res) => {
        if (this.state._id === 'new') {
          this.setState({ _id: res.data._id }, () => {
            history.push('/bin/' + res.data._id);
            this.refreshIframe();
          });
        } else {
          this.refreshIframe();
        }
      })
      .catch((err) => {
        alert(err);
      });
    }

  }

  refreshIframe() {
    let iframe = document.getElementById('editor-iframe');
    iframe.src = iframe.src;
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleKeyDown(e) {
    const keyCode = e.keyCode || e.which;

    if (keyCode === 9) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      let target = this.state[this.state.target];
      target = target.substr(0, start) + '  ' + target.substr(end);
      this.setState({ [this.state.target]: target}, () => {
        this.editorTextarea.current.selectionStart = start + 2;
        this.editorTextarea.current.selectionEnd = start + 2;
      });
    }
  }

  handleScroll(e) {
    this.setState({ scrollTop: e.target.scrollTop });
  }

  set(obj, cb) {
    this.setState(obj, cb);
  }

  componentDidMount() {
    const _id = this.state._id;
    axios.get('/api/bin/' + _id)
      .then((res) => {
        const { name, html, css, js } = res.data;
        this.setState({ name, html, css, js });
      });
  }

  render () {
    return (
      <div className='page-bin-wrapper' style={{cursor: this.state.dragging ? 'e-resize' : 'default'}}>
        <BinNav {...this.props} handleSave={this.handleSave.bind(this)}/>
        <div className="bin-container">
          <Editor
            {...this.state}
            changeTab={this.changeTab.bind(this)}
            editorTextarea={this.editorTextarea}
            handleChange={this.handleChange.bind(this)}
            handleKeyDown={this.handleKeyDown.bind(this)}
            handleScroll={this.handleScroll.bind(this)}
            set={this.set.bind(this)}
          />
          <View {...this.state} dragging={this.state.dragging}/>
        </div>
      </div>
    );
  }
}

class BinNav extends Component {
  render () {
    return (
      <div className="bin-nav">
        <button className="btn btn-secondary">Bin Details</button>
        <button className="btn btn-success" onClick={this.props.handleSave.bind(this)}>{this.props.user.username ? 'Save Bin' : 'Sign Up & Save Bin'}</button>
        <button className="btn btn-secondary">Profile Pic</button>
      </div>
    );
  }
}

class View extends Component {
  render () {
    const cover = (
      <div className="iframe-cover"></div>
    );
    return (
      <div className="iframe-container" style={{width: window.innerWidth > 768 ? window.innerWidth - this.props.width : window.innerWidth}}>
        {this.props.dragging ? cover : ''}
        <iframe className="iframe" id="editor-iframe" src={"http://localhost:81/api/bin/page/" + this.props._id} title="bin">
        </iframe>
      </div>
    );
  }
}