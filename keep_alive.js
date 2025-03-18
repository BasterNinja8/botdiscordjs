const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Le bot est en ligne !');
});

function keepAlive() {
    app.listen(1000, () => {
        console.log('🚀 Serveur en ligne sur le port 3000 !');
    });
}

module.exports = keepAlive;
