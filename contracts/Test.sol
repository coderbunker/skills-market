pragma solidity ^0.4.0;

contract Test {
    function sell(address transferTo)
      public
      payable // make function payable
    {
      // change the amount to the amount sent with the call (msg.value)          
      transferTo.transfer(msg.value);
    }
}
