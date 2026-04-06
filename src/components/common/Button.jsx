import React, { Component } from "react";
import "./Button.css";

class Button extends Component {
  render() {
    const { type = "button", disabled, children } = this.props;

    return (
      <button
        type={type}
        className="primary-button"
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

export default Button;
