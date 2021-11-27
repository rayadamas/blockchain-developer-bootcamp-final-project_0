Design pattern decisions
The following design patterns were implemented in [sardaukar.sol](https://github.com/rayadamas/sardaukarchantFoldinsideREPLITFold/blob/master/sardaukarchant%20-%20Copy/contracts/sardaukar.sol)

Access Control Design Patterns
The `sardaukar.sol` contract is using the convenience function **require** in the `wave` function to aid in throwing an exception should an additional wave(CHANT) be called by a user.
This aids in preventing the contract from being spammed by external calls.

Inheritance and Interfaces
The `sardaukar.sol` contract inherites Hardhat.
