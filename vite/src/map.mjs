import 'leaflet';
import 'leaflet/dist/leaflet.css';

const map = L.map ("map1");

const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

L.tileLayer
        ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: attrib } ).addTo(map);

const pos = [50.908, -1.4];            
map.setView(pos, 14);

const marker = L.marker(pos).addTo(map);
marker.bindPopup("My Location");
