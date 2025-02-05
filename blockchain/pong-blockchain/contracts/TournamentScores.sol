// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentDetails {

    struct Player {
        string name;
        uint256 score;
        uint256 rank;
    }

    struct Tournament {
        string name;
        Player[] players;
        uint256 timestamp;
    }

    Tournament[] public tournaments;

    event TournamentAdded(string tournamentName, Player[] players, uint256 timestamp);

    function addTournament(
        string memory name,
        string[4] memory playerNames, 
        uint256[4] memory playerScores, 
        uint256[4] memory playerRanks
    ) public {
        Tournament storage newTournament = tournaments.push();

        newTournament.name = name;
        newTournament.timestamp = block.timestamp;

        for (uint256 i = 0; i < 4; i++) {
            newTournament.players.push(Player(playerNames[i], playerScores[i], playerRanks[i]));
        }

        emit TournamentAdded(name, newTournament.players, newTournament.timestamp);
    }

    function getTournaments() public view returns (Tournament[] memory) {
        return tournaments;
    }
}
