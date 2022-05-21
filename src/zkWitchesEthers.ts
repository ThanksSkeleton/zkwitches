import { BigNumber, BigNumberish, ethers } from "ethers";
import zkWitchesAbi from './import/zkWitches.json';
import accessAbi from "./Ownable.json"
import { ActionEvent, VictoryLossEvent, ZkWitches } from './import/contracts/ZkWitches/ZkWitches' 
import { targetChain } from "./chainInfo";

import { ActionInfo, IZKBackend, PrivatePlayerInfo, ToJoinParameters, TotalGameState, ToValidMoveParameters, ToNoWitchParameters } from "./zkWitchesTypes";

import { generateCalldata } from './zkWitches_js/generate_calldata';
import { Ownable } from "./Ownable";
import { ACCUSATION_COLOR_WHITE, ACTION_COLORS, GAMESTART_COLOR_WHITE, JOIN_COLOR_WHITE, LongPastTenseDescription, LOSS_COLOR, VICTORY_COLOR } from "./Descriptions";
import { PrivMapper } from "./PrivMapper";

let zkWitches: ZkWitches;
let access : Ownable;
let signerAddress : string; 

async function connectContract() {
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();

    signerAddress = await signer.getAddress();
    console.log('signer: ', signerAddress);

    zkWitches = new ethers.Contract(targetChain()['address'], zkWitchesAbi.abi, signer) as ZkWitches;
    access = new ethers.Contract(targetChain()['address'], accessAbi.abi, signer) as Ownable;

    console.log("Loaded ZKWitches Contract:", zkWitches);
    console.log("Loaded Ownable Contract:", access);
}

type witness = 
{
    a: [BigNumberish, BigNumberish];
    b: [[BigNumberish, BigNumberish],[BigNumberish, BigNumberish]];
    c: [BigNumberish, BigNumberish];
    inputs : BigNumberish[];
}

async function generateWitness(wasmfile: string, zkeyPath: string, inputData: any) : Promise<witness> {
    let errorString = 'Fail to generate witness.'
    console.log("Types generateWitness");
    console.log("wasmfile: string, zkeyPath: string, inputData: any");
    console.log("Values generateWitness");
    console.log("wasmfile: " + wasmfile + ", zkeyPath: " + zkeyPath + ", inputData: " + JSON.stringify(inputData));

    let calldata = await generateCalldata(wasmfile, zkeyPath, inputData);
    if (!calldata) throw errorString;
    console.log('calldata generated');
    console.log("calldata Raw:");
    console.log(JSON.stringify(calldata));
    let a = calldata[0];
    let b = calldata[1];
    let c = calldata[2];
    let inputs = calldata[3];

    let toReturn = { a, b, c, inputs };

    console.log("Calldata pushed");
    console.log(JSON.stringify(toReturn));

    return toReturn;
}

const JoinWASM : string = "/import/HandCommitment/HandCommitment.wasm";
const JoinZKey : string = "/import/HandCommitment/circuit_final.zkey";

const ActionWASM : string = "/import/ValidMove/ValidMove.wasm";
const ActionZKey : string = "/import/ValidMove/circuit_final.zkey";

const NoWitchWASM : string = "/import/NoWitch/NoWitch.wasm";
const NoWitchZkey: string = "/import/NoWitch/circuit_final.zkey";

function errorHandler(error: any) : PromiseLike<never> 
{
    let errorMsg : string;
    if (error.reason) {
        errorMsg = error.reason;
    } else if (error.data.message) {
        errorMsg = error.data.message;
    } else {
        errorMsg = "Unknown error."
    }
    console.log(error);
    throw errorMsg;
}

export interface ILoadingWidgetOutput 
{
    StartLoading() : Promise<void>,
    GeneratingWitness() : Promise<void>
    CallAPI_Witness(w: witness) : Promise<witness>
    CallAPI() : Promise<void>
    AwaitTransaction(txn: ethers.ContractTransaction): Promise<ethers.ContractTransaction>
    FetchState() : Promise<void>
    EndLoading() : Promise<void>
    Bump() : Promise<void>
}

export class LoadingWidgetOutput implements ILoadingWidgetOutput 
{
    private setLoading : (x : boolean) => void;
    private setLoadingString : (x : string) => void;

