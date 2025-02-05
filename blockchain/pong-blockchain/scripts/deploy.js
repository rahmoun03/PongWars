const { ethers } = require('hardhat');

async function main() {
    const TournamentDetails = await ethers.getContractFactory("TournamentDetails");

    const tournamentDetails = await TournamentDetails.deploy();

    await tournamentDetails.deployed();

    console.log("TournamentDetails deployed to:", tournamentDetails.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
