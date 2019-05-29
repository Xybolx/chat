import React from "react";

class BtnPrimary extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (
            <button onClick={this.handleFormSubmit} type="button" className="btn btn-primary btn-block"></button>
        );
    };
};

export default BtnPrimary;