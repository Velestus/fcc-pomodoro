import React from 'react';
import './DurationButton.css';

const DurationButton = (props) => {
    return (
        <div className="time-control" id={props.buttonId}
             onClick={props.onClick} 
        >
             {props.sign}
        </div>
    );
}

export default DurationButton;