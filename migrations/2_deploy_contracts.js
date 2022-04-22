const PixelToken = artifacts.require("PixelToken"); 

module.exports = function (deployer) {
    deployer.deploy(PixelToken);
}

