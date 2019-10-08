import "./Login.scss";

import {
  Button,
  IconButton,
  InputAdornment,
  TextField
} from "@material-ui/core";
import React, { Component } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import BackgroundContainer from "../background";
import LoginHeader from "../header";
import { Redirect } from "react-router";
import { USER_LOGIN_POST } from "../api";
import axios from "axios";
import logo from "../image/logo.png";
import { withStyles } from "@material-ui/core/styles";

const email_regex =
  "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

class Login extends Component {
  state = {
    email: "",
    email_errorText: "",
    password: "",
    showPassword: false,
    error: false,

    loggedIn: false
  };

  handleChange = name => event => {
    var input = event.target.value;
    this.setState({
      [name]: input,
      error: false
    });
    switch (name) {
      case "email":
        if (input.match(email_regex)) {
          this.setState({ email_errorText: "" });
        } else {
          this.setState({ email_errorText: "Invalid Email Format" });
        }
        break;
      default:
        break;
    }
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleLogin = async () => {
    if (this.state.email_errorText) {
      return;
    }

    var curr = this;
    await new Promise((resolve, reject) => {
      axios
        .post(USER_LOGIN_POST, {
          email: curr.state.email,
          password: curr.state.password
        })
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem("user", JSON.stringify(res.data.data.user));
            localStorage.setItem("token", res.data.data.token);
            this.setState({
              loggedIn: true
            });
          } else {
            this.setState({
              error: true
            });
          }
        })
        .catch(err => {
          this.setState({
            error: true
          });
        });
    });
  };

  render() {
    const { classes } = this.props;
    if (this.state.loggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <BackgroundContainer style={{ height: "100vh" }}>
        <LoginHeader />
        <img src={logo} alt="logo" />
        <div id="login-form">
          <label
            className={
              this.state.error ? "reminder visible" : "reminder invisible"
            }
          >
            {"Email / Password Incorrect"}
          </label>
          <TextField
            id="input-email"
            label="Email"
            type="email"
            error={this.state.error}
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange("email")}
            helperText={this.state.email_errorText}
            margin="normal"
            InputProps={{
              className: classes.input
            }}
            InputLabelProps={{
              className: classes.cssLabels
            }}
            FormHelperTextProps={{
              className: classes.helperText
            }}
          />
          <TextField
            id="input-password"
            label="Password"
            error={this.state.error}
            type={this.state.showPassword ? "text" : "password"}
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleChange("password")}
            margin="normal"
            InputProps={{
              className: classes.input,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
            InputLabelProps={{
              className: classes.cssLabels
            }}
          />
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            onClick={this.handleLogin}
          >
            Login
          </Button>
        </div>
      </BackgroundContainer>
    );
  }
}

const styles = theme => ({
  input: {
    color: "#DDEFF3"
  },

  textField: {
    width: "25%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 100
  },

  cssLabels: {
    color: "#DDEFF3"
  },

  helperText: {
    color: "#efe8b3",
    fontWeight: "bold"
  }
});

export default withStyles(styles)(Login);
