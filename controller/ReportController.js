const express = require('express')
const router = express.Router();
const keycloak = require('../config/keycloak-config.js').getKeycloak();

const fs = require('fs')
const carbone = require('carbone')

router.post('/reports', keycloak.protect('realm:commercial'), function(req,res) {
    const data = req.body;
    console.log(data);

    var options = {
        convertTo: 'pdf'
    };

    var contents = '';
    carbone.render('./node_modules/carbone/examples/simple.odt', data, function (err, result) {
        if(err) return console.log(err);

        fs.writeFileSync('results.odt', result);
        const contents = fs.readFileSync('./results.odt', {encoding: 'base64'});
        console.log(contents)
        process.exit();
    });

    res.send(contents);
});

module.exports = router;