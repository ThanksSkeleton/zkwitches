import { Stack } from "@mui/material";
import { PrivatePlayerInfo } from "../../zkWitchesTypes";
import farmer from '../../images/Farmer.gif';
import lumberjack from '../../images/Lumberjack.gif';
import brigand from '../../images/Brigand.gif';
import inquisitor from '../../images/Inquisitor.gif';
import foodWitch from '../../images/FoodWitch.gif';
import lumberWitch from '../../images/LumberWitch.gif';
import brigandWitch from '../../images/BrigandWitch.gif';
import inquisitorWitch from '../../images/InquisitorWitch.gif';

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
    <Stack direction="row" spacing={4}>
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
    let citizen_images : string[] = [farmer, lumberjack, brigand, inquisitor];
    let witch_images : string[] = [foodWitch, lumberWitch, brigandWitch, inquisitorWitch];

    return(
        <Stack direction="row" spacing={5}>
            { HasCitizen(props.priv, props.citizen, 1) && <img src={citizen_images[props.citizen]} style={{ width: 100 }} />}
            { HasCitizen(props.priv, props.citizen, 2) && <img src={citizen_images[props.citizen]} style={{ width: 100 }} />}
            { HasCitizen(props.priv, props.citizen, 3) && <img src={citizen_images[props.citizen]} style={{ width: 100 }} />}
            { HasWitch(props.priv, props.citizen) && <img src={witch_images[props.citizen]} style={{ width: 100 }} />}
        </Stack>
    );
}