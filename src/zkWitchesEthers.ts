import { ethers } from "ethers";
import zkWitchesArtifact from './artifacts/zkWitches.json';

import { ActionInfo, DefaultTGS, IZKBackend, PlayerGameState, PrivatePlayerInfo, TotalGameState } from "./zkWitchesTypes";

import { generateCalldata } from './zkWitches_js/generate_calldata';
import targetChain from "./WalletConnector";

let zkWitches: ethers.Contract;

async function connectContract() {
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    console.log('signer: ', await signer.getAddress());

    zkWitches = new ethers.Contract(targetChain().props['address'], zkWitchesArtifact.abi, signer);

    console.log("Connect to zkWitches Contract:", zkWitches);
}

type witness = 
{
    a: any;
    b: any;
    c: any;
    inputs : any;
}

async function generateWitness(wasmfile: string, zkeyPath: string, inputData: any) : Promise<witness> {
    let a = [];
    let b = [];
    let c = [];
    let inputs = [];
    let errorString = 'Fail to generate witness.'

    let calldata = await generateCalldata(wasmfile, zkeyPath, inputData);
    if (!calldata) throw errorString;
    console.log('calldata generated');
    a.push(calldata[0]);
    b.push(calldata[1]);
    c.push(calldata[2]);
    inputs.push(calldata[3]);

    return { a, b, c, inputs };
}

const JoinWASM : string = "./public/HC/HandCommitment.wasm";
const JoinZKey : string = "./public/HC/circuit_final.zkey";

const ActionWASM : string = "./public/VM/ValidMove.wasm";
const ActionZKey : string = "./public/VM/circuit_final.zkey";

const NoWitchWASM : string = "./public/NW/NoWitch.wasm";
const NoWitchZkey: string = "./public/NW/circuit_final.zkey";

async function GetTgs() : Promise<TotalGameState> 
{
    await connectContract();

    let errorMsg;
    let tgs = await zkWitches.getTGS().catch((error: any) => {
        console.log(error);
        if (error.reason) {
            errorMsg = error.reason;
        } else if (error.data.message) {
            errorMsg = error.data.message;
        } else {
            errorMsg = "Unknown error."
        }
    }); // TODO Review

    //console.log("tokenData: ", tokenData);

    if (errorMsg) {
        //console.log("error: ", errorMsg);
        throw errorMsg;
    }

    return tgs;
}

async function JoinGame(priv: PrivatePlayerInfo) : Promise<void>
{
    await connectContract();
    let witness = await generateWitness(JoinWASM, JoinZKey, priv);
    let errorMsg;

    let txn = await zkWitches.joinGame(witness.a, witness.b, witness.c, witness.inputs) // TODO Review
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
    let witness = await generateWitness(ActionWASM, ActionZKey, [priv, tgs.players[priv.slot].WitchAlive, level]); // TODO FIX
    let errorMsg;

    let txn = await zkWitches.ActionComplex(witness.a, witness.b, witness.c, witness.inputs) // TODO Review
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

    let txn = await zkWitches.ActionSimple(tgs, priv) // TODO Review
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

    let txn = await zkWitches.WitchNo(witness.a, witness.b, witness.c, witness.inputs) // TODO Review
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

    let txn = await zkWitches.WitchYes() // TODO Review
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

    let txn = await zkWitches.KickActivePlayer() // TODO Review
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

    let txn = await zkWitches.SetTgs(new_tgs) // TODO Review
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
    

    private tgs: TotalGameState = DefaultTGS();

    GetTotalGameState(): TotalGameState 
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
        await Action(this.tgs, priv, action, level);
        await this.RefreshStatus();
    }

    async RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> 
    {
        await WitchProof(this.tgs, priv);
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