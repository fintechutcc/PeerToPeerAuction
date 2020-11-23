var MyAuction = artifacts.require("MyAuction");

module.exports = function(deployer) {
    deployer.deploy(MyAuction);
}