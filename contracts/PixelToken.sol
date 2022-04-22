// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PixelToken is ERC721 {
    address public owner; 
    // uint256 tokenId = 1; 

    struct Token {
        uint tokenId; 
        string tokenName; 
        address owner; 
    }

    Token[] public allTokens; 

    mapping(address => Token[]) public tokenAddress;
    // mapping(string => bool) public tokenExists; 

    uint width = 10;
    uint height = 10;
    bool[10] tokenExists;

    // mapping(uint256 => bool) public tokenExists; 

    constructor() ERC721("PixelToken", "PXT"){
        owner = msg.sender; 
    }

    function getUserAddress() public view returns(address){
        return msg.sender;
    }

    function getAllTokens() public view returns (Token [] memory){
        return allTokens; 
    }

    function getMyTokens() public view returns (Token [] memory) {
        return tokenAddress[msg.sender]; 
    }

    function mintToken() public payable {
        // require(!tokenExists[_tokenName], "Token already exists"); 

        // Get the next available pixel space - and use that as the tokenName
        // tokenExists will have width * height (of image) # of entries


        for(uint id = 0; id < tokenExists.length; id++) {
            if (tokenExists[id] == false) {
                _safeMint(msg.sender, id);

                // Convert 1d coordinate to 2d space
                // uint n_width = id / width;
                // uint n_height = id % width;

                allTokens.push(Token(id, '', msg.sender)); 

                tokenAddress[msg.sender].push(Token(id, '', msg.sender));

                tokenExists[id] = true; 
                break;

                // tokenId++;
            }
        }

        // All Token spaces taken
        
    }

    // function compareStrings(string memory a, string memory b) public view returns (bool) {
    //     return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    // }

    function burnToken(uint256 _tokenId) public payable returns (bool) {
        if(!tokenExists[_tokenId]){
            return false;
        }

        // Remove tokenId from tokenExists
        tokenExists[_tokenId] = false; 
        
        // remove tokenId from allTokens
        for(uint i = 0; i < allTokens.length; i++) {
            if(allTokens[i].tokenId == _tokenId){
                allTokens[i] = allTokens[allTokens.length-1];
                allTokens.pop();
                break;
            }
        }

         // remove tokenId from token_address
        for(uint i = 0; i < tokenAddress[msg.sender].length; i++) {
            if(tokenAddress[msg.sender][i].tokenId == _tokenId){
                tokenAddress[msg.sender][i] = tokenAddress[msg.sender][tokenAddress[msg.sender].length-1];
                tokenAddress[msg.sender].pop();
                break;
            }
        }

        _burn(_tokenId);

        return true;
    }

}