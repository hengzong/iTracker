import "./Register.scss";

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
import { USER_REGISTER_POST } from "../api";
import axios from "axios";
import logo from "../image/logo.png";
import { withStyles } from "@material-ui/core/styles";

const username_regex = "^[A-Za-z0-9]{2,15}$";
const email_regex =
  "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";

class Register extends Component {
  state = {
    email: "",
    username: "",
    password: "",
    confmPassword: "",

    email_errorText: "",
    username_errorText: "",
    password_errorText: "",
    confmPassword_errorText: "",
    showPassword: false,
    error: false,

    loggedIn: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    this.setState({ error: false });
    var input = event.target.value;
    switch (name) {
      case "email":
        if (input.match(email_regex)) {
          this.setState({ email_errorText: "" });
        } else {
          this.setState({ email_errorText: "Invalid Email Format." });
        }
        break;
      case "username":
        if (input.match(username_regex)) {
          this.setState({ username_errorText: "" });
        } else {
          this.setState({
            username_errorText: "Length 2-15 & Only Alphanumeric Characters."
          });
        }
        break;
      case "password":
        if (input.length >= 6) {
          this.setState({ password_errorText: "" });
        } else {
          this.setState({
            password_errorText: "Password at least 6 Characters."
          });
        }
        break;
      case "confmPassword":
        this.setState({ confmPassword_errorText: "" });
        break;
      default:
        break;
    }
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleRegister = async () => {
    if (this.state.password !== this.state.confmPassword) {
      this.setState({
        confmPassword_errorText:
          "Comfirm Password and Password does not match.",
        error: true
      });
    } else if (
      this.state.email_errorText ||
      this.state.username_errorText ||
      this.state.password_errorText
    ) {
      this.setState({ error: true });
    } else {
      this.setState({ error: false });

      var curr = this;
      await new Promise((resolve, reject) => {
        axios
          .post(USER_REGISTER_POST, {
            name: curr.state.username,
            email: curr.state.email,
            password: curr.state.password
          })
          .then(res => {
            if (res.status === 201) {
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
            if (err.status === 500) {
              this.setState({
                email_errorText: "Registered Email Address",
                error: true
              });
            } else {
              this.setState({
                error: true
              });
            }
          });
      });
    }
  };

  render() {
    if (this.state.loggedIn) {
      return <Redirect to="/" />;
    }

    const { classes } = this.props;
    return (
      <BackgroundContainer style={{ height: "100vh" }}>
        <LoginHeader register />
        <img src={logo} alt="logo" />
        <div id="login-form">
          <TextField
            id="input-username"
            label="Username"
            type="text"
            error={this.state.error}
            helperText={this.state.username_errorText}
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleChange("username")}
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
            id="input-email"
            label="Email"
            type="email"
            error={this.state.error}
            helperText={this.state.email_errorText}
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange("email")}
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
            helperText={this.state.password_errorText}
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
            FormHelperTextProps={{
              className: classes.helperText
            }}
          />
          <TextField
            id="input-confm-password"
            label="Confirm Password"
            error={this.state.error}
            helperText={this.state.confmPassword_errorText}
            type={this.state.showPassword ? "text" : "password"}
            className={classes.textField}
            value={this.state.confmPassword}
            onChange={this.handleChange("confmPassword")}
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
            FormHelperTextProps={{
              className: classes.helperText
            }}
          />
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            onClick={this.handleRegister}
          >
            Register
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
    color: "#E8AC66",
    fontWeight: "bold"
  }
});

export default withStyles(styles)(Register);
