export {}

const FOOD = 0;
const LUMBER = 1;
const BRIGAND = 2;
const INQUISITOR = 3;

export enum GameStateEnum 
{
    GAME_STARTING,
    WAITING_FOR_PLAYER_TURN,
    WAITING_FOR_PLAYER_ACCUSATION_RESPONSE,
    GAME_OVER
}

export class TotalGameState 
{
    shared!: SharedGameState
    playerAddresses!: string[]
    players!: PlayerGameState[]
}

export class SharedGameState 
{
    stateEnum!: GameStateEnum
    playerSlotWaiting!: number

    currentNumberOfPlayers!: number

    playerAccusing!: number
    accusationWitchType!: number

    // TODO Tracking time for kick and UI state
    previous_action_game_block!: number
    current_block!: number

    current_sequence_number!: number
}

export class PlayerGameState 
{    
    isAlive!: boolean
    handCommitment!: string

    food!: number
    lumber!: number

    WitchAlive!: number[]
}

export class PrivatePlayerInfo
{
    slot!: number

    address!: string

    salt!: string

    citizens!: number[]
    witches!: number[]

    my_last_action!: number
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

function MyTurnValidator(gamestate: TotalGameState, private_player_info: PrivatePlayerInfo) : boolean
{
    return gamestate.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_TURN &&
     gamestate.shared.playerSlotWaiting == private_player_info.slot
}

function MyReponseValidator(gamestate: TotalGameState, private_player_info: PrivatePlayerInfo) : boolean
{
    return gamestate.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE &&
     gamestate.shared.playerSlotWaiting == private_player_info.slot
}

function HaveCitizensValidator(private_player_info: PrivatePlayerInfo, dead_witches: number[], citizen_type: number, count_required: number ) : boolean 
{
    return (private_player_info.citizens[citizen_type] >= count_required || (private_player_info.witches[citizen_type] == 1 && dead_witches[citizen_type] == 0))
} 

let m: string = 'Hello World s';
console.log(m);