import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import { Checkbox, Divider} from "@mui/material";
import Slider from "@mui/material/Slider";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { TotalGameState, PrivatePlayerInfo, GameStateEnum, DefaultTGS, DefaultPPI, IZKBackend, ActionInfo, Total, StartActionTGS, RespondToAccusationTGS, Empty, GetSlot } from "../zkWitchesTypes";
import { ZKBackend, LoadingWidgetOutput, EventRepresentation } from "../zkWitchesEthers";
import { IsEnabled, ShortDescription, type_string } from "../Descriptions";
import { ethers } from "ethers";
import { PrivMapper } from "../TabPanel";

enum UIState 
{
  NoData,  
  LoadingScreen,

  CitizenSelector,

  MyAction,
  MyResponse,

  OtherTurn,
}

function GetUIState(loading: boolean, myAddress?: string, tgs?: TotalGameState, priv?: PrivatePlayerInfo ) : UIState
{
  let slot = GetSlot(tgs, myAddress);


  if (loading) 
  {
    return UIState.LoadingScreen;
  } 
  else if (tgs === undefined || myAddress === undefined) 
  {
    return UIState.NoData;
  } else if (tgs.shared.stateEnum == GameStateEnum.GAME_STARTING && slot == undefined) 
  {
    return UIState.CitizenSelector;
  } 
  else if (tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_TURN && (priv == null || tgs.shared.playerSlotWaiting == slot)) 
  {
    return UIState.MyAction;
  } 
  else if (tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE && (priv == null || tgs.shared.playerSlotWaiting == slot)) 
  {
    return UIState.MyResponse;
  } else {
    return UIState.OtherTurn;
  }
}

//{state as UIState != UIState.NoData as UIState && <EventList events={backend.GetEvents()} /> }

type PlayProps = 
{
  isLoading : boolean
  loadingString: string,

  privMapper : PrivMapper, 

  backend: IZKBackend

  widget: LoadingWidgetOutput
}

export default function Play(props: PlayProps) 
{
  let tgs = props.backend.GetTotalGameState();

  let priv : PrivatePlayerInfo | undefined;
  if (tgs != null)
  {
    priv = props.privMapper.Get(tgs.shared.gameId as number);
  }

  let state : UIState = GetUIState(props.isLoading, props.backend.GetAddress(), props.backend.GetTotalGameState(), priv);
  let slot = GetSlot(props.backend.GetTotalGameState(), props.backend.GetAddress());

  return (
    <Stack direction="column" spacing={4}>
      {state as UIState === UIState.NoData as UIState && <NoData action={() => props.backend.RefreshStatus()} />}

      {state as UIState === UIState.CitizenSelector as UIState && <CitizenSelector priv={priv as PrivatePlayerInfo} privMapper={props.privMapper} backend={props.backend} widget={props.widget}/>}
      {state as UIState === UIState.MyAction as UIState && <MyAction slot={slot as number} tgs={tgs as TotalGameState} priv={priv as PrivatePlayerInfo} backend={props.backend} />}
      {state as UIState === UIState.MyResponse as UIState && <MyResponse action={() => props.backend.RespondToAccusation(priv as PrivatePlayerInfo, slot as number)} response_description={"Respond to Accusation"} />}
      
      {state as UIState === UIState.OtherTurn as UIState && <OtherTurn tgs={tgs as TotalGameState} address={props.backend.GetAddress() as string} />}

      {state as UIState === UIState.LoadingScreen as UIState && <LoadingScreen description={props.loadingString}/>}

      { props.backend.IsAdmin() && <DebugMenu backend={props.backend} address={props.backend.GetAddress() as string}/> }
    </Stack>
  );
}


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
  priv: PrivatePlayerInfo;
  privMapper: PrivMapper;
  backend: IZKBackend
  widget: LoadingWidgetOutput
}

function CitizenSelector(props: CitizenSelectorProps) 
{
 

  return (
      <Stack direction="column" spacing = {1}>
          <TypeSelector typeIndex={0} priv={props.priv} privMapper={props.privMapper} widget={props.widget} />
          <TypeSelector typeIndex={1} priv={props.priv} privMapper={props.privMapper} widget={props.widget} />
          <TypeSelector typeIndex={2} priv={props.priv} privMapper={props.privMapper} widget={props.widget} />
          <TypeSelector typeIndex={3} priv={props.priv} privMapper={props.privMapper} widget={props.widget} />
          <Divider variant="middle" />
          <CompleteMeter action={() => { props.privMapper.SaveActive(); props.backend.JoinGame(props.priv);  } } priv={props.priv} />
      </Stack>
  );
}


function valueText(value : number, index: number) 
{   
  return `${value}`;
}

