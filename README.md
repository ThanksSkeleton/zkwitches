# "The Witches of Zader-Klaus" - ZKWitches

ZKWitches is a game prototype that uses ZKProofs to play a hidden information game on-chain (EVM compatible chain).

- [How To Play](#summary-of-the-game-for-players)
- [Technical Notes + Implmentation](#technical-notes-on-the-game)

Watch the video summary!

https://www.youtube.com/watch?v=H34cf3wBk94

Contact me at ChrisCallagan@proton.me

# Summary of the Game for Players
This is a 4 player, turn based, secret information dapp card game with resource management and social deduction. The game is played on chain, and uses zk (zero knowledge) proofs to allow players to make validated moves without revealing their secrets.

At the start of the game, each player makes a secret selection of their village's citizens: a total of 7 citizens. Those citizens can be ordinary workers, or witches. Witches are powerful, but can be targetted by inquisitions, so players must choose their composition carefully. 

A player's hand (their villagers) is chosen secretly to begin with, and never fully revealed, even at the end of the game. However, it can be partially inferred by their actions and their response to other players' inquisitions. Does player #3 really have 3 lumberjacks harvesting all that lumber, or are they concealing a witch, who is cutting down trees with vile sorcery?

The objective of the game is to become the most prosperous town by accumulating 10 food and 10 lumber. 

## The Citizens

Players can have up to 3 normal citizens of each type - taking an action with 0 citizens yields the weakest effect, but is always available to all players. 

Farmers:

Gather Food. 0/1/2/3 farmers can gather 1/2/3/4 food 

Lumberjacks:

Gather Lumber. 0/1/2/3 lumberjacks can gather 1/2/3/4 lumber

Brigands:

Can force trades and steal Food or Lumber.

0 : Forced trade of your 2 food for their 1 lumber with another player.

1 : Forced trade of your 2 lumber for their 1 food with another player.

2 : Steal 1 food

3 : Steal 1 lumber 

Inquisitors:

Can eliminate the witches of other players.

In an inquisition, the targeted player proves they do not have a specific witch. If they cannot, they are assumed to be guilty, and they pay 2 food, and 2 lumber to the inquisitor, and their witch is banished forever. If they cannot pay the inquisitor's fee, they are eliminated from the game entirely.

0/1/2/3 inquisitors can launch a inquisition by spending 3/2/1/0 food and lumber.

## The Witches

Witches perform actions similar to normal citizens, but they are 3 times as strong, so a witch can perform the action of 3 normal citizens!

Each witch has a specific type - example: the lumberjack witch gathers lumber.

Witches can be eliminated if you are targeted by Inquisitors, at a hefty cost.

A player can only have a maximum of 1 witch of each type, but may have both witches and citizens of the same type.

## Game Over

The game ends when 3 players have surrendered or have been eliminated, or a player accumulates 10 food and 10 lumber.

# Technical Notes on the Game

This is a dapp game with no additional backend, just smart contracts written in Solidity. There is a game contract and 3 associated Verifier contracts that can verify proofs associated with the 3 circuits.

## Game Flow

* Players choose a "hand"/"village" of seven villagers. 
* A zk circuit validates that "hand" is valid by the rules of the game, and a proof is created of this along with a commitment hash - HASH(salt+hand). The player stores their hand and salt locally, on their machine. If the hand+salt are lost, the player cannot play the game. The hash is commited on-chain and associated with that player's address. 
* Once 4 players have joined, the game proceeds to the first player
* Players call action apis (which call the contract) when it is their turn. Out of turn calls are rejected. current turn is tracked by a state machine.
* On all contentious actions (actions that require some particular hand/village), a player must provide a zk proof that they are capable of doing that action, either by having enough citizens of that type or having a witch. 
* They need to provide their hand and a salt to a zk circuit, and create a proof of the following: their hand has some property AND has the same hash as the previously committed hand.
* Verifier contracts check that the proof is valid and the inputs match the current state of the game.
* Some actions do not require proofs, like performing actions that require no citizens of any type, or surrendering.
* A player must respond to an witch accusation, which occurs outside the normal flows of turns. They call an api that submit a proof that they do not have that witch, or call an API acknowledging that they do.
* All relevant game logic is enforced in both contract AND UI client
* (Not Implmented, but planned) - If it is a player's turn to act but X time has elapsed, any player may call the KICK() API and cause that player to lose the game
*  (Not Implmented, but planned) - Players can surrender.
* Players that have lost the game are skipped in the turn order.

## Git Repo Layout + How to Run ZKWitches locally

Currently a little rough around the edges... 

The ZKWitches repo contains the frontend and documentation for the entire project.
The ZKWitches_backend includes the game smart contract, the circuits, and the tooling to generate the verifier contracts + zkeys

The ZKWitches_backend npm command 'test:fullProof' will run through everything, including running a 1 particpant ceremony and generating verifier contracts and tests. This will also generate WASM files, ZKeys, and typescript schemas for contract interaction in 'export', which need to be manually copied over to the ZKWitches repo.

Deploying with mismatched zkey/verifier contracts will cause all proofs to fail. 

(future improvement: merge the two repos so build process is seamless) 

## Circuits

High Level Mermaid diagrams for the circuits are in ZKWitches/Docs (viewable via github or mermaid plugin)

Ciruits + Test Artifacts + typescript types are in ZKWitches_Backend/circuits

Scripts for generating outputs/exports from circuits are in ZKWitches_Backend/scripts

## Caveats + Known Problems

This is a prototype - so it has some issues!

Fun/Complexity:
* Not SUPER fun in current state. Gameplay needs a little 'fun juice'.
* The game is an Anonymous Free for all - this means that player collusion is a real concern 
* Adding an ability for a player to change their hand (similar to ambassador in 'Coup') would be awesome, and add a new level to the game.

Playability:
* Only one lobby!
* No Lobby matchmaking system
* UI is not pretty
* UI COULD have the following but does not
  * Custom "Salt" input
  * Backup your salt+hand
  * Previous Moves by players
  * Victory/Loss Screen
  * Surrender/Kick 

Security:
* Groth16 is "old" - maybe other systems are better?
* Ceremony is has one local participant, not acceptable for a real product. More elaborate ceremony required
* Owner of contract can set arbitrary state on the contract (for demo purposes: functionality can be removed)