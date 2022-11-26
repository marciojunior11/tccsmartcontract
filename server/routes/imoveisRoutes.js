const ctrlImoveis = require('../controllers/ctrlImoveis');

function imoveisRoutes(req, res) {
    if(req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
    } else if (req.method === 'GET') {
        ctrlImoveis.getAll(req, res);
    } else if(req.method === 'POST') {
        ctrlImoveis.create(req, res);
    } else if (req.method === 'DELETE') {
        ctrlImoveis.deleteToken(req, res);
    }
}

module.exports = {
    imoveisRoutes
}