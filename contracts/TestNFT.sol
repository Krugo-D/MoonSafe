// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
 
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
//import '@openzeppelin/contracts/access/Ownable.sol';
 
abstract contract Auth {
    address internal owner;
    mapping (address => bool) internal authorizations;

    constructor(address _owner) {
        owner = _owner;
        authorizations[_owner] = true;
    }

    modifier onlyOwner() {
        require(isOwner(msg.sender), "!OWNER"); _;
    }

    modifier authorized() {
        require(isAuthorized(msg.sender), "!AUTHORIZED"); _;
    }

    function authorize(address adr) public onlyOwner {
        authorizations[adr] = true;
    }

    function unauthorize(address adr) public onlyOwner {
        authorizations[adr] = false;
    }

    function isOwner(address account) public view returns (bool) {
        return account == owner;
    }

    function isAuthorized(address adr) public view returns (bool) {
        return authorizations[adr];
    }

    function transferOwnership(address payable adr) public onlyOwner {
        owner = adr;
        authorizations[adr] = true;
        emit OwnershipTransferred(adr);
    }

    event OwnershipTransferred(address owner);
}


contract TestNft is ERC721, Auth  {
 
    uint16[100] public ids;
    uint16 private index;
    bool public launched = false;
 
    constructor() Auth(msg.sender) ERC721('TestNFT', 'TNFT') {
    }
 
    function launch() public view onlyOwner {
        require(launched == false);
        launched == true;
    }

    // Private mint function available before/during presale
    function presaleMint(address[] calldata _to) external onlyOwner {
        require(msg.sender == tx.origin);
        for (uint256 i = 0; i < _to.length; i++) {
            uint256 _random = uint256(keccak256(abi.encodePacked(index++, msg.sender, block.timestamp, blockhash(block.number-1))));
            _safeMint(_to[i], _pickRandomUniqueId(_random));
        }
    }

    //// Public mint function available after presale
    //function mint(address[] calldata _to) external {
    //    require(msg.sender == tx.origin);
    //    for (uint256 i = 0; i < _to.length; i++) {
    //        uint256 _random = uint256(keccak256(abi.encodePacked(index++, msg.sender, block.timestamp, blockhash(block.number-1))));
    //        _safeMint(_to[i], _pickRandomUniqueId(_random));
    //    }
    //}

    function _pickRandomUniqueId(uint256 random) private returns (uint256 id) {
        uint256 len = ids.length - index++;
        require(len > 0, 'no ids left');
        uint256 randomIndex = random % len;
        id = ids[randomIndex] != 0 ? ids[randomIndex] : randomIndex;
        ids[randomIndex] = uint16(ids[len - 1] == 0 ? len - 1 : ids[len - 1]);
        ids[len - 1] = 0;
    }
 
}