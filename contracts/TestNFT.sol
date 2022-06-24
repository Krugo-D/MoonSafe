// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
 
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
 
contract TestNft is ERC721  {
 
    uint16[100] public ids;
    uint16 private index;
 
    constructor() ERC721('TestNFT', 'TNFT') {}
 
     // Airdrop first X amount of random NFT's to Presale 
    function presaleMint(address[] calldata _to) external {
        require(msg.sender == tx.origin);
        for (uint256 i = 0; i < _to.length; i++) {
            uint256 _random = uint256(keccak256(abi.encodePacked(index++, msg.sender, block.timestamp, blockhash(block.number-1))));
            _safeMint(_to[i], _pickRandomUniqueId(_random));
        }
    }

    // Public mint function, opened up after presale airdrop
    function mint() external {
        require(msg.sender == tx.origin);
        uint256 _random = uint256(keccak256(abi.encodePacked(index++, msg.sender, block.timestamp, blockhash(block.number-1))));
        _safeMint(msg.sender, _pickRandomUniqueId(_random));
    }
 
    function _pickRandomUniqueId(uint256 random) private returns (uint256 id) {
        uint256 len = ids.length - index++;
        require(len > 0, 'no ids left');
        uint256 randomIndex = random % len;
        id = ids[randomIndex] != 0 ? ids[randomIndex] : randomIndex;
        ids[randomIndex] = uint16(ids[len - 1] == 0 ? len - 1 : ids[len - 1]);
        ids[len - 1] = 0;
    }
 
}