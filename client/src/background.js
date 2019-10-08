import "./background.scss";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#DDEFF3",
      text: {
        primary: "#DDEFF3"
      }
    }
  },

  typography: {
    useNextVariants: true
  }
});

class BackgroundContainer extends Component {
  render() {
    const { children, ...props } = this.props;
    return (
      <div className="background" {...props}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </div>
    );
  }
}

export default BackgroundContainer;
