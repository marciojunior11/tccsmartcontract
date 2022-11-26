const Imoveis = artifacts.require('Imoveis');
const assert = require('assert');
const { isTypedArray } = require('util/types');

contract('Imoveis', async (accounts) => {
        const instance = await Imoveis.deployed();

        const response = await instance.criarToken(accounts[0], 'https://gateway.pinata.cloud/ipfs/QmTmEv2sYWgDAaymJEfcNQYwyKJAxYjXdDpHCn9TxZaDvj');
        console.log(response);
})