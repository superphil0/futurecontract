pragma solidity ^0.4.9;

import "std.sol";

contract Contract is owned {
// an offer consists of the adress of the seller, an excercise date, an idication if the contract has been sold,
// the amount and price of the goods offered (i.e. 1 ton of pumpkin)
  struct Offer {
    uint exercise_date;
    bool sold;
    uint amount;
    uint price;
    address buyer;
  }
  
  // This holds all offers which are made
  Offer[] public offers;
  
  // This function can be called by the Farmer who sells pumpkins, he can place an offer with it
  function makeOffer(uint amount, uint exercise_date, uint price) {
    offers.push(Offer({
      amount: amount,
      exercise_date: exercise_date,
      price: price,
      sold: false,
      buyer: 0,
      seller: msg.sender
    }));
    
  }
  
  // this function can be called by a potential buyer, he has to provide the id of the offer he wants to buy
  // additionally he has to include the correct price in form of ethereum
  // as always the caller has to make sure to provide enough gas
  function makeBid(uint offerId) payable
  {
  // check if the offer is still valid and if enough ethereum was provided
    if(now > offers[offerId].exercise_date || 
       offers[offerId].sold ||
       offers[offerId].price > msg.value)
    {
      throw;
    }
 
    offers[offerId].buyer = msg.sender;
    offers[offerId].sold = true;
    
    // actually send the money
    offers[offerId].seller.transfer(offers[offerId].price);
    
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
