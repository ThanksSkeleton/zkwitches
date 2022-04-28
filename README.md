# The Witches of Zader-Klaus - ZKWitches

 A social deduction game using ZK technology. This game is under development, and currently incomplete. Check TODO.md for current work status.

## Player's Summary of the Game
This is a dapp 4 player game turn based card game involving resource management and social deduction.

Players ante up some $$$ at the start of the game. Winner takes all. 

If a player takes too long on their turn, they can be kicked from the game by another player (they lose).

The objective of the game is to become the most prosperous town by accumulating 10 food and 10 lumber. 

At the start of the game, each player makes a secret selection of 0-3 citizens each of farmers, lumberjacks, brigands, and inquisitors. 

They also may select a witch for any type instead of a normal  citizen. A witch can do the work of up to 3 citizens, but is vulnerable to accusations of witchcraft.

A player selects 7 total citizens, which are secret and never fully revealed (but may be inferred).

Players can use these citizens to gather resources, steal from other players and accuse enemies of witchcraft.

### Citizen Action General Info

There are 4 power levels for each action. 

The weakest form of the citizen action can be performed even with 0 of that citizen type.

You can choose to perform a weaker action even if you have the citizens to perform a stronger action. 

A witch of that type allows you to perform up to the strongest version. 

### Citizen Actions

Farmers gather 1/2/3/4 food

Lumberjacks gather 1/2/3/4 lumber

Brigands either trade or steal
* 0 Brigands : Trade 2 resources for 1 Resource
* 1 Brigand: Trade 1 resource for 1 Resource
* 2 Brigand: Steal 1 Resource
* 3 Brigands: Trade 1 Resource for 2 Resources

Inquisitors: Inquisitors accuse other towns of witchcraft, which costs resources. 

The targetted player must prove they do not have a witch of the specific type accused. If they prove that they don't, they recieve those resources used in the accusation.

If they decline to prove their innocence, the witch is driven from their town, and they must pay the inquisitor 3 food and 3 lumber. 

If they can't pay, they lose.

* 0 Inquisitors: Inquisition costs 4 food and 4 lumber
* 1 Inquisitors: Inquisition costs 3 food and 3 lumber
* 2 Inquisitors: Inquisition costs 2 food and 2 lumber
* 3 Inquisitors: Inquisition costs 2 food OR 2 lumber

### Game Over

The game ends immediately when the winning player accumulates 10 food and 10 lumber, or all other players have lost. That player takes the ante. 

## Technical Summary of the Game:
This is a dapp game with no additional backend. 
This game follows this basic flow:

* Players join a game with pre-committed "hands" that they choose via a api call that also transfers $$$ into the contract. 
* A circuit validates that "hand" is valid, and a proof is provided of this along with a commitment hash HASH(salt+hand). The player stores their hand and salt locally.
* Once all players have joined, the game proceeds to the first player
* Players call action apis when it is their turn. Out of turn calls are rejected. current turn is tracked by a state machine
* On most actions, a player must provide a proof that they are capable of doing that action, either by having enough citizens of that type or having a witch. 
* They need to provide their hand and a salt to a circuit, and prove that their hand has some property, and is the same as the previously committed hand.
* Some actions do not require proofs 
* A player must respond to an witch accusation out of turn. They call an api that submit a proof that they do not have that witch, or call an API acknowledging that they do.
* All Business logic is enforced in both contract AND UI client
* If it is a player's turn to act but X number of blocks have elapsed, any player may call the KICK() API and cause that player to lose
* Players can surrender
* Lost players automatically lose their turns

## Technologies Used: 

* Solidity for contracts
* Circom for circuits
* React for Frontend

## Datatypes:

* Public game data: CurrentGameStateEnum, PlayerExpectedToAct, last action block#, eliminatedPlayers[]
* Public player data - on contract - isAlive, address, handCommitment, Food, Lumber, EliminatedWitches[]
* Private player data - client side - Hand (citizen count + witch selection), Salt

## Hand Datatype: 

FarmerCount 0-3

LumberjackCount 0-3

BrigandCount 0-3

InquisitorCount 0-3

FarmerWitch bool

LumberjackWitch bool

BrigandWitch bool

InquisitorWitch bool

## Proofs/Circuits:

### Initial Setup

Poseidon(IdCommitment + PackedCounts(...)) => Hash
FarmerCount + LumberjackCount + BrigandCount + InquisitorCount + Witch+Witch+Witch+Witch == 7

### Action x>0

Poseidon(IdCommitment + PackedCounts(...)) == Hash
xCount >= x || (Witch == 1 && Witch_Alive == 0)

### No Witch

Poseidon(IdCommitment + PackedCounts(...)) == Hash
Witch == 0 || Witch_Alive == 0

## Smart Contract Methods (Public API)

### Meta_Actions

Player_Register(proof , $$$)

Surrender()

KickCurrentPlayer()

### Zero_Actions (No Proofs)

Farm_0()

Lumber_0()

Steal_0(otherplayer)

Accuse_0(otherplayer)


### NonZeroActions (Requires Proofs)

Farm_1_3(proof)

Lumber_1_3(proof)

Steal_1_3(proof, otherplayer)

Accuse_1_3(proof, otherplayer)

### Respond to accusation

Respond_Proof(proof)

RespondNoProof()

## State Machine States

WaitingForPlayersToStart

PlayerXTurn(player)

PlayerXRespondingToAccusation(player)







