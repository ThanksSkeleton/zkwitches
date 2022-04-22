import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";

export function TypeSelector(props) {
    return (
        <Stack direction="row"
        spacing = {1}>
            <TextField label={props.type} variant="outlined" InputProps={{ readOnly: true,}} />
            <Slider
            aria-label={props.type + " Selector"}
            defaultValue={0}
            getAriaValueText={valueText}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={3}
            color={props.color}
            valueLabelDisplay="on"
            />
            <Checkbox 
            color={props.color}           
            label="Witch"
            labelPlacement="top"/>
        </Stack>
    );
}

function valueText(value) 
{   
    return `${value}`;
}

export function CompleteMeter(props) 
{
    return (
        <Stack direction="row"
        spacing = {1}>            
            <Slider
                aria-label="Total Meter"
                defaultValue={0}
                getAriaValueText={valueText}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={7}
                valueLabelDisplay="on"
                disabled 
            />
            <Button
                onClick={props.action}
                disabled={props.disabled}>
                Submit
            </Button>
        </Stack>
    );
}

export default function CitizenSelector(props) 
{
    return (
        <Stack direction="column" spacing = {1}>
            <TypeSelector color="food" type="Farmer" />
            <TypeSelector color="lumber" type="Lumberjack" />
            <TypeSelector color="brigand" type="Brigand" />
            <TypeSelector color="inquisitor" type="Inquisitor" />
            <Divider variant="middle" />
            <CompleteMeter action="foo" disabled="true" />
        </Stack>
    );
}