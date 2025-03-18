import React from 'react';

function InteractiveGreeting3() {
    const [name, setName] = React.useState("No name");

    function updateStateName(event) {
        setName(event.target.value);
    }

    return (
        <div>
            <h2>Enter your name</h2>
            <input id='txtName' type='text' value={name} onChange={updateStateName} />
            <div>Hello {name}</div>
            <button onClick={updateStateName}>Update!</button>
            <div id="message">{name === "" ? "ERROR: Please enter a name!" : `Hello ${name}`}</div>
        </div>
    );
}

export default InteractiveGreeting3;
