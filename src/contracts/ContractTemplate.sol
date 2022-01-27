// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract ContractFactory is ERC721, Ownable {
    string public baseURI;
    // NOTE: we may want to make MAX_SUPPLY a constant upon creation
    uint256 public maxSupply;
    uint256 public totalSupply;
    address public contractStore;

    event SetContractStore(address contractStore);
    event SetBaseURI(string baseURI);

    constructor(
        string memory __name,
        string memory __symbol,
        string memory __baseURI,
        string memory __maxSupply
    ) ERC721(__name, __symbol) {
        baseURI = __baseURI;
        maxSupply = __maxSupply;
    }

    modifier onlyOwnerOrStore() {
        require(
            contractStore == msg.sender || owner() == msg.sender,
            "caller is neither contractStore nor owner"
        );
        _;
    }

    function setContractStore(address _contractStore) external onlyOwner {
        contractStore = _contractStore;
        emit SetContractStore(_contractStore);
    }

    function setBaseURI(string memory __baseURI) external onlyOwner {
        baseURI = __baseURI;
        emit SetBaseURI(__baseURI);
    }

    // internal = only seen here, view = view-only, virtual = explicit override
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public onlyOwnerOrStore {
        require(totalSupply < max_supply, "Exceeds max supply");
        _mint(to, totalSupply);
        totalSupply += 1;
    }
}
