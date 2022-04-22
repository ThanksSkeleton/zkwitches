import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';

export function LumberTableau(props_outer) 
{
    return (
        <ActionTableau 
        color="lumber" 
        disabled={[false, true, true, true]} 
        type="Lumberjack" 
        actionDesc={["gather 1 lumber", "gather 2 lumber", "gather 3 lumber", "gather 4 lumber"]} 
        action={[{},{},{},{}]}
        />
    )
}

export function FoodTableau(props_outer) 
{
    return (
        <ActionTableau 
        color="food" 
        disabled={[false, true, true, true]} 
        type="Farmer" 
        actionDesc={["gather 1 food", "gather 2 food", "gather 3 food", "gather 4 food"]} 
        action={[{},{},{},{}]}
        />
    )
}

export function BrigandTableau(props_outer) 
{
    return (
        <ActionTableau 
        color="brigand" 
        disabled={[false, true, true, true]} 
        type="Brigand" 
        actionDesc={["Trade 2 food for 1 Lumber", "Trade 2 Lumber for 1 Food", "Steal 1 Lumber", "Steal 1 Food"]} 
        action={[{},{},{},{}]}
        />
    )
}

export function InquisitorTableau(props_outer) 
{
    return (
        <ActionTableau 
        color="inquisitor" 
        disabled={[false, true, true, true]} 
        type="Inquisitor" 
        actionDesc={["Inquisition for 3 Food 3 Lumber", "Inquisition for 2 Food 2 Lumber", "Inquisition for 1 Food 1 Lumber", "Inquisition for Free"]} 
        action={[{},{},{},{}]}
        />
    )
}

export default function ActionTableau(props) {
    return (
        <ButtonGroup
        variant="contained"
        orientation="vertical"
        aria-label="outlined button group"          
        color={props.color}
        >
          <Button
          onClick={props.action[3]}
          disabled={props.disabled[3]}
          >
          {props.type} 3 - {props.actionDesc[3]}
          </Button>
          <Button
          onClick={props.action[2]}
          disabled={props.disabled[2]}>
          {props.type} 2 - {props.actionDesc[2]}
          </Button>
          <Button
          onClick={props.action[1]}
          disabled={props.disabled[1]}>
          {props.type} 1 - {props.actionDesc[1]}
          </Button>
          <Button
          onClick={props.action[0]}
          disabled={props.disabled[0]}>
          {props.type} 0 - {props.actionDesc[0]}
          </Button>
        </ButtonGroup>
    );
}

