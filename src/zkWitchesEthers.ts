import { ethers } from "ethers";
import address from './artifacts/address.json'
import zkWitchesArtifact from './artifacts/zkWitchesArtifact.json'
import { TotalGameState } from "./tabs/Play";

import { generateCalldata } from './zkPhoto_js/generate_calldata'

let zkWitches: ethers.Contract;

async function connectContract() {
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    console.log('signer: ', await signer.getAddress());

    zkWitches = new ethers.Contract(address['zkWitches'], zkWitchesArtifact.abi, signer);

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

const JoinWASM : string = "";
const JoinZKey : string = "";

const ActionWASM : string = "";
const ActionZKey : string = "";

const NoWitchWASM : string = "";
const NoWitchZkey: string = "";

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

async function joinGame(priv: PrivateUserData) : Promise<void>
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

async function Action(tgs: TotalGameState, priv: PrivateUserData) : Promise<void>
{
    let isComplex : boolean = false;

    if (isComplex) 
    {
        return Action_Complex(tgs, priv);
    } 
    else 
    {
        return Action_Simple(tgs, priv);
    }
}

async function Action_Complex(tgs: TotalGameState, priv: PrivateUserData) : Promise<void>
{
    await connectContract();
    let witness = await generateWitness(ActionWASM, ActionZKey, priv);
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

async function Action_Simple(tgs: TotalGameState, priv: PrivateUserData) : Promise<void>
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

async function WitchProof(priv: PrivateUserData) : Promise<void> 
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

async function WitchProof_No(priv: PrivateUserData) : Promise<void>
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

async function WitchProof_Yes(priv: PrivateUserData) : Promise<void>
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