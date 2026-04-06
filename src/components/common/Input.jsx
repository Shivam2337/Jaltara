import React, { Component } from "react";
import "./Input.css";

class Input extends Component {
  render() {
    const {
      label,
      type = "text",
      name,
      value,
      onChange,
      ...restProps // <-- capture all other props
    } = this.props;

    return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <input
          className="input-field"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          {...restProps}   // <-- pass them to the input
        />
      </div>
    );
  }
}

export default Input;
