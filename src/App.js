import React, { Component, Fragment } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

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

        <Pulser timing={Math.floor(60/this.state.bpm*10)/10}>
          <div className="circle circle--one"></div>
          <div className="circle circle--two"></div>
        </Pulser>

        </MainArea>
        <GlobalStyle />
      </Fragment>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
  }

  body {
    background: #222;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    color: #fff;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const Sidebar = styled.div`
  padding: 2rem;
  position: fixed;
  left: 0;
  height: 100%;
  width: 340px;
  background: #555;
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
  background: #222;
  color: #fff;
  padding: .6rem;
  width: 40%;
  border: none;
  border-radius: 3px;
`;

const Explanation = styled.div`
  width: 50%;
  color: #fff;

  @media (max-width: 800px) {
    text-align: left;
  }
`;

const MainArea = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 2rem 4rem;
  margin-left: 340px;
  text-align: center;

  @media (max-width: 800px) {
    margin-left: 0;
  }
`;

const ShowBPM = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 10rem;
  color: #fff;
  border-bottom: 1px solid #555;
  margin: 80px auto 0;
`;

const ShowBPMCaption = styled.div`
  font-size: 2rem;
  color: #555;
  margin: 1rem 0;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Pulser = styled.div`
margin: 100px auto;
  width: 220px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .circle {
    height: 100px;
    width: 100px;
    background: #D94747;
    border-radius: 50%;
    opacity: 0.5;
  }

  .circle--one {
    animation: ${pulse} ${props => props.timing}s linear infinite;
  }

  .circle--two {
    animation: ${pulse} ${props => props.timing}s linear infinite;
    animation-delay: ${props => props.timing / 2}s;
  }
`;
