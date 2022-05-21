// CLASSES 

import { BigNumber } from "ethers";
import { ZkWitches } from "./import/contracts/ZkWitches/ZkWitches";
import { HandCommitmentInput } from "./import/HandCommitment_input"
import { NoWitchInput } from "./import/NoWitch_input"
import { ValidMoveInput } from "./import/ValidMove_input"
import { EventRepresentation } from "./zkWitchesEthers";

export type TotalGameState = ZkWitches.TotalGameStateStruct;
export type SharedGameState = ZkWitches.SharedStateStruct;
export type PlayerGameState = ZkWitches.PlayerStateStruct;
export type JoinWitnessParameters = HandCommitmentInput;
export type NoWitchWitnessParameters = NoWitchInput;
export type ValidMoveWitnessParameters = ValidMoveInput;

export enum GameStateEnum 
{
    GAME_STARTING,
    WAITING_FOR_PLAYER_TURN,
    WAITING_FOR_PLAYER_ACCUSATION_RESPONSE,
}

const bogusAddress1 = "0xdd3fd4581271e230360230f9337d5c0430bf44c0"
const bogusAddress2 = "0xdd3fd4581271e230360230f9337d5c0430bf44c1"
const bogusAddress3 = "0xdd3fd4581271e230360230f9337d5c0430bf44c2"
const bogusAddress4 = "0xdd3fd4581271e230360230f9337d5c0430bf44c3"

export function GetSlot(tgs?: TotalGameState, address?: string) : number | undefined
{
    if (tgs == undefined || address == undefined) { return undefined; }
    let index = tgs.addresses.indexOf(address);
    return index == -1 ? undefined : index;
}


export function DefaultTGS() : TotalGameState
{
    console.log("bogustest ", Test_BogusPlayer(0));

    let tgs = <TotalGameState>
    {
        shared :
        {
            stateEnum: BigNumber.from(GameStateEnum.GAME_STARTING),
            playerSlotWaiting: BigNumber.from(0),
            currentNumberOfPlayers: BigNumber.from(0),
            playerAccusing: BigNumber.from(0),
            accusationWitchType: BigNumber.from(0),

            gameId: BigNumber.from(0),

            // TODO BOGUS
            previous_action_game_block:  BigNumber.from(0),
            current_block: BigNumber.from(0),

            current_sequence_number: BigNumber.from(0)
        },
        addresses: [bogusAddress1, bogusAddress2, bogusAddress3, bogusAddress4],
        players: [Test_BogusPlayer(0), Test_BogusPlayer(0), Test_BogusPlayer(0), Test_BogusPlayer(0)]
    };

    console.log("tgstest ", tgs);

    return tgs;
}

export function StartActionTGS(actualAddress: string) : TotalGameState 
{
    return <TotalGameState>
    {
        shared :
        {
            stateEnum: GameStateEnum.WAITING_FOR_PLAYER_TURN,
            playerSlotWaiting: 0,
            currentNumberOfPlayers: 4,
            playerAccusing: 0,
            accusationWitchType: 0,

            gameId: BigNumber.from(0),

            // TODO BOGUS
            previous_action_game_block:  BigNumber.from(0),
            current_block: BigNumber.from(0),

            current_sequence_number: BigNumber.from(0)
        },
        addresses: [actualAddress, bogusAddress2, bogusAddress3, bogusAddress4],
        players: [Test_UserPlayer(), Test_BogusPlayer(1), Test_BogusPlayer(2), Test_BogusPlayer(3)]
    };
}

function Test_UserPlayer() : PlayerGameState
{
    return <PlayerGameState> 
    {
        isAlive: true,
        handCommitment : BigNumber.from("2390925104012223983963800327130789632339155470135800695934245945237228735823"),
        food: BigNumber.from(2),
        lumber: BigNumber.from(2),
        WitchAlive: [true,true,true,true]
    }
}

function Test_BogusPlayer(index: number) : PlayerGameState
{
    return <PlayerGameState> 
    {
        isAlive: true,
        handCommitment : BigNumber.from(index), 
        food: BigNumber.from(2),
        lumber: BigNumber.from(2),
        WitchAlive: [true,true,true,true]
    }
}

