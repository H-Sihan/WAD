// index.mjs - CLIENT SIDE code, runs in the browser

async function ajaxSearch(productType) {
    try {
        // Send a request to our remote URL
        const response = await fetch(`https://127.0.0.1:3000/songs/artist/${productType}`);

        // Await the extraction of the text from the response
        const text = await response.text();

        // Add the text to the div
        document.getElementById('results').innerHTML = text;
    } catch(e) { 
        // Handle promise rejections
        alert(e);
    }
}

//readme:
// start to end.

// Make the AJAX run when we click a button
document.getElementById('ajaxButton').addEventListener('click', ()=> {
    // Read the product type from a text field
    const product = document.getElementById('productType').value;
    ajaxSearch(product);
});