import React, { Component } from 'react';
import { 
  Container,
  Button, 
  Card } from 'reactstrap';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStart: null,
      timeBetween: 0,
      bpm: 0.0,
      count: 0,
      resetTime: 2000,
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', () => {
      this.onTap();
    })
  }

  componentDidUpdate() {
    let html = document.querySelector('body');
    html.style = `--animationTime: ${120/this.state.bpm}s`
  }

  onTap = e => {
    // this is a bit messy, e is only passed if tap button, not for keypress
    if (e) e.preventDefault();
    // stuff to do when tapped
    const now = (new Date()).getTime();
    let count = this.state.count;
    if (!count ||
        now - this.state.timeStart > this.state.resetTime) {
      const timeStart = now;
      this.setState({timeStart, timeBetween: 'First beat'})
      count = 1;
    } else {
      const timeStart = now;
      const timeBetween = now - this.state.timeStart;
      const latestBpm = 60000 / timeBetween;
      // creates a new average based on the number of counts already and the latest bpm
      const bpm = Math.round(((this.state.bpm * (count - 1) + latestBpm) / count)*100)/100;
      this.setState({timeStart, timeBetween, bpm});
      count++;
    }

    this.setState({count});
  }

  onReset = () => {
    this.setState({bpm: 0.0, timeBetween: null, count: 0})
  }

  render() {
    return (
      <Container>
        <h1 className="my-3">BPM Counter</h1>

        {/* Getting all the pieces down before I split them up into components */}

        Press any key to record a beat or <Button onClick={this.onTap} className="my-3 mx-3">Tap</Button><br />
        Reset after 
        <select className="mx-2" value={this.state.resetTime} onChange={e => {
          this.setState({resetTime: e.target.value})
        }}>
          <option value="1000">1</option>
          <option value="2000">2</option>
          <option value="3000">3</option>
          <option value="4000">4</option>
          <option value="5000">5</option>
        </select>
        seconds of no tap or 
        <Button onClick={this.onReset} className="btn-danger mx-3">Reset</Button>

        <Card className="my-4 p-3">
          <h3>Number of taps:</h3> {this.state.count}
        </Card>
        <Card className="my-4 p-3">
          <h3>Time between taps:</h3> {this.state.timeBetween}
        </Card>
        <Card className="my-4 p-3">
          <h3>BPM:</h3> {this.state.bpm}
        </Card>
        <Card className="my-4 p-3">
          <h3>Visualiser:</h3>
          <p>
            This is animated according to the current BPM
          </p>
          <div className="loader">
            <div className="loader__squares">
              <div className="loader__squares--one"></div>
              <div className="loader__squares--two"></div>
            </div>
          </div>
        </Card>
      </Container>
    );
  }
}

export default App;