type CompleteMeterProps =
{
    action: React.MouseEventHandler<HTMLButtonElement>;
    priv: PrivatePlayerInfo; 
}

function CompleteMeter(props: CompleteMeterProps) 
{
  let sliderMark = [{value:7, label:"7"}];

  let total = Total(props.priv);

  return (
      <Stack direction="row"
      spacing = {1}>            
          <Slider
              aria-label="Total Meter"
              value={total}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={8}
              disabled
              color={total === 7 ? "primary" : "secondary"} 
              marks={sliderMark}
          />
          <Button
              onClick={props.action}
              disabled={!(total === 7)}>
              Submit
          </Button>
      </Stack>
  );
}

type TypeSelectorProps =
{
  typeIndex: number

  priv: PrivatePlayerInfo;
  privMapper: PrivMapper;
  widget: LoadingWidgetOutput
}

function TypeSelector(props: TypeSelectorProps) {

  let labelString = type_string[props.typeIndex];
  
  const handleChangeCheckBox = (event: any) => 
  {
    console.log("checkbox newValue ", event.target.checked);
    props.priv.witches[props.typeIndex] = (event.target.checked ? 0 : 1);
    console.log("checkbox priv ", props.priv);
    props.privMapper.SaveActive();
    props.widget.Bump();
  };

  const handleChangeSlider = (event: any, newValue:number|number[]) => 
  {
    console.log("slider newValue ", newValue);
    props.priv.citizens[props.typeIndex] = newValue as number;
    console.log("slider priv ", props.priv);
    props.privMapper.SaveActive();
    props.widget.Bump();
  };

  return (
      <Stack direction="row"
      spacing = {1}>
          <TextField label={labelString} variant="outlined" InputProps={{readOnly: true,}} />
          <Slider
          aria-label={labelString + " Selector"}
          value={props.priv.citizens[props.typeIndex]}
          getAriaValueText={valueText}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={3}
          onChangeCommitted={handleChangeSlider}
          // color={props.color} TODO FIX
          />
          <TextField label="Witch" variant="outlined" InputProps={{readOnly: true,}} />
          <Checkbox
          checked={props.priv.witches[props.typeIndex] == 1}
          onClick={handleChangeCheckBox}
          // color={props.color} TODO FIX
          // label="Witch"
          // labelPlacement="top"
          />
      </Stack>
  );
}

// END CITIZEN SELECTOR

// MYACTION

type MyActionProps = 
{
  tgs: TotalGameState,
  priv: PrivatePlayerInfo,
  slot: number,
  backend: IZKBackend,
}

function MyAction(props: MyActionProps) {

  // TODO FIX
  let allPlayerIds = [0,1,2,3];
  let enemyPlayerIds = allPlayerIds.filter((value, index, arr) => value != props.slot);

  return (
    <Stack direction="column" spacing={4}>
      <ActivePlayer slot={props.slot} tgs={props.tgs} priv={props.priv} backend={props.backend} />
      <Divider variant="middle" />
      <EnemyPlayer slot={enemyPlayerIds[0]} actionProps={props} />
      <EnemyPlayer slot={enemyPlayerIds[1]} actionProps={props} />
      <EnemyPlayer slot={enemyPlayerIds[2]} actionProps={props} />      
    </Stack>
  );
}

function ActivePlayer(props: MyActionProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <PlayerIndicator slot={props.slot} address={props.tgs.addresses[props.slot]} is_player={true} is_empty={false} tgs={props.tgs} />
      <ActionTableau type={0} actionProps={props} />
      <ActionTableau type={1} actionProps={props} />
    </Stack>
  )
}

type EnemyProps = 
{
  slot: number,

  actionProps: MyActionProps,
}

function EnemyPlayer(props: EnemyProps)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <PlayerIndicator slot={props.slot} address={props.actionProps.tgs.addresses[props.slot]} is_player={false} is_empty={false} tgs={props.actionProps.tgs} />
      <ActionTableau type={2} target={props.slot} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.slot} witchType={0} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.slot} witchType={1} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.slot} witchType={2} actionProps={props.actionProps} />
      <ActionTableau type={3} target={props.slot} witchType={3} actionProps={props.actionProps} />
    </Stack>
  )
}

type PlayerIndicatorProps = 
{
  slot: number,
  address: string,
  
  is_player: boolean,
  is_empty: boolean,

  tgs: TotalGameState
}

