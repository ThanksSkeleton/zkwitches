import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import { Checkbox, Divider} from "@mui/material";
import Slider from "@mui/material/Slider";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { TotalGameState, PrivatePlayerInfo, GameStateEnum } from "../zkWitchesTypes";
// import { GameStateEnum, PrivatePlayerInfo, TotalGameState } from "../zkwitchesValidation_start";

// CitizenSelector
// WaitingOnOthersToJoin
// MyAction
// MyResponse
// OtherTurn
// GameOver
// LoadingScreen

enum UIState 
{
  CitizenSelector,
  WaitingOnOthersToJoin,
  MyAction,
  MyResponse,
  OtherTurn,
  GameOver,
  LoadingScreen,
}

function GetUIState(tgs: TotalGameState, myAddress: string, ppi: PrivatePlayerInfo, loading: boolean) : UIState
{
  if (loading) 
  {
    return UIState.LoadingScreen;
  } 
  else if (tgs.shared.stateEnum == GameStateEnum.GAME_STARTING) 
  {
    if (tgs.playerAddresses.indexOf(myAddress) == -1) 
    {
      return UIState.CitizenSelector;
    } else {
      return UIState.WaitingOnOthersToJoin;
    }
  } 
  else if (tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_TURN) 
  {
    if (tgs.shared.playerSlotWaiting == ppi.slot) 
    {
      return UIState.MyAction;
    } else {
      return UIState.OtherTurn;
    }
  } 
  else if (tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE) 
  {
    if (tgs.shared.playerSlotWaiting == ppi.slot) 
    {
      return UIState.MyResponse;
    } else {
      return UIState.OtherTurn;
    }
  } else if (tgs.shared.stateEnum == GameStateEnum.GAME_OVER) {
    return UIState.GameOver;
  } else {
    throw("Unknown State");
  }
}


// YOUR RESPONSE
// NOT YOUR TURN
// GAME OVER
// LOADING

export default function Play() 
{

  let state : UIState = UIState.CitizenSelector;

  return (
    <Stack direction="column" spacing={4}>
      {state as UIState === UIState.CitizenSelector as UIState && <CitizenSelector disabled={false} submit_action={new Promise(r => { setTimeout(r, 2000)})} />}
      {state as UIState === UIState.WaitingOnOthersToJoin as UIState && <WaitingOnOthersToJoin />}
      {state as UIState === UIState.MyAction as UIState && <MyAction />}
      {state as UIState === UIState.MyResponse as UIState && <MyResponse action={new Promise(r => { setTimeout(r, 2000)})} response_description={""} />}
      {state as UIState === UIState.OtherTurn as UIState && <OtherTurn />}
      {state as UIState === UIState.GameOver as UIState && <GameOver />}
      {state as UIState === UIState.LoadingScreen as UIState && <LoadingScreen />}
    </Stack>
  );
}

// CITIZEN SELECTOR

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

// END CITIZEN SELECTOR

// WaitingOnOthersToJoin

type WaitingOnOthersToJoin = {} 

function WaitingOnOthersToJoin(props: WaitingOnOthersToJoin) 
{
  return (
    <Stack direction="column">
      <TextField label="Waiting on other players..." variant="outlined" InputProps={{ readOnly: true,}} /> // TODO IMPROVE
    </Stack>
  );
}

// MYACTION

type MyActionProps = {}

function MyAction(props: MyActionProps) {
  return (
    <Stack direction="column" spacing={4}>
      <ActivePlayer playerId={1} resourceIndicatorProps={{
        food: 0,
        lumber: 0
      }} farmerProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} lumberjackProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} />
      <Divider variant="middle" />
      <EnemyPlayer playerId={2} resourceIndicatorProps={{
        food: 0,
        lumber: 0
      }} brigandProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} inquisitorProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} />
      <EnemyPlayer playerId={3} resourceIndicatorProps={{
        food: 0,
        lumber: 0
      }} brigandProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} inquisitorProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} />
      <EnemyPlayer playerId={4} resourceIndicatorProps={{
        food: 0,
        lumber: 0
      }} brigandProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} inquisitorProps={{
        color: "",
        type: "",
        action_enabled: [],
        action_description: [],
        action: []
      }} />      
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
      <ActionTableau color={""} type={""} action_enabled={[]} action_description={[]} action={[]} />
      <ActionTableau color={""} type={""} action_enabled={[]} action_description={[]} action={[]} />
    </Stack>
  )
}

type EnemyPlayerProps = 
{
  playerId: number;

  resourceIndicatorProps : ResourceIndicatorProps,

  brigandProps : TableauProps,
  inquisitorProps: TableauProps,
}

function EnemyPlayer(props: EnemyPlayerProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.playerId} variant="outlined" InputProps={{ readOnly: true,}} />
      <ResourceIndicator food={props.resourceIndicatorProps.food} lumber={props.resourceIndicatorProps.lumber} />
      <ActionTableau color={""} type={""} action_enabled={[]} action_description={[]} action={[]} />
      <ActionTableau color={""} type={""} action_enabled={[]} action_description={[]} action={[]} />
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

type TableauProps =
{
  color: string; // TODO Doesnt WORK
  type: string;
  
  action_enabled : boolean[];
  action_description : string[];
  action : Promise<void>[];
}

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

// END MYACTION

// MyResponse
type MyResponseProps = 
{
  action: Promise<void>
  response_description: string
}

function MyResponse(props: MyResponseProps) 
{
  return (
    <Button
    onClick={() => props.action}
    >
    {props.response_description}
    </Button>
);
}

// END MyResponse

// OtherTurn

type OtherTurnProps = {}

function OtherTurn(props: OtherTurnProps) 
{
  return (<TextField label="Other Player's Turn." variant="outlined" InputProps={{ readOnly: true,}} />);
}

// GAMEOVER

type GameOverProps = {}

function GameOver(props: GameOverProps) 
{
  return (<TextField label="Game Over!" variant="outlined" InputProps={{ readOnly: true,}} />);
}

// END GAMEOVER

// LOADINGSCREEN

type LoadingScreenProps = {}

function LoadingScreen(props: LoadingScreenProps) 
{
  return (<TextField label="Loading..." variant="outlined" InputProps={{ readOnly: true,}} />); 
}