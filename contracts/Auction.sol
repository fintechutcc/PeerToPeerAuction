pragma solidity ^0.5.0;

contract Auction {
    address internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;

    enum auction_state {CANCELLED, STARTED}

    struct car {
        string Brand;
        string Rnumber;
    }
    car public MyCar;
    address[] bidders;

    mapping(address => uint256) public bids;

    auction_state public STATE;

    modifier an_ongoing_auction() {
        require(now <= auction_end);
        _;
    }

    modifier only_owner() {
        require(msg.sender == auction_owner);
        _;
    }

    function bid() public payable returns (bool) {}

    function withdraw() public returns (bool) {}

    function cancel_auction() external returns (bool) {}

    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);
}