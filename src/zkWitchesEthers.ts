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



async function GetTgs() : Promise<TotalGameState> 
{
    await connectContract();

    let errorMsg;   

    let flat = await zkWitches.GetTGS().catch((error: any) => {
        console.log(error);
        if (error.reason) {
            errorMsg = error.reason;
        } else if (error.data.message) {
            errorMsg = error.data.message;
        } else {
            errorMsg = "Unknown error."
        }
    });

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    } 
    else if (!flat) 
    {
        throw "undefined return value";
    }

    return flat;
}

async function JoinGame(priv: PrivatePlayerInfo) : Promise<void>
{
    await connectContract().
    then(() => generateWitness(JoinWASM, JoinZKey, ToJoinParameters(priv))).
    then(witness => zkWitches.JoinGame(witness.a, witness.b, witness.c, [witness.inputs[0]])).
    then(txn => txn.wait()).
    catch((error: any) => {
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
    });

    console.log("Successfully Performed Proof-Based Join!")
}

async function Action(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo, level: number) : Promise<void>
{
    if (level != 0) 
    {
        return Action_Complex(tgs, priv, actionInfo, level);
    } 
    else 
    {
        return Action_Simple(tgs, priv, actionInfo);
    }
}

async function Action_Complex(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo, level: number) : Promise<void>
{    
    let actionWitnessParams = ToValidMoveParameters(priv, tgs, actionInfo.type, level);

    await connectContract().
    then(() => generateWitness(ActionWASM, ActionZKey, actionWitnessParams)).
    then(witness => zkWitches.ActionWithProof(actionInfo.target ?? 0, actionInfo.witchType ?? 0, witness.a, witness.b, witness.c, witness.inputs)).
    then(txn => txn.wait()).
    catch((error: any) => {
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
    });

    console.log("Successfully Performed Proof-Based Action!")
}

async function Action_Simple(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo) : Promise<void>
{
    await connectContract().
    then(() => zkWitches.ActionNoProof(actionInfo.type, actionInfo.target ?? 0, actionInfo.witchType ?? 0)).
    then(txn => txn.wait()).
    catch((error: any) => {
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
    });
}

async function WitchProof(tgs: TotalGameState, priv: PrivatePlayerInfo) : Promise<void> 
{
    let hasWitch : boolean = priv.witches[tgs.shared.accusationWitchType as number] == 1;

    if (!hasWitch) 
    {
        return WitchProof_No(tgs, priv);
    } 
    else 
    {
        return WitchProof_Yes();
    }
}

async function WitchProof_No(tgs: TotalGameState, priv: PrivatePlayerInfo) : Promise<void>
{    
    let noWitchWitnessParams = ToNoWitchParameters(priv, tgs);

    await connectContract().
    then(() => generateWitness(NoWitchWASM, NoWitchZkey, noWitchWitnessParams)).
    then(witness => zkWitches.RespondAccusation_NoWitch(witness.a, witness.b, witness.c, [witness.inputs[0], witness.inputs[1]])).
    then(txn => txn.wait()). 
    catch((error: any) => {
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
    });

    console.log("Successfully Performed Proof-Based Accusation Response!")
}

async function WitchProof_Yes() : Promise<void>
{
    await connectContract().
    then(() => zkWitches.RespondAccusation_YesWitch()).
    then(txn => txn.wait()). 
    catch((error: any) => {
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
    });
}

async function Surrender() : Promise<void>
{
    await connectContract().
    then(() => zkWitches.Surrender()).
    then(txn => txn.wait()). 
    catch((error: any) => {
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
    });
}

async function KickActivePlayer() : Promise<void>
{
    await connectContract().
    then(() => zkWitches.KickCurrentPlayer()).
    then(txn => txn.wait()). 
    catch((error: any) => {
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
    });
}

async function SetTgs(new_tgs: TotalGameState) : Promise<void>
{
    await connectContract().
    then(() => zkWitches.DEBUG_SetGameState(new_tgs)).
    then(txn => txn.wait()). 
    catch((error: any) => {
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
    });
}

export class ZKBackend implements IZKBackend 
{
    private tgs?: TotalGameState;

    GetTotalGameState(): TotalGameState | undefined 
    {
        return this.tgs;
    }

    async RefreshStatus(): Promise<void> 
    {
        this.tgs = await GetTgs();
        console.log(this.tgs);
    }

    async JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        await JoinGame(priv);
        await this.RefreshStatus();
    }

    async DoAction(priv: PrivatePlayerInfo, action: ActionInfo, level: number): Promise<void> 
    {
        await Action(this.tgs as TotalGameState, priv, action, level);
        await this.RefreshStatus();
    }

    async RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> 
    {
        await WitchProof(this.tgs as TotalGameState, priv);
        await this.RefreshStatus();    
    }

    async Surrender(): Promise<void> 
    {
        await Surrender();
        await this.RefreshStatus();
    }

    async KickActivePlayer(): Promise<void> 
    {
        await KickActivePlayer();
        await this.RefreshStatus();
    }

    async DebugSetTotalGameState(tgs_input: TotalGameState): Promise<void> 
    {
        await SetTgs(tgs_input);
        await this.RefreshStatus();
    }
}