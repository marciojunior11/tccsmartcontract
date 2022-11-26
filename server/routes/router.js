const { imoveisRoutes } = require('./imoveisRoutes');

function router(req, res) {
    if (req.url.includes('/imoveis')) {
        imoveisRoutes(req, res);
    }
}

module.exports = {
    router
}