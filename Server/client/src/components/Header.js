import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Payments from "./Payments";
class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <a className="ui red button" href="/auth/google">
            <i className="google icon"></i>
            Login With Google
          </a>
        );
      default:
        return [
          <Payments key="1">
            <div className="ui button blue">
              <i className="plus circle icon"></i>Add Credits
            </div>
          </Payments>,
          <div
            key="3"
            className="ui teal large horizontal label"
            style={{ margin: "0 10px", textAlign: "center" }}
          >
            Credits: {this.props.auth.credits}
            <i className="bolt icon" style={{ margin: "0 5px" }} />
          </div>,
          <a className="ui red button" href="/api/logout" key="2">
            <i className="google icon"></i>
            Logout
          </a>
        ];
    }
  }
  render() {
    return (
      <div className="ui teal inverted large menu">
        <Link
          className="ui massive teal ribbon label"
          to={this.props.auth ? "/surveys" : "/"}
        >
          Emaily
        </Link>

        <div className="item right">{this.renderContent()}</div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
