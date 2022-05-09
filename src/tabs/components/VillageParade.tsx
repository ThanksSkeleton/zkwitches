import { Stack } from "@mui/material";
import { PrivatePlayerInfo } from "../../zkWitchesTypes";

export type ParadeProps = 
{
    priv: PrivatePlayerInfo
}

function HasCitizen(priv: PrivatePlayerInfo, citizen: number, count: number) : boolean 
{
    return priv.citizens[citizen] >= count;
}

function HasWitch(priv: PrivatePlayerInfo, citizen: number) : boolean 
{
    return priv.witches[citizen] == 1;
}

export default function Parade(props: ParadeProps) 
{
  return (
    <Stack direction="column" spacing={4}>
        <ParadeLine priv={props.priv} citizen={0} />
        <ParadeLine priv={props.priv} citizen={1} />
        <ParadeLine priv={props.priv} citizen={2} />
        <ParadeLine priv={props.priv} citizen={3} />
    </Stack>
  );
}

export type ParadeLineProps = 
{
    priv: PrivatePlayerInfo
    citizen: number
}

function ParadeLine(props : ParadeLineProps) 
{
    let citizen_images : string[] = []
    let witch_images : string[] = [] 

    return(
        <Stack direction="column" spacing={4}>
            { HasCitizen(props.priv, props.citizen, 1) && <img src={citizen_images[props.citizen]} />}
            { HasCitizen(props.priv, props.citizen, 2) && <img src={citizen_images[props.citizen]} />}
            { HasCitizen(props.priv, props.citizen, 3) && <img src={citizen_images[props.citizen]} />}
            { HasWitch(props.priv, props.citizen) && <img src={witch_images[props.citizen]} />}
        </Stack>
    );
}