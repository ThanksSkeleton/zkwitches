import { BigNumberish, ethers } from "ethers";
import zkWitchesArtifact from './import/zkWitches.json';
import { ZkWitches } from './import/ZkWitches/ZkWitches' 
import { targetChain } from "./chainInfo";

import { ActionInfo, IZKBackend, PrivatePlayerInfo, ToJoinParameters, TotalGameState, ToValidMoveParameters, ToNoWitchParameters } from "./zkWitchesTypes";

import { generateCalldata } from './zkWitches_js/generate_calldata';

let zkWitches: ZkWitches;
export let signerAddress : string; 

async function connectContract() {
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();

    signerAddress = await signer.getAddress();
    console.log('signer: ', signerAddress);

    zkWitches = new ethers.Contract(targetChain()['address'], zkWitchesArtifact.abi, signer) as ZkWitches;

    console.log("Loaded ZKWitches Contract:", zkWitches);
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

const JoinWASM : string = "/HandCommitment/HandCommitment.wasm";
const JoinZKey : string = "/HandCommitment/circuit_final.zkey";

const ActionWASM : string = "/ValidMove/ValidMove.wasm";
const ActionZKey : string = "/ValidMove/circuit_final.zkey";

const NoWitchWASM : string = "/NoWitch/NoWitch.wasm";
const NoWitchZkey: string = "/NoWitch/circuit_final.zkey";

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

async function GetTgs(setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState> 
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Calling API")).then(() => zkWitches.GetTGS()).
    finally(() => setLoading(false));
}

async function JoinGame(priv: PrivatePlayerInfo, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Generating witness")).then(() => generateWitness(JoinWASM, JoinZKey, ToJoinParameters(priv))).
    then(witness => { setLoadingString("Calling API"); return witness; }).then(witness => zkWitches.JoinGame(witness.a, witness.b, witness.c, [witness.inputs[0]])).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function Action(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo, level: number, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) :  Promise<TotalGameState>
{
    if (level != 0) 
    {
        return Action_Complex(tgs, priv, actionInfo, level, setLoading, setLoadingString);
    } 
    else 
    {
        return Action_Simple(actionInfo, setLoading, setLoadingString);
    }
}

async function Action_Complex(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo, level: number, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) :  Promise<TotalGameState>
{    
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Generating witness")).then(() => generateWitness(ActionWASM, ActionZKey, ToValidMoveParameters(priv, tgs, actionInfo.type, level))).
    then(witness => { setLoadingString("Calling API"); return witness; }).then(witness => zkWitches.ActionWithProof(actionInfo.target ?? 0, actionInfo.witchType ?? 0, witness.a, witness.b, witness.c, witness.inputs)).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function Action_Simple(actionInfo: ActionInfo, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(witness => { setLoadingString("Calling API"); return witness; }).then(() => zkWitches.ActionNoProof(actionInfo.type, actionInfo.target ?? 0, actionInfo.witchType ?? 0)).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function WitchProof(tgs: TotalGameState, priv: PrivatePlayerInfo, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    let hasWitch : boolean = priv.witches[tgs.shared.accusationWitchType as number] == 1;

    if (!hasWitch) 
    {
        return WitchProof_No(tgs, priv, setLoading, setLoadingString);
    } 
    else 
    {
        return WitchProof_Yes(setLoading, setLoadingString);
    }
}

async function WitchProof_No(tgs: TotalGameState, priv: PrivatePlayerInfo, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{    
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Generating witness")).then(() => generateWitness(NoWitchWASM, NoWitchZkey, ToNoWitchParameters(priv, tgs))).
    then(witness => { setLoadingString("Calling API"); return witness; }).then(witness => zkWitches.RespondAccusation_NoWitch(witness.a, witness.b, witness.c, [witness.inputs[0], witness.inputs[1]])).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()). 
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function WitchProof_Yes(setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Calling API")).then(() => zkWitches.RespondAccusation_YesWitch()).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).  
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function Surrender(setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Calling API")).then(() => zkWitches.Surrender()).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).  
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function KickActivePlayer(setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Calling API")).then(() => zkWitches.KickCurrentPlayer()).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).  
    catch(errorHandler).
    finally(() => setLoading(false));
}

async function SetTgs(new_tgs: TotalGameState, setLoading: (x : boolean) => void, setLoadingString: (x : string) => void ) : Promise<TotalGameState>
{
    return await new Promise((resolve, reject) => { setLoading(true); return resolve; } ).then(() => setLoadingString("Connecting To Contract")).then(() => connectContract()).
    then(() => setLoadingString("Calling API")).then(() => zkWitches.DEBUG_SetGameState(new_tgs)).
    then(txn => { setLoadingString("Waiting for transaction to process"); return txn }).then(txn => txn.wait()).
    then(() => setLoadingString("Fetching new state")).then(() => zkWitches.GetTGS()).  
    catch(errorHandler).
    finally(() => setLoading(false));
}

export class ZKBackend implements IZKBackend 
{
    private setLoading : (x : boolean) => void;
    private setLoadingString : (x : string) => void;

    private tgs?: TotalGameState;

    constructor(setLoadingIn: (x : boolean) => void, setLoadingStringIn: (x : string) => void) 
    {
        this.setLoading = setLoadingIn;
        this.setLoadingString = setLoadingStringIn;
    }

    GetTotalGameState(): TotalGameState | undefined 
    {
        return this.tgs;
    }

    async RefreshStatus(): Promise<void> 
    {
        this.tgs = await GetTgs(this.setLoading, this.setLoadingString);
    }

    async JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.tgs = await JoinGame(priv, this.setLoading, this.setLoadingString);
    }

    async DoAction(priv: PrivatePlayerInfo, action: ActionInfo, level: number): Promise<void> 
    {
        this.tgs = await Action(this.tgs as TotalGameState, priv, action, level, this.setLoading, this.setLoadingString);
    }

    async RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> 
    {
        this.tgs = await WitchProof(this.tgs as TotalGameState, priv, this.setLoading, this.setLoadingString);
    }

    async Surrender(): Promise<void> 
    {
        this.tgs = await Surrender(this.setLoading, this.setLoadingString);
    }

    async KickActivePlayer(): Promise<void> 
    {
        this.tgs = await KickActivePlayer(this.setLoading, this.setLoadingString);
    }

    async DebugSetTotalGameState(tgs_input: TotalGameState): Promise<void> 
    {
        this.tgs = await SetTgs(tgs_input, this.setLoading, this.setLoadingString);
    }
}