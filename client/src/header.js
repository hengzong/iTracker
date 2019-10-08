import "./header.scss";

import React, { PureComponent } from "react";

import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

class Header extends PureComponent {
  render() {
    const { displayText, buttonLink, buttonText, children } = this.props;

    return (
      <div>
        <span className="loginHeader">
          <Link to="/" id="website-name">
            iTracker
          </Link>
          {children}
          <div className="userContainer">
            <label id="member">{displayText}</label>
            <Link to={buttonLink}>
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                id="register-button"
              >
                {buttonText}
              </Button>
            </Link>
          </div>
        </span>
      </div>
    );
  }
}

class LoginHeader extends PureComponent {
  render() {
    const { register, children } = this.props;

    return (
      <Header
        displayText={register ? "Already a member?" : "Not a member?"}
        buttonText={register ? "Login" : "Register"}
        buttonLink={register ? "/login" : "/register"}
        children={children}
      />
    );
  }
}

export { Header, LoginHeader };
export default LoginHeader;
