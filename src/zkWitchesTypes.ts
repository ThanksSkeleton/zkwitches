// CLASSES 

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

export class ActionInfo {}

export interface IZKBackend 
{
    GetTotalGameState() : TotalGameState;
    RefreshStatus(): Promise<void>;
    JoinGame(priv: PrivatePlayerInfo) : Promise<void>;
    DoAction(priv: PrivatePlayerInfo, action:ActionInfo): Promise<void>;
    RespondToAccusation(priv: PrivatePlayerInfo): Promise<void>;
    Surrender(): Promise<void>
    KickActivePlayer(): Promise<void>

    DebugSetTotalGameState(tgs: TotalGameState) : Promise<void>
}

export class EmptyZKBackend implements IZKBackend 
{
    private tgs: TotalGameState = new TotalGameState();

    GetTotalGameState(): TotalGameState 
    {
        return this.tgs;
    }

    RefreshStatus(): Promise<void> 
    {
        return new Promise(r => { setTimeout(r, 2000)});
    }

    JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DoAction(priv: PrivatePlayerInfo, action: ActionInfo): Promise<void> {
        return this.RefreshStatus();
    }

    RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> {
        return this.RefreshStatus();
    }

    Surrender(): Promise<void> {
        return this.RefreshStatus();
    }

    KickActivePlayer(): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DebugSetTotalGameState(tgsinput: TotalGameState): Promise<void> 
    {
        this.tgs = tgsinput;
        return this.RefreshStatus();
    }
}
