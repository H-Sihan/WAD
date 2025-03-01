// 🌟 Base API URL
const API_URL = 'http://localhost:3001'; 

// 🎵 Function to add a new song
async function addSong(event) {
    event.preventDefault();
 
    // Collect form data
    const songData = {
        title: document.getElementById("title").value.trim(),
        artist: document.getElementById("artist").value.trim(),
        year: parseInt(document.getElementById("year").value.trim(), 10),
        downloads: parseInt(document.getElementById("downloads").value.trim(), 10),
        price: parseFloat(document.getElementById("price").value.trim()),
        quantity: parseInt(document.getElementById("quantity").value.trim(), 10)
    };

    try {
        const response = await fetch(`${API_URL}/songs/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(songData)
        });

        if (!response.ok) {
            throw new Error(`Failed to add song: ${await response.text()}`);
        }

        document.getElementById("addSongMessage").textContent = "🎉 Song added successfully!";
        document.getElementById("addSongForm").reset();
        fetchSongs(); 
    } catch (error) {
        document.getElementById("addSongMessage").textContent = `❌ Error: ${error.message}`;
    }
}

// 🎶 Function to fetch all songs
async function fetchSongs() {
    try {
        const response = await fetch(`${API_URL}/songs`);
        if (!response.ok) {
            throw new Error(`Failed to fetch songs: ${await response.text()}`);
        }

        const songs = await response.json();
        renderSongs(songs);
    } catch (error) {
        document.getElementById("songList").innerHTML = `<p style="color: red;">❌ Error: ${error.message}</p>`;
    }
}

// 🎨 Function to render songs in a grid
function renderSongs(songs) {
    const songList = document.getElementById("songList");
    songList.innerHTML = songs.map(song => `
        <div class="song-card">
            <p class="song-title">${song.title} <span>(${song.year})</span></p>
            <p class="song-info">🎤 ${song.artist}</p>
            <p class="song-info">💾 ${song.downloads} downloads, 💰 $${song.price}, 📦 ${song.quantity} in stock</p>
        </div>
    `).join("");
}

// 🔎 Expose filterSongs globally
window.filterSongs = function () {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".song-card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(searchQuery) ? "block" : "none";
    });
};

// 📌 Event Listeners
document.getElementById("addSongForm").addEventListener("submit", addSong);
document.getElementById("fetchSongs").addEventListener("click", fetchSongs);