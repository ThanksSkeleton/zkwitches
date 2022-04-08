import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Loading from './components/Loading';
import { generateWitness, mint } from "../zkPhoto";
import array2uri from "../util/array2uri";
import img2array from "../util/img2array";
import DropzoneComponent from "./components/DropzoneComponent";

export default function Mint() {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [nameDisable, setNameDisable] = useState(true);
    const [descDisable, setDescDisable] = useState(true);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [generating, setGenerating] = useState(false);
    const [minting, setMinting] = useState(false);
    const [converting, setConverting] = useState(false);
    const [image, setImage] = useState("");
    const [minted, setMinted] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [confirmation, setConfirmation] = useState("");

    const [fullImage, setFullImage] = useState("");
    const [imageDisable, setImageDisable] = useState(true);
    const [resizing, setResizing] = useState(false);
    const [key, setKey] = useState(0);

    const mintToken = async (event: any) => {
        event.preventDefault();
        setMinted(false);
        setError(false);

        setResizing(true);
        let tmp = img2array('preview-image');
        setFullImage(tmp.dataURL);
        setResizing(false);

        setGenerating(true);
        let witness = await generateWitness(tmp.data)
            .catch((error: any) => {
                setErrorMsg(error);
                setError(true);
                setGenerating(false);
                throw error;
            });
        setGenerating(false);

        setConverting(true);
        let tmpImage = array2uri(witness.d);
        setImage(tmpImage);
        setConverting(false);

        setMinting(true);
        let txn = await mint(name, description, tmpImage, witness)
            .catch((error: any) => {
                setErrorMsg(error);
                setError(true);
                setMinting(false);
                throw error;
            });
        setMinting(false);

        setConfirming(true);
        let tmpConfirmation = await txn.wait();
        console.log("tmpConfirmation: ", tmpConfirmation);
        setConfirmation(tmpConfirmation.transactionHash);
        setConfirming(false);

        setKey(key + 1);
        setImageDisable(true);

        setMinted(true);
        event.preventDefault();
        alert("Remember to save the full image for future use!")
    }

    const nameInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            setName(event.target.value);
            setNameDisable(false);
        }
        else {
            setNameDisable(true);
        }
    };

    const descInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            setDescription(event.target.value);
            setDescDisable(false);
        }
        else {
            setDescDisable(true);
        }
    };

    const enterHandler = async (event: any) => {
        if (event.which === "13") {
            event.preventDefault();
        }
    };

    return (
        <Box
            component="form"
            sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
                width: "99%", maxWidth: 600, margin: 'auto'
            }}
            noValidate
            autoComplete="off"
            textAlign="center"
        >
            <DropzoneComponent key={key} setDisable={setImageDisable} />
            <TextField
                id="token-name"
                label="Token Name (140 characters max.)"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: { maxLength: 140 }
                }}
                variant="filled"
                onChange={nameInputHandler}
                onKeyPress={enterHandler}
            /><br />
            <TextField
                id="token-desc"
                label="Token Description (280 char. max.)"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: { maxLength: 280 }
                }}
                variant="filled"
                onChange={descInputHandler}
                onKeyPress={enterHandler}
            /><br />
            <Button
                onClick={mintToken}
                disabled={(nameDisable || descDisable || imageDisable)}
                variant="contained">
                Mint Token
            </Button>
            <br /><br />
            {error ? <Alert severity="error">{errorMsg}</Alert> : <div />}
            {resizing ? <Loading text="Resizing and slicing..." /> : <div />}
            {generating ? <Loading text="Generating witnesses..." /> : <div />}
            {converting ? <Loading text="Converting image to URI..." /> : <div />}
            {minting ? <Loading text="Minting token. Please confirm in MetaMask..." /> : <div />}
            {confirming ? <Loading text="Waiting for transaction confirmation..." /> : <div />}
            {minted ? <Alert severity="success" sx={{ textAlign: "left" }}>Mint transaction confirmed: {confirmation}</Alert> : <div />}
            <br />
            {minted ? <figure><img src={fullImage} width="100%" alt="" /><figcaption>Full image</figcaption></figure> : <div />}
            {minted ? <figure><img src={image} width="100%" alt="" /><figcaption>Minted image</figcaption></figure> : <div />}
        </Box>
    );
}