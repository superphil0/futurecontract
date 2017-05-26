pragma solidity ^0.4.9;

import "std.sol";

contract Contract is owned {

  struct Offer {
    uint exercise_date;
    bool sold;
    uint amount;
    uint price;
    address buyer;
  }
  
  Offer[] public offers;
  function makeOffer(uint amount, uint exercise_date, uint price) {
    offers.push(Offer({
      amount: amount,
      exercise_date: exercise_date,
      price: price,
      sold: false,
      buyer: msg.sender
    }));
    
  }
  
  function makeBid(uint offerId) payable
  {
    if(now > offers[offerId].exercise_date || 
       offers[offerId].sold ||
       offers[offerId].price > msg.value)
    {
      throw;
    }
 
    offers[offerId].buyer = msg.sender;
    offers[offerId].sold = true;
  }
  
    // Fallback function - Called if other functions don't match call or
    // sent ether without data
    // Typically, called when invalid data is sent
    // Added so ether sent to this contract is reverted if the contract fails
    // otherwise, the sender's money is transferred to contract
    function () {
        throw; // throw reverts state to before call
    }
}
