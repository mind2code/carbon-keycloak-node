import express from 'express';
import bodyParser from 'body-parser';
// 1
import session from 'express-session';
import Keycloak from 'keycloak-connect';

const app = express();
app.use(bodyParser.json());

// 2
const memoryStore = new session.MemoryStore();

app.use(
    session({
        secret: 'secretKey',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
);

// 3
const keycloak = new Keycloak({
    store: memoryStore
});

app.use(
    keycloak.middleware({
        logout: '/logout',
        admin: '/'
    })
);

app.get('/api/unsecured', function(req, res) {
    res.json({ message: 'This is an unsecured endpoint payload' });
});

// 4
app.get('/api/user', keycloak.protect('realm:commercial'), function(req, res) {
    res.json({ message: 'This is an USER endpoint payload' });
});

app.get('/api/admin', keycloak.protect('realm:technicien'), function(req, res) {
    res.json({ message: 'This is an ADMIN endpoint payload' });
});

app.listen(3000, err => {
    if (err) {
        console.error(err);
    }
    {
        console.log(`APP Listen to port : 3000`);
    }
});