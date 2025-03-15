import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Initialize the map (this assumes "map1" already exists)
const map = L.map("map1");

// Attribution text for OpenStreetMap
const attrib = "Map data © OpenStreetMap contributors, Open Database Licence";

// Add a tile layer (background map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: attrib
}).addTo(map);

// Set the initial view
const pos = [50.908, -1.4];            
map.setView(pos, 14);

// Add a marker for the predefined location
const marker = L.marker(pos).addTo(map);
marker.bindPopup("My Location").openPopup();

// Allow the user to click anywhere to add a marker dynamically
map.on("click", (e) => {
    const text = prompt("Please enter some text:");

    if (text !== null && text.trim() !== "") {
        const newMarker = L.marker(e.latlng).addTo(map);
        newMarker.bindPopup(text).openPopup();
    }
});
