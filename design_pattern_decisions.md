**Design pattern decisions**
The following design patterns were implemented in [sardaukar.sol](https://github.com/rayadamas/sardaukarchantFoldinsideREPLITFold/blob/master/sardaukarchant%20-%20Copy/contracts/sardaukar.sol) and [App.js](https://github.com/rayadamas/sardaukarchantFoldinsideREPLITFold/blob/master/src/App.js)

**Access Control Design Patterns**
The `sardaukar.sol` contract is using the convenience function **require** in the `wave` function to aid in throwing an exception should an additional wave(CHANT) be called by a user.
This aids in preventing the contract from being spammed by external calls.

**Inheritance and Interfaces**
The `sardaukar.sol` contract inherites Hardhat.

**Gas Optimization**
The `App.js` script within the `src` directory is using the `gasLimit` parameter within the `waveTxn` constant withing our import of the original `wave` function from our contract to allow Metamask to have a value to reference as to ensure this contract is able to be run contingent on how much our added randomness adds variance to the various conputational executions.


