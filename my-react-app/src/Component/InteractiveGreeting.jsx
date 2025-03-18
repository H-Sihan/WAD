import React from 'react';

function InteractiveGreeting() {

    const [name, setName] = React.useState("No name");

    return (
        <div>
            <h2>Enter your name</h2>
            <input id='txtName' />
            <div>Hello {name}</div>
            <button onClick={updateStateName}>Update!</button>
        </div>
    );

    function updateStateName() {
        setName(document.getElementById('txtName').value);
    }
}

export default InteractiveGreeting;