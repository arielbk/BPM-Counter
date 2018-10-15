import React, { Component, Fragment } from 'react';
import styled, { injectGlobal } from 'styled-components';
import './Animation.css';

export default class App extends Component {
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
      if (timeBetween < 150) return;
      const latestBpm = 60000 / timeBetween;
      // creates a new average based on the number of counts already and the latest bpm
      const bpm = Math.round(((this.state.bpm * (count - 1) + latestBpm) / count)*10)/10;
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
      <Fragment>
        <Sidebar>
          <Title>BPM Count</Title>
          <TitleCaption>Tap along to music and find out the tempo</TitleCaption>

          <Group>
            <Button onClick={this.onTap}>Tap</Button>
            <Explanation>or press any key to record BPM</Explanation>
          </Group>

          <Group>
            <Button>{this.state.count}</Button>
            <Explanation>taps recorded</Explanation>
          </Group>

          <Group>
            <Button onClick={this.onReset}>Reset</Button>
            <Explanation>or reset after 2 seconds</Explanation>
          </Group>

        </Sidebar>

        <MainArea>
          <ShowBPM>
            { this.state.bpm }
          </ShowBPM>
          <ShowBPMCaption>
            Average BPM
          </ShowBPMCaption>

          <div className="loader">
            <div className="loader__squares">
              <div className="loader__squares--one"></div>
              <div className="loader__squares--two"></div>
            </div>
          </div>
        </MainArea>
        
      </Fragment>
    );
  }
}

injectGlobal`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
  }
`;

const Sidebar = styled.div`
  padding: 2rem;
  position: fixed;
  left: 0;
  height: 100%;
  width: 340px;
  background: #ccc;
  overflow-y: scroll;

  @media (max-width: 800px) {
    position: relative;
    display: block;
    width: 100%;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 5rem;
  margin: 0;
  line-height: 1em;
  font-weight: 400;
`;

const TitleCaption = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
`;

const Group = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0;
`;

const Button = styled.button`
  font-size: 2rem;
  background: #eee;
  border: 1px solid #000;
  padding: .6rem;
  width: 40%;
  border-radius: 3px;
`;

const Explanation = styled.div`
  width: 50%;
  color: #555; 
`;

const MainArea = styled.div`
  position: relative;
  // width: 100%;
  max-width: 900px;
  padding: 2rem 4rem;
  margin-left: 340px;
  text-align: center;

  @media (max-width: 800px) {
    margin-left: 0;
  }
`;

const ShowBPM = styled.div`
  font-size: 10rem;
  border-bottom: 1px solid #ccc;
`;

const ShowBPMCaption = styled.div`
  font-size: 2rem;
  color: #ccc;
  margin: 1rem 0;
`;