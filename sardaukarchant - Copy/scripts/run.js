const main = async () => {
 // waveContractFactory compiles contract + generates files needed in `./artifacts` 
 const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
 /*
  * Hardhat creates a local ETH network for you, JUST for THIS contract. After script completion it will DESTRUCT
  This process can be repeated.
  `hre` & `hre.ethers` (Hardhat Runtime Environment) is an onj containing all the functionality that Hardhat
  exposes when running a task, test, or scrpit. In reality, Hardhart is HRE.
  */
 const waveContract = await waveContractFactory.deploy({
   // `value` instructs this contract be deployed w an inital funding of 0.1 ethers, extracting from users wallet
   value: hre.ethers.utils.parseEther('0.1'),
 });
 // We patiently wait until the contract is deployed locally
 await waveContract.deployed();
 // How we are able to locate our contract on the blockchain
 console.log('Address of Contract:', waveContract.address);

 let contractBalance = await hre.ethers.provider.getBalance(
   waveContract.address
 );
 console.log(
   'Contract balance:',
   hre.ethers.utils.formatEther(contractBalance)
 );

 
 /*
 * Additional CHANTS commented out. Adjust cooldown time to test.
 */
 const waveTxn = await waveContract.wave('This is the first CHANT');
 await waveTxn.wait();

  //  const waveTxn2 = await waveContract.wave('This is wave #2');
  //  await waveTxn2.wait();
  // We see what has happened to our balance after deploying/CHANTING
 contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
 console.log(
   'Contract funding:',
   hre.ethers.utils.formatEther(contractBalance)
 );

 let allWaves = await waveContract.getAllWaves();
 console.log(allWaves);
};

const runMain = async () => {
 try {
   await main();
   process.exit(0);
 } catch (error) {
   console.log(error);
   process.exit(1);
 }
};

runMain();