import React from "react";

 
    BtnPrimary = props => {
        return (
            <div>
                <button {...props} type="button" className="btn btn-primary btn-block"></button>
                    {props.children}
            </div>
        );
    };

export default BtnPrimary;