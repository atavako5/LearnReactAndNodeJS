import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSurveys } from "../../actions";

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }
  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card" key={survey._id}>
          <div className="content">
            <div className="header">{survey.title}</div>
            <div class="description">
              <div className="ui right floated">
                Sent On: {new Date(survey.dateSent).toLocaleDateString()}
              </div>
              {survey.body}
            </div>
          </div>
          <div className="extra content">
            <div className="ui two labels">
              <div class="ui green label">Yes: {survey.yes}</div>
              <div class="ui green label">No: {survey.no}</div>
            </div>
          </div>
        </div>
      );
    });
  }
  render() {
    return <div className="ui cards">{this.renderSurveys()}</div>;
  }
}

function mapStateToProps({ surveys }) {
  return { surveys };
}

export default connect(
  mapStateToProps,
  { fetchSurveys }
)(SurveyList);
