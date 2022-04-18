const FOOD = 0;
const LUMBER = 1;
const BRIGAND = 2;
const INQUISITOR = 3;

enum GameStateEnum 
{
    GAME_STARTING,
    WAITING_FOR_PLAYER_TURN,
    WAITING_FOR_PLAYER_ACCUSATION_RESPONSE,
    GAME_OVER
}

class TotalGameState 
{
    shared: SharedGameState
    players: Map<string, PlayerGameState>
}

class SharedGameState 
{
    stateEnum : GameStateEnum
    player_waiting: string

    previous_action_game_block: number
    current_block: number

    current_sequence_number: number
}

class PlayerGameState 
{    
    slot: number

    address: string

    is_alive: boolean

    handcommitment: string

    food: number
    lumber: number

    dead_witches: number[]
}

class PrivatePlayerInfo
{
    slot: number

    address : string

    salt: string

    citizens: number[]
    witches: number[]

    my_last_action: number
}

interface ActionValidator
{
    (gamestate: TotalGameState, private_player_info: PrivatePlayerInfo) : boolean
}

// Need
// MyTurnValidator
// MyReponseValidator
// HaveCitizensValidator
// StealValidator
// InquisitionValidator

function MyTurnValidator(gamestate: TotalGameState, private_player_info: PrivatePlayerInfo) 
{
    return gamestate.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_TURN &&
     gamestate.shared.player_waiting == private_player_info.address &&
     gamestate.shared.current_sequence_number == private_player_info.my_last_action;
}

function MyReponseValidator(gamestate: TotalGameState, private_player_info: PrivatePlayerInfo) 
{
    return gamestate.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE &&
     gamestate.shared.player_waiting == private_player_info.address &&
     gamestate.shared.current_sequence_number == private_player_info.my_last_action;
}

function HaveCitizensValidator(private_player_info: PrivatePlayerInfo, dead_witches: number[], citizen_type: number, count_required: number ) : boolean 
{
    return (private_player_info.citizens[citizen_type] >= count_required || private_player_info.witches[citizen_type] == 1 && dead_witches[citizen_type] == 0)
}

function 


let message: string = 'Hello World';
console.log(message);