function PlayerIndicator(props : PlayerIndicatorProps) 
{
  let slotText = "Player " + props.slot;
  let colon = props.is_player ? " (You):" : ":";
  let addressString = props.is_empty ? "empty" : (props.address.substring(0, 6) + "...");

  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={ slotText + colon + addressString } variant="outlined" InputProps={{ readOnly: true,}} />
      <ResourceIndicator food={props.tgs.players[props.slot].food as number} lumber={props.tgs.players[props.slot].lumber as number} />
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

type TableauProps =
{
  type: number;
  target?: number;
  witchType?: number;
  
  actionProps: MyActionProps;
}

function ActionTableau(props: TableauProps) {

    let actionInfo : ActionInfo = { type : props.type, target : props.target ?? -1 , witchType : props.witchType ?? -1 };

    let buttons = [];
    for(var actionLevel = 3; actionLevel>=0; actionLevel--) 
    {
      buttons.push(<Button
      onClick={() => props.actionProps.backend.DoAction(props.actionProps.priv, props.actionProps.slot, actionInfo, actionLevel)}
      disabled={!IsEnabled(props.actionProps.tgs, props.actionProps.priv, props.actionProps.slot, actionInfo.type, actionInfo.target, actionInfo.witchType, actionLevel)}
      >
      {ShortDescription(actionInfo.type, actionInfo.target, actionInfo.witchType, actionLevel)}
      </Button>)
    }

    return (
        <ButtonGroup
        variant="contained"
        orientation="vertical"
        aria-label="outlined button group"          
        //color={colors[props.type]} TODO FIX
        >
          { buttons }
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

type OtherTurnProps = {
  tgs: TotalGameState
  address: string
}

function OtherTurn(props: OtherTurnProps) 
{
  return (
    <Stack direction="column" spacing={4}>
      <OtherTurnPlayer slot={0} tgs={props.tgs} address={props.address}/>
      <OtherTurnPlayer slot={1} tgs={props.tgs} address={props.address}/>
      <OtherTurnPlayer slot={2} tgs={props.tgs} address={props.address}/>
      <OtherTurnPlayer slot={3} tgs={props.tgs} address={props.address}/>
    </Stack>
  );
}

type OtherTurnPlayerProps = {
  tgs: TotalGameState
  slot: number
  address: string
}

function OtherTurnPlayer(props: OtherTurnPlayerProps) 
{
    let emptyPlayer : boolean = props.tgs.shared.currentNumberOfPlayers <= props.slot;
    let isPlayer : boolean = props.tgs.addresses[props.slot] == props.address;

    let waitingText : string= "";
    if (props.tgs.shared.stateEnum == GameStateEnum.GAME_STARTING && emptyPlayer)
    {
      waitingText = "Waiting for a new player to join."
    }
    else if (props.tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_TURN && props.slot == props.tgs.shared.playerSlotWaiting) 
    {
       waitingText = "Waiting for this player to take move."
    } 
    else if (props.tgs.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE && props.slot == props.tgs.shared.playerSlotWaiting) 
    {
      waitingText = "Waiting for this player to respond to accusation."
    }

    return (
    <Stack direction="row" spacing = {1}>
      <PlayerIndicator slot={props.slot} address={props.tgs.addresses[props.slot]} is_player={isPlayer} is_empty={emptyPlayer} tgs={props.tgs} />
      {waitingText}
    </Stack>
    );
}


// LOADINGSCREEN

type LoadingScreenProps = {
  description: string
}

function LoadingScreen(props: LoadingScreenProps) 
{
  return (<TextField label={props.description} variant="outlined" InputProps={{ readOnly: true,}} />); 
}

// DebugMenu 

type EventListProps = 
{
  events: EventRepresentation[]
}

function EventList(props: EventListProps) 
{
    let chips = []
    for (let i = 0; i< props.events.length; i++) 
    {
      chips.push(<Chip label={props.events[i].text + " " + props.events[i].timestamp} color="default"></Chip>)
    }
    return (
      <Stack direction="row" spacing = {1}>
        {chips}
      </Stack>
      );
}

type DebugMenuProps = 
{
  backend : IZKBackend
  address: string
}

function DebugMenu(props: DebugMenuProps) 
{

  let start = DefaultTGS();
  let actionReady = StartActionTGS(props.address);
  let respondToAccusation = RespondToAccusationTGS(props.address);

  return (
    <Stack direction="row" spacing = {1} sx={{
    position: "fixed",
    bottom: (theme) => theme.spacing(2),
    left: (theme) => theme.spacing(2)
    }}
    >
      <TextField label="Choose Demo:" variant="outlined" InputProps={{ readOnly: true,}} />
      <Button onClick={() => props.backend.DebugSetTotalGameState(start)}>DEMO: JOIN</Button>
      <Button onClick={() => props.backend.DebugSetTotalGameState(actionReady)}>DEMO: ACTION</Button>
      <Button onClick={() => props.backend.DebugSetTotalGameState(respondToAccusation)}>DEMO: RESPOND TO ACCUSATION</Button>
    </Stack>);
}


