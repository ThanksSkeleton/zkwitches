import { BigNumberish, ethers } from "ethers";
import zkWitchesAbi from './import/zkWitches.json';
import accessAbi from "./Ownable.json"
import { ZkWitches } from './import/ZkWitches/ZkWitches' 
import { targetChain } from "./chainInfo";

import { ActionInfo, IZKBackend, PrivatePlayerInfo, ToJoinParameters, TotalGameState, ToValidMoveParameters, ToNoWitchParameters } from "./zkWitchesTypes";

import { generateCalldata } from './zkWitches_js/generate_calldata';
import { Ownable } from "./Ownable";

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

    let calldata = await generateCalldata(wasmfile, zkeyPath, inputData);
    if (!calldata) throw errorString;
    console.log('calldata generated');
    console.log("calldata Raw:");
    console.log(calldata);
    let a = calldata[0];
    let b = calldata[1];
    let c = calldata[2];
    let inputs = calldata[3];

    let toReturn = { a, b, c, inputs };

    console.log("Calldata pushed");
    console.log(toReturn);

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

async function Action(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo, level: number, widget: ILoadingWidgetOutput) :  Promise<TotalGameState>
{
    if (level != 0) 
    {
        return Action_Complex(tgs, priv, actionInfo, level, widget);
    } 
    else 
    {
        return Action_Simple(actionInfo, widget);
    }
}

async function Action_Complex(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo, level: number, widget: ILoadingWidgetOutput) :  Promise<TotalGameState>
{    
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.GeneratingWitness()).then(() => generateWitness(ActionWASM, ActionZKey, ToValidMoveParameters(priv, tgs, actionInfo.type, level))).
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

async function WitchProof(tgs: TotalGameState, priv: PrivatePlayerInfo, widget: ILoadingWidgetOutput ) : Promise<TotalGameState>
{
    let hasWitch : boolean = priv.witches[tgs.shared.accusationWitchType as number] == 1;

    if (!hasWitch) 
    {
        return WitchProof_No(tgs, priv, widget);
    } 
    else 
    {
        return WitchProof_Yes(widget);
    }
}

async function WitchProof_No(tgs: TotalGameState, priv: PrivatePlayerInfo, widget: ILoadingWidgetOutput) : Promise<TotalGameState>
{    
    return await widget.StartLoading().then(() => connectContract()).
    then(() => widget.GeneratingWitness()).then(() => generateWitness(NoWitchWASM, NoWitchZkey, ToNoWitchParameters(priv, tgs))).
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
    return await widget.StartLoading().then(() => connectContract()).
    then(() =>  widget.CallAPI()).then(() => zkWitches.DEBUG_SetGameState(tgs_input)).
    then(txn => widget.AwaitTransaction(txn)).then(txn => txn.wait()).
    then(() => widget.FetchState()).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => widget.EndLoading());
}

export class ZKBackend implements IZKBackend 
{
    private widget : ILoadingWidgetOutput;

    private tgs?: TotalGameState;
    private address?: string;
    private isAdmin?: boolean;

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

    async RefreshStatus(): Promise<void> 
    {        
        this.tgs = await GetTgs(this.widget);        
        this.address = this.address ?? signerAddress;
        this.isAdmin = this.isAdmin ?? (await GetOwner() == this.address);
        await this.widget.Bump(); 
    }

    async JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.tgs = await JoinGame(priv, this.widget);
    }

    async DoAction(priv: PrivatePlayerInfo, action: ActionInfo, level: number): Promise<void> 
    {
        this.tgs = await Action(this.tgs as TotalGameState, priv, action, level, this.widget);
    }

    async RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.tgs = await WitchProof(this.tgs as TotalGameState, priv, this.widget);
    }

    async Surrender(): Promise<void> 
    {
        this.tgs = await Surrender(this.widget);
    }

    async KickActivePlayer(): Promise<void> 
    {
        this.tgs = await KickActivePlayer(this.widget);
    }

    async DebugSetTotalGameState(tgs_input: TotalGameState): Promise<void> 
    {
        this.tgs = await SetTgs(tgs_input, this.widget);
    }
}