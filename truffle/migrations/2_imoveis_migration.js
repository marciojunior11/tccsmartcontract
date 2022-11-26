const Imoveis = artifacts.require("Imoveis");

module.exports = function (deployer) {
    deployer.deploy(Imoveis);
};