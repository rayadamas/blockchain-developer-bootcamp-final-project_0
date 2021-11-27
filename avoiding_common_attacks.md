Avoiding Common Attacks
The following measures were applied in the `sardaukar.sol` contract to avoid common security pitfalls:

Proper setting of visibility for functions: Functions are specified as being _external_, _public_, _internal_ or _private_ to reduce the attack surface of a contract system. - [SWC-100](https://swcregistry.io/docs/SWC-100)
Using Specific Compiler Pragma: Solidity 0.8.0 is used in `sarduakar.sol`, it is advised the developer may need to alter the floating pragma. - [SWC-103](https://swcregistry.io/docs/SWC-103)
Proper Use of _Require_ and _bool_: Using **require** in conjunction with **bool** to to ensure the `sardaukar.sol` has sufficient funding in order to reward a random CHANTER.
