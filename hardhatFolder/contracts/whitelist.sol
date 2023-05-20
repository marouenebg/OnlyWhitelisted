//SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract whitelist {

uint8 public MaxWhitelistAddresses;
uint8 public NumberWhitelistedAddresses;

mapping (address => bool ) public  WhitelistedAddress;
constructor (uint8 _MaxWhitelistAddresses) {
   MaxWhitelistAddresses =  _MaxWhitelistAddresses;
}

function addAddressToWhitelist() public {
    require(NumberWhitelistedAddresses < MaxWhitelistAddresses, "Max Whitelist address exceeded");
    require(!WhitelistedAddress[msg.sender], "Sender has already been whitelisted");
    WhitelistedAddress[msg.sender] = true;
    NumberWhitelistedAddresses = NumberWhitelistedAddresses + 1 ;
}

}