// CLASSES 

export enum GameStateEnum 
{
    GAME_STARTING,
    WAITING_FOR_PLAYER_TURN,
    WAITING_FOR_PLAYER_ACCUSATION_RESPONSE,
    GAME_OVER
}

export type TotalGameState =
{
    shared: SharedGameState,
    playerAddresses: string[],
    players: PlayerGameState[]
}

export function DefaultTGS() : TotalGameState
{
    return <TotalGameState>
    {
        shared :
        {
            stateEnum: GameStateEnum.GAME_STARTING,
            playerSlotWaiting: 0,
            currentNumberOfPlayers: 0,
            playerAccusing: 0,
            accusationWitchType: 0,
        },
        playerAddresses: [],
        players: []
    };
}

export type SharedGameState = 
{
    stateEnum: GameStateEnum
    playerSlotWaiting: number

    currentNumberOfPlayers: number

    playerAccusing: number
    accusationWitchType: number

    // TODO Tracking time for kick and UI state
    previous_action_game_block?: number
    current_block?: number

    current_sequence_number?: number
}

export type PlayerGameState =
{    
    isAlive: boolean
    handCommitment: string

    food: number
    lumber: number

    WitchAlive: number[]
}

export type PrivatePlayerInfo =
{
    slot: number

    address: string

    salt: number

    citizens: number[]
    witches: number[]
}

export function DefaultPPI() : PrivatePlayerInfo 
{
    return <PrivatePlayerInfo> 
    {
        slot: 0,
        address: "Random",
        salt: 0,
        citizens: [0, 1, 2, 3],
        witches: [0, 1, 0, 0]
    }
}

export function Empty(address: string) : PrivatePlayerInfo 
{
    return <PrivatePlayerInfo> 
    {
        slot: 0,
        address: address,
        salt: 0,
        citizens: [0, 0, 0, 0],
        witches: [0, 0, 0, 0]
    }
}

export function Total(priv: PrivatePlayerInfo) : number
{
    return priv.citizens[0] + priv.citizens[1] + priv.citizens[2] + priv.citizens[3] + priv.witches[0] + priv.witches[1] + priv.witches[2] + priv.witches[3];
}  

export type JoinParameters = 
{
	CitizenCount : number[],
	WitchPresent : number[],
	HandSalt : number
}

export function ToJoinParameters(ppi: PrivatePlayerInfo) : JoinParameters
{
    return { CitizenCount: ppi.citizens, WitchPresent: ppi.witches, HandSalt: ppi.salt };
}

export type ActionInfo = 
{
    type: number;
    target?: number;
    witchType?: number;
}

export interface IZKBackend 
{
    GetTotalGameState() : TotalGameState | undefined;
    RefreshStatus(): Promise<void>;
    JoinGame(priv: PrivatePlayerInfo) : Promise<void>;
    DoAction(priv: PrivatePlayerInfo, action:ActionInfo, level:number): Promise<void>;
    RespondToAccusation(priv: PrivatePlayerInfo): Promise<void>;
    Surrender(): Promise<void>
    KickActivePlayer(): Promise<void>

    DebugSetTotalGameState(tgs: TotalGameState) : Promise<void>
}

export class EmptyZKBackend implements IZKBackend 
{
    private tgs?: TotalGameState;

    GetTotalGameState(): TotalGameState | undefined
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

export class WrappedZKBackend implements IZKBackend 
{
    private innerZKB : IZKBackend;
    private lb : (value: React.SetStateAction<boolean>) => void;
    private ls : (value: React.SetStateAction<string>) => void;

    constructor(inner: IZKBackend, loadingBool: (value: React.SetStateAction<boolean>) => void, loadingString: (value: React.SetStateAction<string>) => void)
    {
        this.innerZKB = inner;
        this.lb = loadingBool;
        this.ls = loadingString;
    }

    GetTotalGameState(): TotalGameState | undefined 
    {
        return this.innerZKB.GetTotalGameState();
    }

    async RefreshStatus(): Promise<void> 
    {
        this.lb(true);
        this.ls("Refreshing Status...");
        await this.innerZKB.RefreshStatus();
        this.lb(false);
    }

    async JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.lb(true);
        this.ls("Joining Game...");
        await this.innerZKB.JoinGame(priv);
        this.lb(false);    
    }

    async DoAction(priv: PrivatePlayerInfo, action: ActionInfo, level: number): Promise<void> 
    {
        this.lb(true);
        this.ls("Performing Action...");
        await this.innerZKB.DoAction(priv, action, level);
        this.lb(false);        
    }

    async RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.lb(true);
        this.ls("Responding to Accusation...");
        await this.innerZKB.RespondToAccusation(priv);
        this.lb(false);       
    }

    async Surrender(): Promise<void> 
    {
        this.lb(true);
        this.ls("Surrendering...");
        await this.innerZKB.Surrender();
        this.lb(false);         }

    async KickActivePlayer(): Promise<void> 
    {
        this.lb(true);
        this.ls("Kicking Active Player...");
        await this.innerZKB.KickActivePlayer();
        this.lb(false);     
    }

    async DebugSetTotalGameState(tgs: TotalGameState): Promise<void> 
    {
        this.lb(true);
        this.ls("DEBUG: Setting game state...");
        await this.innerZKB.DebugSetTotalGameState(tgs);
        this.lb(false);         
    }

}
