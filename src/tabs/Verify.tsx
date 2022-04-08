import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from "@mui/material/Alert";
import Loading from './components/Loading';
import { generateWitness, getTokenURI, getTokenData } from "../zkPhoto";
import array2uri from "../util/array2uri";
import img2array from "../util/img2array";
import DropzoneComponent from "./components/DropzoneComponent";

export default function Upload() {

    const [tokenId, setTokenId] = useState("");
    const [idDisable, setIdDisable] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [metadata, setMetadata] = useState({
        "id": "",
        "name": "",
        "description": "",
        "image": ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [generating, setGenerating] = useState(false);
    const [converting, setConverting] = useState(false);

    const [fullImage, setFullImage] = useState("");
    const [zkImage, setZkImage] = useState("");
    const [tokenImage, setTokenImage] = useState("");

    const [imageDisable, setImageDisable] = useState(true);
    const [resizing, setResizing] = useState(false);
    const [key, setKey] = useState(0);

    const verifyToken = async (event: any) => {
        event.preventDefault();
        setError(false);
        setLoaded(false);

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
        setZkImage(tmpImage);
        setConverting(false);

        setLoading(true);
        let tokenURI = await getTokenURI(parseInt(tokenId))
            .catch((error: any) => {
                setErrorMsg(error);
                setError(true);
                setLoading(false);
                throw error;
            });
        if (tokenURI) {
            const response = await fetch(tokenURI);
            const json = await response.json();
            if (json) {
                setMetadata({ ...json, "id": tokenId });
                setLoaded(true);
            }
        }
        let tokenData = await getTokenData(parseInt(tokenId))
            .catch((error: any) => {
                setErrorMsg(error);
                setError(true);
                setLoading(false);
                throw error;
            });
        setTokenImage(array2uri(tokenData));

        setKey(key+1);
        setImageDisable(true);

        setLoading(false);
        setLoaded(true);
        event.preventDefault();
    }

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "" && event.target.value !== "0") {
            setTokenId(event.target.value);
            setIdDisable(false);
        }
        else {
            setIdDisable(true);
        }
    };

    const enterHandler = async (event: any) => {
        if (event.which === "13") {
            event.preventDefault();
        }
    };


    const keyHandler = async (event: any) => {
        if (['e', 'E', '+', '-', '.', 'Enter'].includes(event.key)) {
            event.preventDefault();
        }
    };

    function MetadataTable() {
        return (
            <TableContainer
                component={Paper}
                sx={{ width: "99%", maxWidth: 600, margin: 'auto' }}
            >
                <Table aria-label="spanning table">
                    <TableBody>
                        <TableRow>
                            <TableCell>Token ID: {metadata.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Name: {metadata.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Description: {metadata.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><figure><img src={fullImage} width="100%" alt="" /><figcaption>Uploaded image</figcaption></figure></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><figure><img src={zkImage} width="100%" alt="" /><figcaption>Downsized image</figcaption></figure></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><figure><img src={tokenImage} width="100%" alt="" /><figcaption>ZK image</figcaption></figure></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><figure><img src={metadata.image} width="100%" alt="" /><figcaption>URI image</figcaption></figure></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{tokenImage === metadata.image && zkImage === tokenImage ? <Alert severity="success">Images match.</Alert> : <Alert severity="warning">Images do not match.</Alert>}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

            </TableContainer>
        )
    }

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
                id="token-id"
                label="Token ID"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: { min: 1 }
                }}
                variant="filled"
                onKeyDown={keyHandler}
                onChange={inputHandler}
                onKeyPress={enterHandler}
            /><br />
            <Button
                onClick={verifyToken}
                disabled={(idDisable || imageDisable)}
                variant="contained">
                Verify Token
            </Button>
            <br /><br />
            {resizing ? <Loading text="Resizing and slicing..." /> : <div />}
            {generating ? <Loading text="Generating witnesses..." /> : <div />}
            {converting ? <Loading text="Converting image to URI..." /> : <div />}
            {loading ? <Loading text="Loading tokenURI..." /> : <div />}
            {error ? <Alert severity="error" sx={{ textAlign: "left" }}>{errorMsg}</Alert> : <div />}
            {!error && loaded && !loading ? <MetadataTable /> : <div />}
        </Box>
    );
}