// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;// Version may need to be specified depending on local environment

/// @title A simulator for waves
/// @author Sardaukar
/// @notice This contract's primary use is a basic simulation
/// @dev All function calls cause no side effects

import "hardhat/console.sol";

contract WavePortal {
    /// @notice totalWaves is a State variable that inits to 0
    uint256 totalWaves;
    uint256 private seed;

    
    /// @notice `event` is an inheritable member of a contract. `event`'s are emitted, arguments passed are stored in
    /// Txn logs. Said logs are stored on the blockchain and are accessible using the address of the contract
    /// till the contract is present of the blockchain. An event generated is NOT accessible from within contracts,
    /// not even the one which have created and emitted them.
    
    event NewWave(address indexed from, uint256 timestamp, string message);

    
    /// @notice A Struct is a custom datatype where we can customize what we want to hold within it as long as it is
    /// NOT an additional Struct.
    struct Wave {
        address waver;// address of the user who CHANTED
        string message;// the msg the user sent
        uint256 timestamp;// the timestamp of when the user CHANTED
    }

    /// @notice We declare a variable `waves` that allows us to store an Array of Structs
    Wave[] waves;

    /// @notice This is an address => uint mapping, meaning the address is associated with a number!
    /// We store the address with the last time the user CHANTED at us.
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        /// @notice Payable ensures that ethereum is able to be sent to and from this contract
        console.log("We have been constructed! Bless the maker");
        /// @notice Initial seed is set here
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /// @notice We need to make sure the current timestamp is at least 45-seconds bigger(longer? idk) than
        /// the last timestamp we stored.
        /// `_message` is what the user sends from the frontend.
        require(
            /// @notice msg.sender is the address of the function caller
            lastWavedAt[msg.sender] + 15 seconds < block.timestamp,
            "Wait 15s"
        );

        
        /// @notice Update the current timestamp we have for the user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has CHANTED!", msg.sender);

        /// @notice This is where our CHANTS are stored within an Array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        
        /// @notice Generate a new seed for the next user that sends a CHANT
        /// We take `block.difficulty` and `block.timestamp` and combine them both to simulate a random number.
        /// `block.difficulty` tells miners how difficult the block will be to mine based on # of Txns in such
        /// `block.timestamp` is the Unix timestamp that the block is being processed.
        /// The `seed` variable will change each time a new CHANT is sent.
        /// All three are combined to created an effectively random value. (% 100 ensures our range is 0 - 100)
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            /// @notice `prizeAmount` init's a prize amount of `ether`, representing a (winning) monetary amount.
            /// `require` operates similar to `if` Statements and ensures our contract is properly funded
            /// `bool` exhibits boolean logic
            /// `balance` represents the balance of the contract itself as we need funding to be able reward users.
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        
        /// @notice An `emit` triggers an `event` in Solidity. The contract will wait/watch for deployment, then react
        /// to said `event`
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    /// @notice Retrieves total number of CHANTS
    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}