const express = require('express');
const bodyParser = require('body-parser');
// 1
const session = require('express-session');
const Keycloak = require('keycloak-connect');
//var { Kafka } = require('kafkajs');

const fs = require('fs')
const carbone = require('carbone')

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

/*app.get('/api/unsecured', function(req, res) {
    res.json({ message: 'This is an unsecured endpoint payload' });
});*/



// 4
app.get('/api/user', keycloak.protect('realm:commercial'), function(req, res) {
    res.json({ message: 'This is an USER endpoint payload' });
});

app.post('/api/reports/abonnements', keycloak.protect('realm:commercial'),async function(req, res) {

     /* const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092'],
    }); */

    const data = req.body;
    console.log(data);

    var options = {
        convertTo: 'pdf'
    };

    // const producer = kafka.producer()

    // await producer.connect()

    var contents = '';
    carbone.render('./templates/abonnement.odt', data, options,async function (err, result) {
        if(err) return console.log(err);

        fs.writeFileSync('abonnement.pdf', result);
         contents = fs.readFileSync('./abonnement.pdf', {encoding: 'base64'});
        /* await producer.send({
            topic: 'queue.reports',
            messages: [
                { value: JSON.stringify({ data : contents}) },
            ],
        });
        await producer.disconnect() */
        //console.log(contents)
        //process.exit();
    });

    res.json({ data : contents });
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