export function RespondToAccusationTGS(actualAddress: string) : TotalGameState 
{
    return <TotalGameState>
    {
        shared :
        {
            stateEnum: BigNumber.from(GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE),
            playerSlotWaiting: BigNumber.from(0),
            currentNumberOfPlayers: BigNumber.from(4),
            playerAccusing: BigNumber.from(1),
            accusationWitchType: BigNumber.from(0),

            gameId: BigNumber.from(0),

            // TODO BOGUS
            previous_action_game_block:  BigNumber.from(0),
            current_block: BigNumber.from(0),

            current_sequence_number: BigNumber.from(0)      
        },
        addresses: [actualAddress, bogusAddress2, bogusAddress3, bogusAddress4],
        players: [Test_UserPlayer(), Test_BogusPlayer(1), Test_BogusPlayer(2), Test_BogusPlayer(3)]
    };}

export function TwoPlayerGame(actualAddress: string) : TotalGameState 
{
    let dead2 = Test_BogusPlayer(2);
    dead2.isAlive = false;
    let dead3 = Test_BogusPlayer(3);
    dead3.isAlive = false;

    return <TotalGameState>
    {
        shared :
        {
            stateEnum: GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE,
            playerSlotWaiting: 0,
            currentNumberOfPlayers: 4,
            playerAccusing: 1,
            accusationWitchType: 0,

            // TODO BOGUS
            previous_action_game_block:  BigNumber.from(0),
            current_block: BigNumber.from(0),

            current_sequence_number: BigNumber.from(0)      
        },
        addresses: [actualAddress, bogusAddress2, bogusAddress3, bogusAddress4],
        players: [Test_UserPlayer(), Test_BogusPlayer(1), dead2, dead3]
    };
}

export type PrivatePlayerInfo =
{
    salt: string

    citizens: number[]
    witches: number[]
}

export function DefaultPPI() : PrivatePlayerInfo 
{
    return <PrivatePlayerInfo> 
    {
        salt: "1157920892373161954235709850086879078532699846656405640394575840791312963995",
        citizens: [2, 1, 2, 1],
        witches: [0, 1, 0, 0]
    }
}

export function Empty(salt: string) : PrivatePlayerInfo 
{
    return <PrivatePlayerInfo> 
    {
        salt: salt,
        citizens: [0, 0, 0, 0],
        witches: [0, 0, 0, 0]
    }
}

export function Total(priv: PrivatePlayerInfo) : number
{
    console.log("Recalculating Total");
    return priv.citizens[0] + priv.citizens[1] + priv.citizens[2] + priv.citizens[3] + priv.witches[0] + priv.witches[1] + priv.witches[2] + priv.witches[3];
}  

export function ToJoinParameters(ppi: PrivatePlayerInfo) : JoinWitnessParameters
{
    return { CitizenCount: ppi.citizens, WitchPresent: ppi.witches, HandSalt: ppi.salt };
}

export function ToNoWitchParameters(priv: PrivatePlayerInfo, tgs: TotalGameState, slot: number) : NoWitchWitnessParameters 
{
    return <NoWitchWitnessParameters>
    { 
        CitizenCount: priv.citizens, 
        WitchPresent: priv.witches,
        HandSalt: priv.salt,
        ExpectedHash: tgs.players[slot].handCommitment,
        citizenType: tgs.shared.accusationWitchType as number
     };
}

export function ToValidMoveParameters(priv: PrivatePlayerInfo, tgs: TotalGameState, slot: number, citizenType: number, requiredCitizenCount: number) : ValidMoveWitnessParameters 
{
    return <ValidMoveWitnessParameters>
    { 
        CitizenCount: priv.citizens,
        WitchPresent: priv.witches,
        HandSalt: priv.salt,
        ExpectedHash: tgs.players[slot].handCommitment, 
        WitchAlive: tgs.players[slot].WitchAlive.map(x => x ? 1 : 0),
        citizenType: citizenType, 
        requiredCitizenCount: requiredCitizenCount 
    };

}

export type ActionInfo = 
{
    type: number;
    target: number;
    witchType: number;
}

export interface IZKBackend 
{
    GetAddress() : string | undefined;
    GetTotalGameState() : TotalGameState | undefined;
    IsAdmin(): boolean | undefined
    
    RefreshStatus(): Promise<void>;
    JoinGame(priv: PrivatePlayerInfo) : Promise<void>;
    DoAction(priv: PrivatePlayerInfo, slot: number, action:ActionInfo, level:number): Promise<void>;
    RespondToAccusation(priv: PrivatePlayerInfo, slot:number): Promise<void>;
    Surrender(): Promise<void>
    KickActivePlayer(): Promise<void>

    GetEvents() : EventRepresentation[] 

    DebugSetTotalGameState(tgs: TotalGameState) : Promise<void>
}