import React from 'react';
import './Label.css';

const Label = (props) => {
    return (
        <p className="Label" id={props.labelId}>{props.label}</p>
    );
}

export default Label;