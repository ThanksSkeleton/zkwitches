import { BigNumberish, ethers } from "ethers";
import zkWitchesArtifact from './artifacts/zkWitches.json';
import { ZkWitches } from './artifacts/ZkWitches_ABI_Types' 
import { targetChain } from "./chainInfo";

import { ActionInfo, DefaultTGS, IZKBackend, PlayerGameState, PrivatePlayerInfo, ToJoinParameters, TotalGameState, ToFlatStruct_TGS, FromFlatStruct_TGS } from "./zkWitchesTypes";

import { generateCalldata } from './zkWitches_js/generate_calldata';

let zkWitches: ZkWitches;

async function connectContract() {
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    console.log('signer: ', await signer.getAddress());

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

const JoinWASM : string = "/HC/HandCommitment.wasm";
const JoinZKey : string = "/HC/circuit_final.zkey";

const ActionWASM : string = "./public/VM/ValidMove.wasm";
const ActionZKey : string = "./public/VM/circuit_final.zkey";

const NoWitchWASM : string = "./public/NW/NoWitch.wasm";
const NoWitchZkey: string = "./public/NW/circuit_final.zkey";

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

    return FromFlatStruct_TGS(flat);
}

async function JoinGame(priv: PrivatePlayerInfo) : Promise<void>
{
    await connectContract();
    let witness = await generateWitness(JoinWASM, JoinZKey, ToJoinParameters(priv));
    let errorMsg;

    let txn = await zkWitches.JoinGame(witness.a, witness.b, witness.c, [witness.inputs[0]]) // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
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
    await connectContract();
    let witness = await generateWitness(ActionWASM, ActionZKey, [priv, tgs.players[priv.slot].WitchAlive, actionInfo.type, level]); // TODO FIX
    let errorMsg;

    let txn = await zkWitches.ActionWithProof(actionInfo.target ?? 0, actionInfo.witchType ?? 0, witness.a, witness.b, witness.c, witness.inputs) // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
}

async function Action_Simple(tgs: TotalGameState, priv: PrivatePlayerInfo, actionInfo: ActionInfo) : Promise<void>
{
    await connectContract();

    let errorMsg;

    let txn = await zkWitches.ActionNoProof(actionInfo.type as number, actionInfo.target as number, actionInfo.witchType as number) // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
}

async function WitchProof(tgs: TotalGameState, priv: PrivatePlayerInfo) : Promise<void> 
{
    let isComplex : boolean = false;

    if (isComplex) 
    {
        return WitchProof_No(priv);
    } 
    else 
    {
        return WitchProof_Yes(priv);
    }
}

async function WitchProof_No(priv: PrivatePlayerInfo) : Promise<void>
{
    await connectContract();
    let witness = await generateWitness(NoWitchWASM, NoWitchZkey, priv);
    let errorMsg;

    let txn = await zkWitches.RespondAccusation_NoWitch(witness.a, witness.b, witness.c, witness.inputs) // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
}

async function WitchProof_Yes(priv: PrivatePlayerInfo) : Promise<void>
{
    await connectContract();
    let errorMsg;

    let txn = await zkWitches.RespondAccusation_YesWitch() // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
}

async function Surrender() : Promise<void>
{
    await connectContract();
    let errorMsg;

    let txn = await zkWitches.Surrender() // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
}

async function KickActivePlayer() : Promise<void>
{
    await connectContract();
    let errorMsg;

    let txn = await zkWitches.KickCurrentPlayer() // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
}

async function SetTgs(new_tgs: TotalGameState) : Promise<void>
{
    await connectContract();
    let errorMsg;

    let flat = ToFlatStruct_TGS(new_tgs);

    let txn = await zkWitches.DEBUG_SetGameState(flat) // TODO Review
        .catch((error: any) => {
            console.log(error);
            if (error.reason) {
                errorMsg = error.reason;
            } else if (error.data.message) {
                errorMsg = error.data.message;
            } else {
                errorMsg = "Unknown error."
            }
        });

    console.log("transaction: ", txn);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }
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