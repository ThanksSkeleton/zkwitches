# Demo Mode 

What is working
* Contract: Storage of the game state
* Contract: Validating against most obviously incorrect actions (joining the same game twice, stealing from yourself)
* Contract: Validating proofs for actions using the verifier contracts
* Frontend: Calling full APIs when you press buttons
* Frontend: Painting UI based on fetched contract state 
* Frontend: Disabling buttons for invalid actions

What is not complete
* Contract: Any money/payouts
* Contract: Multiple lobbies/simultaneous games
* Frontend: Representing all data required to make smart decisions
* Frontend: Game log
* FrontEnd: Generating random salt values or allowing custom salt input (only hardcoded)

## Demos

To help demo the game, I added an additional debug API that can arbitrarily set state. This is not just a frontend effect, it modifies the contract state on-chain. This allows you to show off the three different circuits/proofs.

### DEMO: JOIN

Pressing the DEMO: JOIN button sets the on contract gamestate to a brand new game. You can join the game with a custom hand / handcommitment, and a proof of your handcommitment is verified.

### DEMO: ACTION

Pressing the DEMO: ACTION button sets the contract gamestate to an active game, with a pre-chosen hand that has citizens and witches. 

* You can perform an action that requires 0 citizens (no proof required)
* You can perform an action that requires citizens and you have the citizens (proof required)
* You can perform an action that requires citizens and you have a witch. (proof required)

Some actions are grayed out because of gamestate rules (you can't steal from somebody with nothing!)

### DEMO: RESPOND TO ACCUSATION

Pressing the DEMO: RESPOND TO ACCUSATION button sets the contract gamestate to an active game, where another player has accused you of having a specific witch. You have a pre-determined hand, and you don't have that witch - so you can construct and submit a proof of innocence.