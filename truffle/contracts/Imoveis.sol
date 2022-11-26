// contracts/Imoveis.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Imoveis is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Imoveis", "IMV") {}

    function criarToken(address proprietario, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 idImovel = _tokenIds.current();
        _mint(proprietario, idImovel);
        _setTokenURI(idImovel, tokenURI);

        _tokenIds.increment();
        return idImovel;
    }

    function getCurrentId() external view returns (uint256) {
        uint256 id = _tokenIds.current();
        return id;
    }

    function transferirToken(address from, address to, uint256 id, string memory tokenURI) public returns (uint256) {
        _transfer(from, to, id);
        _setTokenURI(id, tokenURI);
        return id;
    }
}