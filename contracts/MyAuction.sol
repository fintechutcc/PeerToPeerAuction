pragma solidity ^0.5.0;

import "./Auction.sol";

contract MyAuction is Auction {

    constructor(
        uint256 _biddingTime,
        address _owner,
        string memory _brand,
        string memory _Rnumber
    ) public {
        auction_owner = _owner;
        auction_start = now;
        auction_end = auction_start + _biddingTime * 1 hours;
        STATE = auction_state.STARTED;
        MyCar.Brand = _brand;
        MyCar.Rnumber = _Rnumber;
    }

    function bid() public payable an_ongoing_auction returns (bool) {
        require(
            bids[msg.sender] + msg.value > highestBid,
            "You can't bid, Make a higher Bid"
        );
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);
        bids[msg.sender] = bids[msg.sender] + msg.value;
        emit BidEvent(highestBidder, highestBid);

        return true;
    }

    function cancel_auction()
        external
        only_owner
        an_ongoing_auction
        returns (bool)
    {
        STATE = auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", now);
        return true;
    }

    function destruct_auction() external only_owner returns (bool) {
        require(
            now > auction_end,
            "You can't destruct the contract,The auction is still open"
        );
        for (uint256 i = 0; i < bidders.length; i++) {
            assert(bids[bidders[i]] == 0);
        }

        // Must convert address to payable address before destruct
        selfdestruct(address(uint160(auction_owner)));
        return true;
    }

    function withdraw() public returns (bool) {
        require(
            now > auction_end,
            "You can't withdraw, the auction is still open"
        );
        uint256 amount;

        amount = bids[msg.sender];
        bids[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    function get_owner() public view returns (address) {
        return auction_owner;
    }
}
