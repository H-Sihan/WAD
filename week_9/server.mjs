import express from 'express';
import Database from 'better-sqlite3';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';

const app = express();

app.use(express.json());

//Static files
app.use(express.static('./'));
app.use(express.urlencoded({ extended: true }));

const db = new Database('session.db');

const SQLiteStore = betterSqlite3Session(expressSession, db);

app.use(expressSession({
    store: new SQLiteStore(),
    secret: 'my-secret',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    proxy: true,
    cookie: {
        maxAge: 600000,
        httpOnly: false
    }
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);

    // Protect specific routes
    /*const protectedRoutes = ['/addProduct', '/dashboard'];
    if (protectedRoutes.includes(req.path) && !req.session.username) {
        return res.status(401).json({ error: "You're not logged in. Go away!" });
    }*/
    
    next();
});

function checkAuth(req, res, next) {
    if (!req.session.username) {
        return res.status(401).json({ error: "Please login" });
    }
    next();
}
/*const protectedRoutes = ['/addProduct', '/dashboard'];
    if (protectedRoutes.includes(req.path) && !req.session.username) {
        if (req.accepts('html')) {
            return res.redirect('/index.html'); // browser navigation
        } else {
            return res.status(401).json({ error: "You're not logged in. Go away!" });
        }
    }
*/

app.get('/time', (req, res) => {
    res.send(`There have been ${Date.now()} milliseconds since 1/1/70.`);
});

app.post('/login', (req, res) => {
    if(req.body.username == 'sihan' && req.body.password == '123'){
        req.session.username = req.body.username;
        res.json({username: req.body.username});
    } else {
        res.status(401).json({error: "Incorrect username and password"});
    }
});

app.post('/logout', (req, res) => {
    req.session = null;
    res.clearCookie('connect.sid');
    res.json({loggedout: true});
});

app.get('/dashboard', checkAuth, (req, res) => {
    res.json({message: 'Dashboard'})
});

app.post('/addProduct', checkAuth, (req, res) => {
    if(req.session.username == null) {
        res.status(401).json({error: "You're not logged in. Go away!"});
    } else {
        // code to add a product to the database
        res.status(200).json({message: "Products page"})
    }
});

app.listen(3000);