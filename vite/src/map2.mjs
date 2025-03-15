import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Initialize the map centered at a default location
const map = L.map("map1").setView([51.505, -0.09], 5); // Default UK location

// Load OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors"
}).addTo(map);

// Fetch and display an artist's hometown
document.getElementById("findArtist").addEventListener("click", async () => {
    const artist = document.getElementById("artist").value;

    if (!artist.trim()) {
        alert("Please enter an artist name.");
        return;
    }

    const response = await fetch(`http://localhost:3000/hometown/${artist}`);

    if (response.ok) {
        const data = await response.json();
        map.setView([data.lat, data.lon], 10);

        const marker = L.marker([data.lat, data.lon]).addTo(map);
        marker.bindPopup(`${artist}'s hometown: ${data.hometown}`).openPopup();
    } else {
        alert("Artist not found!");
    }
});

// Allow the user to click on the map to add a new hometown
map.on("click", async (e) => {
    const artist = prompt("Enter artist name:");
    const hometown = prompt("Enter hometown:");

    if (!artist || !hometown) {
        alert("Both artist name and hometown are required!");
        return;
    }

    const data = {
        name: artist,
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        hometown
    };

    // Send data to the backend
    const response = await fetch("http://localhost:3000/addHometown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
            .bindPopup(`${artist}: ${hometown}`).openPopup();
    } else {
        alert("Error adding hometown. Please try again.");
    }
});
