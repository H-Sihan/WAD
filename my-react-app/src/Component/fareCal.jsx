import React, { useState } from "react";

function FareCal({ colour }) {
    // State variables
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");
    const [fare, setFare] = useState("");

    // Function to update name and age
    function updateDetails() {
        let ageNum = parseInt(age, 10);
        
        if (isNaN(ageNum) || age.trim() === "") {
            setMessage("Invalid age");
        } else if (ageNum < 0) {
            setMessage("Invalid age");
        } else if (ageNum < 18) {
            setMessage("You are NOT old enough to vote");
        } else {
            setMessage("You are old enough to vote");
        }
    }

    // Function to calculate train fare
    function calculateFare() {
        const fares = {
            "Winchester": 3,
            "Salisbury": 5,
            "London": 15
        };

        let baseFare = fares[location] || 0;
        let finalFare = age >= 18 ? baseFare : baseFare / 2;
        
        if (baseFare === 0) {
            setFare("Invalid location");
        } else {
            setFare(`Train fare to ${location} is £${finalFare}`);
        }
    }

    return (
        <div style={{ backgroundColor: colour, padding: "20px", borderRadius: "8px" }}>
            <h2>Enter your details</h2>
            <input 
                type="text" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <br />
            <input 
                type="number" 
                placeholder="Enter your age" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
            />
            <br />
            <button onClick={updateDetails}>Update details</button>

            <div style={{ marginTop: "10px" }}>
                <p>Your name is: {name}</p>
                <p 
                    style={{ 
                        color: "white", 
                        backgroundColor: age >= 18 ? "green" : "red", 
                        padding: "5px", 
                        display: "inline-block" 
                    }}
                >
                    {message}
                </p>
            </div>

            <h3>Train Fare Calculator</h3>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Select Location</option>
                <option value="Winchester">Winchester</option>
                <option value="Salisbury">Salisbury</option>
                <option value="London">London</option>
            </select>
            <br />
            <button onClick={calculateFare}>Go</button>

            <div style={{ marginTop: "10px" }}>
                <p>{fare}</p>
            </div>
        </div>
    );
}

export default FareCal;
