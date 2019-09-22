// survey field contains logic to render a single text field with label

import React from "react";

export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ margineBottom: "5px" }} />

      <div className="red-text" style={{ margineBottom: "20px" }}>
        {touched && error}
      </div>
    </div>
  );
};
