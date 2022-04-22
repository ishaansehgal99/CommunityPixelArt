//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Pixel.sol";


contract PixelManager {
    // Stores all the pixels
    Pixel[] public pixels;
    // Maps each Pixel to its address
    mapping(uint => address) public _pixelMap;
    // Maps each Pixel to whether its been changed
    mapping(uint => bool) public _pixelChangedMap;

    uint256 width = 1920;
    uint256 height = 384;

    event mintToken(address to, uint256 amount);

    function mint() public {
        uint pixel_num = pixels.length;

        if (pixel_num >= width * height) {
            // No more pixels can be issued
            return;
        }
        uint n_width = pixel_num / width;
        uint n_height = pixel_num % width;
        
        pixels.push(new Pixel(n_width, n_height));
        _pixelMap[pixel_num] = msg.sender;
        _pixelChangedMap[pixel_num] = false;

        emit mintToken(msg.sender, 1);
    }

    function changePixel(
        uint256 xcoord, uint256 ycoord,
        uint256 r, uint256 g, uint256 b) public {
        uint pixel_num = xcoord * width + ycoord; 
        if(!_pixelChangedMap[pixel_num]){
            pixels[pixel_num].changePixelColor(r, g, b); 
            _pixelChangedMap[pixel_num] = true;   
        } else {
            // You have already changed your pixel
        }
    } 
}
