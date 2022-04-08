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

import { getTokenURI, getTokenData } from "../zkPhoto";
import array2uri from '../util/array2uri';

export default function View() {

    const [tokenId, setTokenId] = useState("");
    const [disable, setDisable] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [metadata, setMetadata] = useState({
        "id": "",
        "name": "",
        "description": "",
        "image": ""
    });
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const submitTokenId = async (event: any) => {
        event.preventDefault();
        setError(false);
        setLoading(true);
        setLoaded(false);
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
            }
        }
        let tokenData = await getTokenData(parseInt(tokenId))
            .catch((error: any) => {
                setErrorMsg(error);
                setError(true);
                setLoading(false);
                throw error;
            });
        setImage(array2uri(tokenData));
        
        setLoading(false);
        setLoaded(true);
        event.preventDefault();
    }

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "" && event.target.value !== "0") {
            setTokenId(event.target.value);
            setDisable(false);
        }
        else {
            setDisable(true);
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
                sx={{ width: "99%", maxWidth: 600, margin: 'auto'}}
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
                            <TableCell><figure><img src={image} width="100%" alt="" /><figcaption>ZK image</figcaption></figure></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><figure><img src={metadata.image} width="100%" alt="" /><figcaption>URI image</figcaption></figure></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{image === metadata.image ? <Alert severity="success">Images match.</Alert> : <Alert severity="warning">Images do not match.</Alert>}</TableCell>
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
            }}
            noValidate
            autoComplete="off"
            textAlign="center"
        >
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
                onClick={submitTokenId}
                disabled={disable}
                variant="contained">
                View Token
            </Button>
            <br /><br />
            {error ? <Alert severity="error" sx={{ textAlign: "left"}}>{errorMsg}</Alert> : <div />}
            {!error && loaded && !loading ? <MetadataTable /> : <div />}
            {loading ? <Loading text="Loading tokenURI..." /> : <div />}
        </Box >
    );
}