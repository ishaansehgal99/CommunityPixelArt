//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Pixel
{
    uint256 _xcoord;
    uint256 _ycoord;

    struct PixelColor {
        uint256 _r;
        uint256 _g;
        uint256 _b;
    }

    PixelColor _col;

    constructor(
        uint256 _x, 
        uint256 _y
    ) {
        _xcoord = _x;
        _ycoord = _y; 
        _col = PixelColor(0,0,0);
    }

    event ColorChange(uint256 r, uint256 g, uint256 b);

    function changePixelColor(uint256 r, uint256 g, uint256 b) public
    {
        _col = PixelColor(r, g, b);
        emit ColorChange(r, g, b);
    }
}
