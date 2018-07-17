import React, { Component } from 'react';
import './App.css';
import Label from './components/label/Label';
import DurationButton from './components/durationButton/DurationButton';
import DurationDisplay from './components/durationDisplay/DurationDisplay';

const COLORS = {
  break: 'hsl(0,70%,50%)',
  session: 'hsl(120,50%,40%)'
}
const INTERVAL = () => setInterval(() => {
  let newState = this.state;
  if(this.state[this.state.currentTimer].currentLength > 0) {
    newState[this.state.currentTimer].currentLength = newState[this.state.currentTimer].currentLength - 1;
  } else {
    newState[this.state.currentTimer].timer = false;
    newState.currentTimer = this.state.currentTimer === "session" ? "break" : "session";
    newState[newState.currentTimer].timer = true;
    newState[newState.currentTimer]['length'] = this.state[newState.currentTimer].length;
    newState[newState.currentTimer].currentLength = this.state[newState.currentTimer].length;
  }
  this.setState(newState);
}, 1000);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      break: {
        length: 5*60,
        currentLength: 5*60,
        timer: false
      },
      session: {
        length: 25*60,
        currentLength: 25*60,
        timer: false
      },
      currentTimer: ""
    }
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.reset = this.reset.bind(this);
    this.intervalFunction = this.intervalFunction.bind(this);
    this.startStop = this.startStop.bind(this);
    this.buzzer = this.buzzer.bind(this);
  }
  increment(timer) {
    if (this.state[timer].length < 60*60) {
      let newState = this.state;
      newState[timer]['length'] = this.state[timer].length + 1*60;
      this.setState(newState);
    }
    this.updateDisplay(this.state[timer], COLORS[timer]);
  }
  decrement(timer) {
    if (this.state[timer].length > 1*60) {
      let newState = this.state;
      newState[timer]['length'] = this.state[timer].length - 1*60;
      this.setState(newState);
    }
    this.updateDisplay(this.state[timer], COLORS[timer]);
  }
  updateDisplay(node, color) {
    let style = {
      background: `linear-gradient(
        0deg, 
        ${color}, 
        ${color} ${Math.round((node.length-node.currentLength)*100/node.length)}%, 
        hsl(120,10%,30%) ${Math.round((node.length-node.currentLength)*100/node.length)}%, 
        hsl(120,10%,30%) 100%
      )`
    };
    if(node.timer) {
      style.display = 'block';
    }
    return style
  }
  intervalFunction() {
    return setInterval(() => {
      let newState = this.state;
      if(this.state[this.state.currentTimer].currentLength > 0) {
        newState[this.state.currentTimer].currentLength = newState[this.state.currentTimer].currentLength - 1;
      } else {
        this.buzzer(this.state[this.state.currentTimer].currentLength);
        newState[this.state.currentTimer].timer = false;
        newState.currentTimer = this.state.currentTimer === "session" ? "break" : "session";
        newState[newState.currentTimer].timer = true;
        newState[newState.currentTimer]['length'] = this.state[newState.currentTimer].length;
        newState[newState.currentTimer].currentLength = this.state[newState.currentTimer].length;
      }
      this.setState(newState);
    }, 1000)
  }
  startStop() {
    if(!this.state.currentTimer) {
      this.setState({
        session: {
          timer: true,
          currentLength: this.state.session.length,
          length: this.state.session.length
        },
        currentTimer: "session"
      });
      this.setState({
        interval: (this.intervalFunction)()
      });
    } else if(this.state[this.state.currentTimer].timer) {
      clearInterval(this.state.interval);
      this.setState({
        session: {
          timer: false,
          currentLength: this.state.session.currentLength,
          length: this.state.session.length
        },
        break: {
          timer: false,
          currentLength: this.state.break.currentLength,
          length: this.state.break.length
        }
      });
    } else {
      this.setState({
        interval: (this.intervalFunction)()
      });
    }
  }
  buzzer(_timer) {
    if (_timer === 0) {
      this.audioBeep.play();
    }
  }
  reset() {
    clearInterval(this.state.interval);
    this.setState(prevState => ({
      break: {
        length: 5*60,
        currentLength: 5*60,
        timer: false
      },
      session: {
        length: 25*60,
        currentLength: 25*60,
        timer: false
      },
      currentTimer: ""
    }));
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pomodoro Clock</h1>
        </header>
        <div className="controls">
          <div className="control">
            <Label label="Break Time" labelId="break-label" />
            <DurationButton sign="+" buttonId="break-increment" onClick={() => this.increment('break')} />
            <p id="break-length">{this.state.break.length/60}</p>
            <DurationButton sign="-" buttonId="break-decrement" onClick={() => this.decrement('break')} />
          </div>
          <div className="control">
            <Label label="Session Time" labelId="session-label" />
            <DurationButton sign="+" buttonId="session-increment" onClick={() => this.increment('session')} />
            <p id="session-length">{this.state.session.length/60}</p>
            <DurationButton sign="-" buttonId="session-decrement" onClick={() => this.decrement('session')} />
          </div>
        </div>
        <div className="buttons">
          <button onClick={this.startStop} id="start_stop">START / STOP</button>
          <button onClick={this.reset} id="reset">RESET</button>
        </div>
        <div className="displays">
          <div id="labels">
            <p id="timer-label">{this.state.currentTimer ? this.state.currentTimer.toUpperCase(): "Let's start!"}</p>
            <p id="time-left">{this.state.currentTimer ? 
                `${Math.floor((this.state[this.state.currentTimer].currentLength)/60) < 10 ? 
                "0" + Math.floor((this.state[this.state.currentTimer].currentLength)/60): Math.floor((this.state[this.state.currentTimer].currentLength)/60)}:${this.state[this.state.currentTimer].currentLength%60 < 10 ? 
                "0" + this.state[this.state.currentTimer].currentLength%60: this.state[this.state.currentTimer].currentLength%60}`
                : '00:00'}</p>
          </div>
          <DurationDisplay styling={this.updateDisplay(this.state.break, COLORS.break)} />
          <DurationDisplay styling={this.updateDisplay(this.state.session, COLORS.session)} />
        </div>
        <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }} />
      </div>
    );
  }
}

export default App;
