import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import { Checkbox, Divider} from "@mui/material";
import Slider from "@mui/material/Slider";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { TotalGameState, PrivatePlayerInfo, GameStateEnum, DefaultTGS, DefaultPPI, IZKBackend, EmptyZKBackend } from "../zkWitchesTypes";
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
  NoData,
  CitizenSelector,
  WaitingOnOthersToJoin,
  MyAction,
  MyResponse,
  OtherTurn,
  GameOver,
  LoadingScreen,
}

function GetUIState(loading: boolean, myAddress: string, tgs?: TotalGameState, ppi?: PrivatePlayerInfo, ) : UIState
{
  if (loading) 
  {
    return UIState.LoadingScreen;
  } 
  else if (tgs == null) 
  {
    return UIState.NoData;
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
    if (ppi == null || tgs.shared.playerSlotWaiting == ppi.slot) // TODO Fix null check
    {
      return UIState.MyAction;
    } else {
      return UIState.OtherTurn;
    }
  } 
  else if (tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE) 
  {
    if (ppi == null || tgs.shared.playerSlotWaiting == ppi.slot) // TODO Fix null check
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

// export async function LoadingFlicker(set: React.Dispatch<React.SetStateAction<boolean>>, actualAction: Promise<void>): Promise<void> 
// {    
//   console.log("A1");
//   set(true);
//   console.log("A2");
//   await actualAction;
//   console.log("A3");
//   set(false);
//   console.log("A4");

// }

export default function Play() 
{
  const [priv, setPriv] = useState<PrivatePlayerInfo>(DefaultPPI());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingString, setLoadingString] = useState<string>("");

  let backend : IZKBackend = new EmptyZKBackend();

  function example() : Promise<void>
  {
    return new Promise(r => { setTimeout(r, 2000)});
  }

  const wrapper = (inner: () => Promise<void>, descrption: string) => async () => 
  {
    setIsLoading(true);
    setLoadingString(descrption);
    await inner();
    setIsLoading(false);
  }

  let state : UIState = GetUIState(isLoading, "fake", backend.GetTotalGameState(), priv);

  return (
    <Stack direction="column" spacing={4}>
      {state as UIState === UIState.NoData as UIState && <NoData action={wrapper(() => backend.RefreshStatus(), "Loading Initial Data")} />}

      {state as UIState === UIState.CitizenSelector as UIState && <CitizenSelector disabled={false} submit_action={wrapper(() => example(), "Selecting Citizens")} />}
      {state as UIState === UIState.WaitingOnOthersToJoin as UIState && <WaitingOnOthersToJoin />}
      {state as UIState === UIState.MyAction as UIState && <MyAction tgs={backend.GetTotalGameState()} priv={priv} backend={backend} />}
      {state as UIState === UIState.MyResponse as UIState && <MyResponse action={wrapper(() => backend.RespondToAccusation(priv), "Sending Response to Accusation")} response_description={""} />}
      {state as UIState === UIState.OtherTurn as UIState && <OtherTurn />}
      {state as UIState === UIState.GameOver as UIState && <GameOver />}

      {state as UIState === UIState.LoadingScreen as UIState && <LoadingScreen description={loadingString}/>}
    </Stack>
  );
}

// CITIZEN SELECTOR


type NoDataProps = 
{
  action: React.MouseEventHandler<HTMLButtonElement>;
}

function NoData(props: NoDataProps) 
{
  return (
    <Button
    onClick={props.action} >
    Fetch Data
    </Button>
  );
}



type CitizenSelectorProps = 
{
  disabled: boolean;
  submit_action: React.MouseEventHandler<HTMLButtonElement>;
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
    action: React.MouseEventHandler<HTMLButtonElement>;
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
              onClick={props.action}
              disabled={props.disabled}>
              Submit
          </Button>
      </Stack>
  );
}

type TypeSelectorProps =
{
  color: string; // TODO Doesnt WORK
  type: string;
}

function TypeSelector(props: TypeSelectorProps) {
  return (
      <Stack direction="row"
      spacing = {1}>
          <TextField label={props.type} variant="outlined" InputProps={{readOnly: true,}} />
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

type MyActionProps = 
{
  tgs: TotalGameState,
  priv: PrivatePlayerInfo,
  backend: IZKBackend,
}

function MyAction(props: MyActionProps) {

  // TODO FIX
  let enemyPlayerIds = [2,3,4];

  return (
    <Stack direction="column" spacing={4}>
      <ActivePlayer tgs={props.tgs} priv={props.priv} backend={props.backend} />
      <Divider variant="middle" />
      <EnemyPlayer enemyPlayerId={enemyPlayerIds[0]} actionProps={props} />
      <EnemyPlayer enemyPlayerId={enemyPlayerIds[1]} actionProps={props} />
      <EnemyPlayer enemyPlayerId={enemyPlayerIds[2]} actionProps={props} />      
    </Stack>
  );
}

function ActivePlayer(props: MyActionProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.priv.slot + " (You)"} variant="outlined" InputProps={{ readOnly: true,}} />
      <ResourceIndicator food={props.tgs.players[props.priv.slot].food} lumber={props.tgs.players[props.priv.slot].lumber} />
      <ActionTableau type={0} actionProps={props} />
      <ActionTableau type={1} actionProps={props} />
    </Stack>
  )
}

type EnemyProps = 
{
  enemyPlayerId: number,
  actionProps: MyActionProps,
}

function EnemyPlayer(props: EnemyProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.enemyPlayerId} variant="outlined" InputProps={{ readOnly: true,}} />
      <ResourceIndicator food={props.actionProps.tgs.players[props.enemyPlayerId].food} lumber={props.actionProps.tgs.players[props.enemyPlayerId].lumber} />
      <ActionTableau type={2} target={props.enemyPlayerId} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.enemyPlayerId} witchType={0} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.enemyPlayerId} witchType={1} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.enemyPlayerId} witchType={2} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.enemyPlayerId} witchType={3} actionProps={props.actionProps} />
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
  type: number;
  target?: number;
  witchType?: number;
  
  actionProps: MyActionProps;
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
  action: React.MouseEventHandler<HTMLButtonElement>;

  response_description: string
}

function MyResponse(props: MyResponseProps) 
{
  return (
    <Button
    onClick={props.action}
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

type LoadingScreenProps = {
  description: string
}

function LoadingScreen(props: LoadingScreenProps) 
{
  return (<TextField label={props.description} variant="outlined" InputProps={{ readOnly: true,}} />); 
}