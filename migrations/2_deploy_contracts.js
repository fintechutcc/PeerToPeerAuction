var MyAuction = artifacts.require("MyAuction");

module.exports = function(deployer) {
    deployer.deploy(MyAuction,"0xD5659F4f11f44956025b57ABc6A73106fbbeb584", 1, "Toyota Cross", "1111");
}