    constructor(setLoadingIn: (x : boolean) => void, setLoadingStringIn: (x : string) => void )
    {
        this.setLoading = setLoadingIn;
        this.setLoadingString = setLoadingStringIn;
    }

    async StartLoading(): Promise<void> {
        console.log("Setting Loading True"); 
        this.setLoading(true);
        console.log("Connecting To Contract");
        this.setLoadingString("Connecting To Contract");
    }

    async GeneratingWitness() : Promise<void> {
        console.log("Generating Witness");
        this.setLoadingString("Generating Witness");
    }

    async CallAPI_Witness(w: witness): Promise<witness> {
        console.log("Calling API");
        this.setLoadingString("Calling API");
        return w;
    }

    async CallAPI(): Promise<void> {
        console.log("Calling API");
        this.setLoadingString("Calling API");
    }

    async AwaitTransaction(txn: ethers.ContractTransaction): Promise<ethers.ContractTransaction> {
        console.log("Waiting for transaction to process");
        this.setLoadingString("Waiting for transaction to process");
        return txn;
    }

    async FetchState(): Promise<void> {
        console.log("Fetching new state");
        this.setLoadingString("Fetching new state");
    }

    async EndLoading() : Promise<void> 
    {
        console.log("Ending Loading");
        this.setLoading(false);
    }

    async Bump() : Promise<void> 
    {
        console.log("Bump");
        this.setLoading(true);        
        this.setLoading(false);
    }
}

async function GetOwner() : Promise<string>
{
    return await connectContract().then(() => access.owner());
}

async function GetTgs(widget: ILoadingWidgetOutput) : Promise<TotalGameState> 
{
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.CallAPI()).then(() => zkWitches.GetTGS()).
    finally(() => widget.EndLoading());
}

async function JoinGame(priv: PrivatePlayerInfo, widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.GeneratingWitness()).then(() => generateWitness(JoinWASM, JoinZKey, ToJoinParameters(priv))).
    then(witness => widget.CallAPI_Witness(witness)).then(witness => zkWitches.JoinGame(witness.a, witness.b, witness.c, [witness.inputs[0]])).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function Action(tgs: TotalGameState, priv: PrivatePlayerInfo, slot: number, actionInfo: ActionInfo, level: number, widget: ILoadingWidgetOutput) :  Promise<TotalGameState>
{
    if (level != 0) 
    {
        return Action_Complex(tgs, priv, slot, actionInfo, level, widget);
    } 
    else 
    {
        return Action_Simple(actionInfo, widget);
    }
}

async function Action_Complex(tgs: TotalGameState, priv: PrivatePlayerInfo, slot: number, actionInfo: ActionInfo, level: number, widget: ILoadingWidgetOutput) :  Promise<TotalGameState>
{    
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.GeneratingWitness()).then(() => generateWitness(ActionWASM, ActionZKey, ToValidMoveParameters(priv, tgs, slot, actionInfo.type, level))).
    then(witness => widget.CallAPI_Witness(witness)).then(witness => zkWitches.ActionWithProof(actionInfo.target ?? 0, actionInfo.witchType ?? 0, witness.a, witness.b, witness.c, witness.inputs)).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function Action_Simple(actionInfo: ActionInfo, widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.CallAPI()).then(() => zkWitches.ActionNoProof(actionInfo.type, actionInfo.target ?? 0, actionInfo.witchType ?? 0)).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function WitchProof(tgs: TotalGameState, priv: PrivatePlayerInfo, slot:number, widget: ILoadingWidgetOutput ) : Promise<TotalGameState>
{
    let hasWitch : boolean = priv.witches[tgs.shared.accusationWitchType as number] == 1;

    if (!hasWitch) 
    {
        return WitchProof_No(tgs, priv, slot, widget);
    } 
    else 
    {
        return WitchProof_Yes(widget);
    }
}

