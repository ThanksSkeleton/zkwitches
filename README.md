# "The Witches of Zader-Klaus" - zkWitches

Watch the video summary!

https://www.youtube.com/watch?v=H34cf3wBk94

Contact me at ChrisCallagan@proton.me

## Player's Summary of the Game
This is a 4 player, turn based, secret information dapp card game with resource management and social deduction. The game is played on chain, and uses zk (zero knowledge) proofs to allow players to make validated moves without revealing their secrets.

The objective of the game is to become the most prosperous town by accumulating 10 food and 10 lumber. 

At the start of the game, each player makes a secret selection of their village's citizens: a total of 7 citizens. 

## The Citizens

Farmers:

Gather Food. 0/1/2/3 farmers can gather 1/2/3/4 food 

Lumberjacks:

Gather Lumber. 0/1/2/3 lumberjacks can gather 1/2/3/4 lumber

Brigands:

Can force trades and steal Food or Lumber.

0 : Trade 2 food for 1 lumber with another player.

1 : Trade 2 lumber for 1 food with another player.

2 : Steal 1 food

3 : Steal 1 lumber 

Inquisitors:

Can eliminate the witches of other players.

In an inquisition, the targeted player proves they do not have a specific witch. If they cannot, they pay 2 food, and 2 lumber to the inquisitor, and their witch flees forever. If they cannot pay the inquisitor's fee, they are eliminated.

0/1/2/3 inquisitors can launch a inquisition by spending 3/2/1/0 food and lumber.

## The Witches

Witches perform actions like normal citizens, but they are 3 times as strong, so a witch can perform the action of 3 normal citizens.! But, they can be eliminated if you are targeted by Inquisitors, at a hefty cost.

## Game Over

The game ends when 3 players have surrendered or have been eliminated, or a player accumulates 10 food and 10 lumber.

## Technical Notes

This is a dapp game with no additional backend. 
This game follows this basic flow:

* Players join a game with pre-committed "hands" that they choose via a api call that also transfers $$$ into the contract. 
* A zk circuit validates that "hand" is valid, and a proof is created of this along with a commitment hash - HASH(salt+hand). The player stores their hand and salt locally.
* Once all players have joined, the game proceeds to the first player
* Players call action apis when it is their turn. Out of turn calls are rejected. current turn is tracked by a state machine.
* On all contentious actions, a player must provide a zk proof that they are capable of doing that action, either by having enough citizens of that type or having a witch. 
* They need to provide their hand and a salt to a zk circuit, and create a proof that their hand has some property, and has the same hash as the previously committed hand.
* Some actions do not require proofs, like performing actions that require no citizens of any type, or surrendering.
* A player must respond to an witch accusation out of turn. They call an api that submit a proof that they do not have that witch, or call an API acknowledging that they do.
* All Business logic is enforced in both contract AND UI client
* If it is a player's turn to act but X time has elapsed, any player may call the KICK() API and cause that player to lose
* Players can surrender.
* Lost players automatically lose their turn.
