const main = async () => {
 const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
 const waveContract = await waveContractFactory.deploy({
   // `value` instructs this contract be deployed w an inital funding of 0.001 ethers, extracting from users wallet
   // this is a minimal amount as greater expenses would be wasted
   value: hre.ethers.utils.parseEther('0.001'),
 });

 await waveContract.deployed();

 console.log('WavePortal address: ', waveContract.address);
};

const runMain = async () => {
 try {
   await main();
   process.exit(0);
 } catch (error) {
   console.error(error);
   process.exit(1);
 }
};

runMain();