async function WitchProof_No(tgs: TotalGameState, priv: PrivatePlayerInfo, slot: number, widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{    
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.GeneratingWitness()).then(() => generateWitness(NoWitchWASM, NoWitchZkey, ToNoWitchParameters(priv, tgs, slot))).
    then(witness => widget.CallAPI_Witness(witness)).then(witness => zkWitches.RespondAccusation_NoWitch(witness.a, witness.b, witness.c, [witness.inputs[0], witness.inputs[1]])).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function WitchProof_Yes(widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{
    return await widget.StartLoading().then(() => connectContract()).
    then(() =>  widget.CallAPI()).then(() => zkWitches.RespondAccusation_YesWitch()).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function Surrender(widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{
    return await widget.StartLoading().then(() => connectContract()).
    then(() =>  widget.CallAPI()).then(() => zkWitches.Surrender()).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function KickActivePlayer(widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{
    return await widget.StartLoading().then(() => connectContract()).
    then(() =>  widget.CallAPI()).then(() => zkWitches.KickCurrentPlayer()).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

async function SetTgs(tgs_input: TotalGameState, widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{
    console.log("input: ", tgs_input);
    return await widget.StartLoading().then(() => connectContract()).
    then(() =>  widget.CallAPI()).then(() => zkWitches.DEBUG_SetGameState(tgs_input)).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

export type EventRepresentation = 
{
    color: string,
    text: string,
    timestamp : Date
}

async function GetEvents_AndPrevious(currentGameId: number) : Promise<EventRepresentation[]>
{
    let toReturn : EventRepresentation[] = [];
    toReturn.concat(await GetEvents(currentGameId))
    if (currentGameId > 0)
    {
        toReturn.concat(await GetEvents(currentGameId-1))
    }
    toReturn.sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime())
    return toReturn;
}

async function GetEvents(gameId : number) : Promise<EventRepresentation[]> 
{
    let toReturn : EventRepresentation[] = [];
    await connectContract();

    {
        console.log("joinEvents - no filter at all");

        let joins = await zkWitches.queryFilter(zkWitches.filters.Join());
        let joins_transformed = joins.map((e,i,a) => <EventRepresentation> { color: JOIN_COLOR_WHITE, text: "Player " + e.args.slot + " (" + e.args.player + ") has joined game " + e.args.gameId + ".", timestamp: new Date(e.args.timeStamp.toNumber()) });
        toReturn.concat(joins_transformed);
    }

    {
        console.log("joinEvents - no block filter");

        let joins = await zkWitches.queryFilter(zkWitches.filters.Join(gameId));
        let joins_transformed = joins.map((e,i,a) => <EventRepresentation> { color: JOIN_COLOR_WHITE, text: "Player " + e.args.slot + " (" + e.args.player + ") has joined game " + e.args.gameId + ".", timestamp: new Date(e.args.timeStamp.toNumber()) });
        toReturn.concat(joins_transformed);
    }

    {
        console.log("GameStartevents");

    // There should only be one of them but whatever
        let gameStarts = await zkWitches.queryFilter(zkWitches.filters.GameStart(gameId), 0, 500);
        let starts_transformed = gameStarts.map((e,i,a) => <EventRepresentation> { color: GAMESTART_COLOR_WHITE, text: "Game " + e.args.gameId + " started.", timestamp: new Date(e.args.timeStamp.toNumber()) })
        toReturn.concat(starts_transformed);
    }

    {

        console.log("ActionEvents");

        let actions = await zkWitches.queryFilter(zkWitches.filters.Action(gameId), 0, 500);
        let actions_transformed = actions.map((e,i,a) => convertAction(e));
        toReturn.concat(actions_transformed);
    }

    {
        console.log("victoryLossevents");

        let victoryLoss = await zkWitches.queryFilter(zkWitches.filters.VictoryLoss(gameId), 0, 500);
        let victories_transformed = victoryLoss.map((e,i,a) => convertVictoryLoss(e));
        toReturn.concat(victories_transformed);
    }

    {
        console.log("AccusationResponseevents");

        let accusations = await zkWitches.queryFilter(zkWitches.filters.AccusationResponse(gameId), 0, 500);
        let accusations_transformed = accusations.map((e,i,a) => <EventRepresentation> { color: ACCUSATION_COLOR_WHITE, text: "Player " + e.args.slot + " (" + e.args.player + ") " + e.args.innocent ? " responded with proof that they don't have that witch." : " admitted that they have that witch.", timestamp: new Date(e.args.timeStamp.toNumber())});
        toReturn.concat(accusations_transformed);
    }

    console.log("event count:", toReturn.length);


    return toReturn;
}

function convertAction(e : ActionEvent) : EventRepresentation 
{
    let player = "Player " + e.args.slot + " (" + e.args.player + ") ";
    let actionString = LongPastTenseDescription(e.args.actionType, e.args.target, e.args.witchType, e.args.actionLevel);

    return <EventRepresentation> { 
        color: ACTION_COLORS[e.args.actionType],
        text: player + actionString,
        timestamp: new Date(e.args.timeStamp.toNumber())
    };
}

// uint8 constant LOSS_SURRENDER = 0;
// uint8 constant LOSS_KICK = 1;
// uint8 constant LOSS_INQUISITION = 2;
// uint8 constant LOSS_RESOURCES = 3;
// uint8 constant VICTORY_RESOURCES = 4;
// uint8 constant VICTORY_ELIMINATED = 5;

function convertVictoryLoss(e : VictoryLossEvent) : EventRepresentation 
{
    let player = "Player " + e.args.slot + " (" + e.args.player + ") ";

    let vl : string; 
    switch(e.args.victoryLossType)
    {
        case(0) : vl = "lost due to surrender."; break;
        case(1) : vl = "lost because they were kicked from the game due to inactivity."; break;
        case(2) : vl = "lost because they couldn't pay the penalty for an inquisition."; break;
        case(3) : vl = "lost because another player gathered enough resources and won."; break;
        case(4) : vl = "won because they gathered enough resources."; break;
        case(5) : vl = "won because all other players were eliminated."; break;
        default: vl = "unknown."; break;
    }
    
    let isVictory = e.args.victoryLossType >= 4;

    return <EventRepresentation> { 
        color: isVictory ? VICTORY_COLOR : LOSS_COLOR,
        text: player + vl,
        timestamp: new Date(e.args.timeStamp.toNumber())
    };
}

export class ZKBackend implements IZKBackend 
{
    private widget : ILoadingWidgetOutput;

    private tgs?: TotalGameState;
    private address?: string;
    private isAdmin?: boolean;
    private events?: EventRepresentation[];

    constructor(widgetIn: ILoadingWidgetOutput) 
    {
        this.widget = widgetIn;
    }

    GetTotalGameState(): TotalGameState | undefined 
    {
        return this.tgs;
    }

    GetAddress(): string | undefined  
    {
        return this.address;
    }

    IsAdmin() : boolean | undefined
    {
        return this.isAdmin;
    }

    GetEvents() : EventRepresentation[] 
    {
        return this.events ?? [];
    }

    async RefreshStatus(): Promise<void> 
    {        
        this.tgs = await GetTgs(this.widget);        
        this.address = this.address ?? signerAddress;
        this.isAdmin = this.isAdmin ?? (await GetOwner() == this.address);
        //this.events = await GetEvents_AndPrevious(this.tgs.shared.gameId as number);
        await this.widget.Bump(); 
    }

    async JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.tgs = await JoinGame(priv, this.widget);
        await this.widget.Bump(); 
    }

    async DoAction(priv: PrivatePlayerInfo, slot: number, action: ActionInfo, level: number): Promise<void> 
    {
        this.tgs = await Action(this.tgs as TotalGameState, priv, slot, action, level, this.widget);
        await this.widget.Bump(); 
    }

    async RespondToAccusation(priv: PrivatePlayerInfo, slot: number): Promise<void> 
    {
        this.tgs = await WitchProof(this.tgs as TotalGameState, priv, slot, this.widget);
        await this.widget.Bump(); 
    }

    async Surrender(): Promise<void> 
    {
        this.tgs = await Surrender(this.widget);
        await this.widget.Bump(); 
    }

    async KickActivePlayer(): Promise<void> 
    {
        this.tgs = await KickActivePlayer(this.widget);
        await this.widget.Bump(); 
    }

    async DebugSetTotalGameState(tgs_input: TotalGameState): Promise<void> 
    {
        tgs_input.shared.gameId = (this.tgs?.shared.gameId as BigNumber).add(1);
        console.log("Incrementing GameId to ", tgs_input.shared.gameId)
        this.tgs = await SetTgs(tgs_input, this.widget);
        await this.widget.Bump(); 
    }
}