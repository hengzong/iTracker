import "./App.scss";

import { Header, LoginHeader } from "./header";
import React, { Component } from "react";

import BackgroundContainer from "./background";
import { Button as MButton } from "@material-ui/core";
import logo from "./image/logo.png";
import { animateScroll as scroll } from "react-scroll";

const webgazer = window.webgazer;
const qSize = 40;
class App extends Component {
  constructor(props) {
    super(props);
    let browseURL = props.location.search;
    if (browseURL) {
      const prefix = "?browseURL=".length;
      browseURL = browseURL.substring(prefix);
      if (browseURL.substring(0, 4) !== "http") {
        browseURL = "https://" + browseURL;
      }
    }

    this.state = {
      q: [],
      active: null,
      width: 0,
      height: 0,
      user: null,
      token: "",
      url: browseURL || "https://www.google.com/webhp?igu=1",
      caliDisplay: browseURL ? "none" : "flex",
      frameDisplay: browseURL ? "block" : "none",
      tracking: false,
      browsing: false,
      paused: false
    };
  }

  componentWillMount() {
    let user = localStorage.getItem("user");
    let token = localStorage.getItem("token");
    if (user && token) {
      this.setState({
        user: JSON.parse(user),
        token
      });
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    let intervalId = setInterval(this.browseScroll, 300);
    this.setState({ intervalId });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
    webgazer.clearGazeListener();
    // window.localStorage.clear();
    clearInterval(this.state.intervalId);
  }

  browseScroll = () => {
    const { browsing, active } = this.state;
    if (browsing) {
      let len = active === "upper" ? -200 : 200;
      scroll.scrollMore(len);
    }
  };

  startTraking = () => {
    const { q, height } = this.state;
    this.setState({
      tracking: true
    });
    webgazer
      .setRegression("ridge")
      .setTracker("clmtrackr")
      .setGazeListener((data, elapsedTime) => {
        if (data == null) {
          return;
        }

        let newQ = [...q];
        newQ.push(data);
        if (newQ.length > qSize) {
          newQ.slice(0, qSize);
        }

        let sum = newQ.reduce(
          (acc, curr) => acc + (curr.y > height / 2 ? 1 : -1),
          0
        );

        this.setState({
          q: newQ,
          active: sum > 0 ? "lower" : "upper"
        });

        // var xprediction = data.x; //these x coordinates are relative to the viewport
        // var yprediction = data.y; //these y coordinates are relative to the viewport
        // console.log(xprediction, yprediction, elapsedTime);
      })
      .begin()
      .showPredictionPoints(true);
  };

  updateWindowDimensions = () =>
    this.setState({ width: window.innerWidth, height: window.innerHeight });

  pauseTracking = () => {
    this.setState({
      browsing: false,
      paused: true
    });
    webgazer
      .pause()
      .showPredictionPoints(false)
      .showVideo(false)
      .showFaceOverlay(false)
      .showFaceFeedbackBox(false);
  };

  stopTracking = () => {
    this.setState({
      browsing: false,
      tracking: false
    });
    webgazer.clearGazeListener().end();
  };

  resumeTracking = () => {
    this.setState({
      browsing: true,
      paused: false
    });
    webgazer
      .resume()
      .showPredictionPoints(true)
      .showVideo(true)
      .showFaceOverlay(true)
      .showFaceFeedbackBox(true);
  };

  _setFrameRef = ref => {
    this.FrameRef = ref;
  };

  hideTracking = () => {
    this.setState({
      caliDisplay: "none",
      browsing: true,
      frameDisplay: "block"
    });
  };

  closeTracking = () => {
    this.setState({
      caliDisplay: "none",
      frameDisplay: "block"
    });
  };

  showCalibration = () => {
    this.setState({
      caliDisplay: "flex",
      frameDisplay: "none"
    });
  };

  _renderReCalibrateButton = () => {
    const { browsing, paused } = this.state;

    return (
      <MButton
        variant="outlined"
        size="medium"
        color="primary"
        onClick={
          paused
            ? this.resumeTracking
            : browsing
            ? this.pauseTracking
            : this.showCalibration
        }
        id="recalibrateButton"
      >
        {paused ? "Resume" : browsing ? "Pause" : "Re-Calibrate"}
      </MButton>
    );
  };

  render() {
    const {
      active,
      user,
      url,
      caliDisplay,
      frameDisplay,
      tracking
    } = this.state;

    return (
      <BackgroundContainer style={{ height: "fit-content" }}>
        <div className="App" style={{ display: caliDisplay }}>
          <div
            className="upper"
            style={{
              backgroundColor: active === "upper" ? "green" : "transparent"
            }}
          />
          <div
            className="lower"
            style={{
              backgroundColor: active === "lower" ? "green" : "transparent"
            }}
          />
          <img src={logo} alt="logo" />
          <h1>Please Calibrate Webcam</h1>
          <p>
            Click four corners of the screen 5 - 10 times while looking at the
            red dot.
          </p>
          <div className="buttonContainer">
            <MButton
              variant="outlined"
              size="medium"
              color="primary"
              onClick={this.startTraking}
              disabled={tracking}
            >
              Start
            </MButton>
            <MButton
              variant="outlined"
              size="medium"
              onClick={this.hideTracking}
              disabled={!tracking}
            >
              Done
            </MButton>
            <MButton
              variant="outlined"
              size="medium"
              color="secondary"
              onClick={this.closeTracking}
              disabled={tracking}
            >
              Close
            </MButton>
          </div>
        </div>

        {user ? (
          <Header
            displayText={user.name}
            buttonText="Bookmarks"
            buttonLink="/bookmarks"
          >
            {this._renderReCalibrateButton()}
          </Header>
        ) : (
          <LoginHeader>{this._renderReCalibrateButton()}</LoginHeader>
        )}
        <div className="contentContainer">
          <iframe
            src={url}
            title="iframe"
            className="iframe"
            scrolling="no"
            style={{ display: frameDisplay }}
          />
        </div>
      </BackgroundContainer>
    );
  }
}

export default App;
