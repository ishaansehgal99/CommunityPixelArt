// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PixelToken is ERC721 {
    address public owner; 
    uint256 tokenId = 1; 

    struct Token {
        uint tokenId; 
        string tokenName; 
        address owner; 
    }

    Token[] public allTokens; 

    mapping(address => Token[]) public tokenAddress;
    mapping(string => bool) public tokenExists; 

    constructor() ERC721("PixelToken", "PXT"){
        owner = msg.sender; 
    }

    function getAllTokens() public view returns (Token [] memory){
        return allTokens; 
    }

    function getMyTokens() public view returns (Token [] memory) {
        return tokenAddress[msg.sender]; 
    }

    function mintToken(string calldata _tokenName) public payable {
        require(!tokenExists[_tokenName], "Token already exists"); 
        _safeMint(msg.sender, tokenId);

        allTokens.push(Token(tokenId, _tokenName, msg.sender)); 

        tokenAddress[msg.sender].push(Token(tokenId, _tokenName, msg.sender));

        tokenExists[_tokenName] = true; 

        tokenId++;
    }

}