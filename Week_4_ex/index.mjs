let currentPage = 1;
const resultsPerPage = 10;
let allSongs = [];

//Function
document.getElementById("search").addEventListener("click", async function () {
    const query = document.getElementById("theArtist").value.trim();
    if (!query) {
        alert("Please enter an artist name!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/songs");
        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        const data = await response.json();
        allSongs = data.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );

        currentPage = 1; // Reset pagination
        displayResults();
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch search results.");
    }
});

// ✅ Fetch all songs when "Show All Songs" is clicked
document.getElementById("showAll").addEventListener("click", async function () {
    try {
        const response = await fetch("http://localhost:3000/songs");
        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        allSongs = await response.json();
        currentPage = 1; // Reset pagination
        displayResults();
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch songs.");
    }
});

// ✅ Pagination Controls
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayResults();
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage * resultsPerPage < allSongs.length) {
        currentPage++;
        displayResults();
    }
});

// ✅ Display Songs with Pagination
function displayResults() {
    let resultsDiv = document.getElementById("ht_results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (allSongs.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    // Calculate start and end index for pagination
    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const paginatedSongs = allSongs.slice(start, end);

    let table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Quantity</th>
            <th>Action</th>
        </tr>
    `;

    paginatedSongs.forEach(song => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td><strong>${song.title}</strong></td>
            <td>${song.artist}</td>
            <td>${song.year}</td>
            <td>$${song.price}</td>
            <td>${song.quantity}</td>
        `;

        // 🛒 Quantity Input
        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.max = song.quantity;
        quantityInput.style.width = "50px";

        let quantityCell = document.createElement("td");
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        // 🛒 Buy Button
        let buyButton = document.createElement("button");
        buyButton.textContent = "Buy";
        buyButton.addEventListener("click", async () => {
            const quantity = parseInt(quantityInput.value);

            if (quantity < 1 || quantity > song.quantity) {
                alert("Invalid quantity selected!");
                return;
            }

            try {
                const buyResponse = await fetch(`http://localhost:3000/songs/buy/${song.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity })
                });

                const result = await buyResponse.json();

                if (buyResponse.ok) {
                    alert(`Purchased ${quantity} copies of "${song.title}"!`);
                    song.quantity -= quantity; // Update displayed stock
                    row.cells[4].textContent = song.quantity; // Update stock cell
                } else {
                    alert(result.error);
                }
            } catch (error) {
                alert("Error processing the purchase.");
                console.error("Buy error:", error);
            }
        });

        let actionCell = document.createElement("td");
        actionCell.appendChild(buyButton);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    resultsDiv.appendChild(table);

    // ✅ Update Page Number Display
    document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
}
