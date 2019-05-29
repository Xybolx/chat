import React from "react";

 export function BtnPrimary(props) {

        return (
            <button {...props} className="btn btn-primary btn-block">
               {props.children}
            </button>

        );
    };