import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Loading  from "./components/Loading";
import { ButtonGroup, Checkbox, Chip, Divider, PaletteColorOptions, Slider } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';

import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';




// CitizenSelector
// WaitingOnOthersToJoin
// MyAction
// MyResponse
// OtherTurn
// GameOver
// Loading

enum UIState 
{
  CitizenSelector,
  WaitingOnOthersToJoin,
  MyAction,
  MyResponse,
  OtherTurn,
  GameOver,
  Loading,
}

function GetUIState(tgs: TotalGameState, loading: boolean) : UIState
{
  if (loading) 
  {
    return UIState.Loading;
  } else {
    
  }
}


// YOUR RESPONSE
// NOT YOUR TURN
// GAME OVER
// LOADING

export default function Play() 
{
  return (
    <Stack direction="column" spacing={4}>
      <CitizenSelector />
    </Stack>
  );

  // return (
  //   <Stack direction="column" spacing={4}>
  //     <ActivePlayer playerId={1} />
  //     <Divider variant="middle" />
  //     <EnemyPlayer playerId={2} />
  //     <EnemyPlayer playerId={3} />
  //     <EnemyPlayer playerId={4} />      
  //   </Stack>
  // );
}

export function Sending() 
{
  return (
    <Stack direction="column" spacing={1}>
      <Loading text="Creating Proof" />
      <Loading text="Sending Message" />
      <Loading text="Waiting For Confirmation" />
    </Stack>
  );
}

type TableauProps =
{
  color: string; // TODO Doesnt WORK
  type: string;
  
  action_enabled : boolean[];
  action_description : string[];
  action : Promise<void>[];
}

// function LumberTableau(props_outer) 
// {
//     return (
//         <ActionTableau 
//         color="lumber" 
//         disabled={[false, true, true, true]} 
//         type="Lumberjack" 
//         actionDesc={["gather 1 lumber", "gather 2 lumber", "gather 3 lumber", "gather 4 lumber"]} 
//         action={[{},{},{},{}]}
//         />
//     )
// }

// function FoodTableau(boolean[4]) 
// {
//     return (
//         <ActionTableau 
//         color="food" 
//         disabled={[false, true, true, true]} 
//         type="Farmer" 
//         actionDesc={["gather 1 food", "gather 2 food", "gather 3 food", "gather 4 food"]} 
//         action={[{},{},{},{}]}
//         />
//     )
// }

// function BrigandTableau(props_outer) 
// {
//     return (
//         <ActionTableau 
//         color="brigand" 
//         disabled={[false, true, true, true]} 
//         type="Brigand" 
//         actionDesc={["Trade 2 food for 1 Lumber", "Trade 2 Lumber for 1 Food", "Steal 1 Lumber", "Steal 1 Food"]} 
//         action={[{},{},{},{}]}
//         />
//     )
// }

// function InquisitorTableau(props_outer) 
// {
//     return (
//         <ActionTableau 
//         color="inquisitor" 
//         disabled={[false, true, true, true]} 
//         type="Inquisitor" 
//         actionDesc={["Inquisition for 3 Food 3 Lumber", "Inquisition for 2 Food 2 Lumber", "Inquisition for 1 Food 1 Lumber", "Inquisition for Free"]} 
//         action={[{},{},{},{}]}
//         />
//     )
// }

function ActionTableau(props: TableauProps) {
    return (
        <ButtonGroup
        variant="contained"
        orientation="vertical"
        aria-label="outlined button group"          
        //color={props.color}
        >
          <Button
          onClick={() => props.action[3]}
          disabled={!props.action_enabled[3]}
          >
          {props.type} 3 - {props.action_description[3]}
          </Button>
          <Button
          onClick={() => props.action[2]}
          disabled={!props.action_enabled[2]}>
          {props.type} 2 - {props.action_description[2]}
          </Button>
          <Button
          onClick={() => props.action[1]}
          disabled={!props.action_enabled[1]}>
          {props.type} 1 - {props.action_description[1]}
          </Button>
          <Button
          onClick={() => props.action[0]}
          disabled={!props.action_enabled[0]}>
          {props.type} 0 - {props.action_description[0]}
          </Button>
        </ButtonGroup>
    );
}

type TypeSelectorProps =
{
  color : string; // TODO Doesnt WORK
  type: string;
}

function TypeSelector(props: TypeSelectorProps) {
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
          // color={props.color} TODO FIX
          />
          <Checkbox 
          // color={props.color} TODO FIX
          // label="Witch"
          // labelPlacement="top"
          />
      </Stack>
  );
}

function valueText(value : number, index: number) 
{   
  return `${value}`;
}

type CompleteMeterProps =
{
    disabled: boolean;
    action: Promise<void>;
}

function CompleteMeter(props: CompleteMeterProps) 
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
              disabled 
          />
          <Button
              onClick={() => props.action}
              disabled={props.disabled}>
              Submit
          </Button>
      </Stack>
  );
}

type CitizenSelectorProps = 
{
  disabled: boolean;
  submit_action: Promise<void>;
}

function CitizenSelector(props: CitizenSelectorProps) 
{
  return (
      <Stack direction="column" spacing = {1}>
          <TypeSelector color="food" type="Farmer" />
          <TypeSelector color="lumber" type="Lumberjack" />
          <TypeSelector color="brigand" type="Brigand" />
          <TypeSelector color="inquisitor" type="Inquisitor" />
          <Divider variant="middle" />
          <CompleteMeter action={props.submit_action} disabled={props.disabled} />
      </Stack>
  );
}

type ActivePlayerProps = 
{
  playerId: number;

  resourceIndicatorProps : ResourceIndicatorProps,

  farmerProps : TableauProps,
  lumberjackProps: TableauProps,
}

function ActivePlayer(props: ActivePlayerProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.playerId + " (You)"} variant="outlined" InputProps={{ readOnly: true,}} />
      <ResourceIndicator food={props.resourceIndicatorProps.food} lumber={props.resourceIndicatorProps.lumber} />
      <ActionTableau />
      <LumberTableau />
    </Stack>
  )
}

type EnemyPlayerProps = 
{
  playerId: number;

  resourceIndicatorProps : ResourceIndicatorProps,

  farmerProps : TableauProps,
  lumberjackProps: TableauProps,
}

function EnemyPlayer(props: EnemyPlayerProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.playerId} variant="outlined" InputProps={{ readOnly: true,}} />
      <ResourceIndicator food={props.resourceIndicatorProps.food} lumber={props.resourceIndicatorProps.lumber} />
      <BrigandTableau />
      <InquisitorTableau />
    </Stack>
  )
}

type ResourceIndicatorProps = 
{
  food: number;
  lumber: number;
}

function ResourceIndicator(props: ResourceIndicatorProps) {
  return (
      <Stack direction="column"
      spacing = {1}>
        <Chip
        label={"food " + props.food}
        color="food"
        / >
        <Chip
        label={"lumber " + props.lumber}
        color="lumber"
        / >
      </Stack>
  );
}