async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);

    if (res.ok) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('actions').style.display = 'block';
    }
}

async function logout() {
    const res = await fetch('/logout', { method: 'POST' });
    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);

    document.getElementById('login-form').style.display = 'block';
    document.getElementById('actions').style.display = 'none';
}

async function getDashboard() {
    const res = await fetch('/dashboard');
    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}

async function addProduct() {
    const res = await fetch('/addProduct', { method: 'POST' });
    const data = await res.json();
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}
