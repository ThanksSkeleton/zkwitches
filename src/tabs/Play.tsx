import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import { Checkbox, Divider} from "@mui/material";
import Slider from "@mui/material/Slider";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import { TotalGameState, PrivatePlayerInfo, GameStateEnum, DefaultTGS, DefaultPPI, IZKBackend, EmptyZKBackend, ActionInfo, WrappedZKBackend, Total, StartActionTGS, RespondToAccusationTGS } from "../zkWitchesTypes";
import { ZKBackend, signerAddress } from "../zkWitchesEthers";

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
  else if (tgs === undefined) 
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

export default function Play() 
{
  const [priv, setPriv] = useState<PrivatePlayerInfo>(DefaultPPI());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingString, setLoadingString] = useState<string>("");

  const [backend] = useState<IZKBackend>(new WrappedZKBackend(new ZKBackend(), setIsLoading, setLoadingString));

  let state : UIState = GetUIState(isLoading, "fake", backend.GetTotalGameState(), priv);

  console.log("master priv ", priv);
  console.log("master tgs ", backend.GetTotalGameState());

  return (
    <Stack direction="column" spacing={4}>
      {state as UIState === UIState.NoData as UIState && <NoData action={() => backend.RefreshStatus()} />}

      {state as UIState === UIState.CitizenSelector as UIState && <CitizenSelector priv={priv} setPriv={setPriv} backend={backend} />}
      {state as UIState === UIState.WaitingOnOthersToJoin as UIState && <WaitingOnOthersToJoin />}
      {state as UIState === UIState.MyAction as UIState && <MyAction tgs={backend.GetTotalGameState() as TotalGameState} priv={priv} backend={backend} />}
      {state as UIState === UIState.MyResponse as UIState && <MyResponse action={() => backend.RespondToAccusation(priv)} response_description={"Respond to Accusation"} />}
      {state as UIState === UIState.OtherTurn as UIState && <OtherTurn />}
      {state as UIState === UIState.GameOver as UIState && <GameOver />}

      {state as UIState === UIState.LoadingScreen as UIState && <LoadingScreen description={loadingString}/>}
      <DebugMenu backend={backend} address={signerAddress}/>
    </Stack>
  );
}


let colors = ["food", "lumber", "brigand", "inquisitor"];
let type_string = ["Farmer", "LumberJack", "Brigand", "Inquisitor"];

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

// CITIZEN SELECTOR

type CitizenSelectorProps = 
{
  priv: PrivatePlayerInfo;
  setPriv: React.Dispatch<React.SetStateAction<PrivatePlayerInfo>>
  backend: IZKBackend
}

function CitizenSelector(props: CitizenSelectorProps) 
{

  let total = Total(props.priv);

  return (
      <Stack direction="column" spacing = {1}>
          <TypeSelector typeIndex={0} priv={props.priv} setPriv={props.setPriv} />
          <TypeSelector typeIndex={1} priv={props.priv} setPriv={props.setPriv} />
          <TypeSelector typeIndex={2} priv={props.priv} setPriv={props.setPriv} />
          <TypeSelector typeIndex={3} priv={props.priv} setPriv={props.setPriv} />
          <Divider variant="middle" />
          <CompleteMeter action={() => props.backend.JoinGame(props.priv)} total={total} />
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
    total: number 
}

function CompleteMeter(props: CompleteMeterProps) 
{
  let sliderMark = [{value:7, label:"7"}];

  return (
      <Stack direction="row"
      spacing = {1}>            
          <Slider
              aria-label="Total Meter"
              defaultValue={props.total}
              value={props.total}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={8}
              disabled
              color={props.total === 7 ? "primary" : "secondary"} 
              marks={sliderMark}
          />
          <Button
              onClick={props.action}
              disabled={!(props.total === 7)}>
              Submit
          </Button>
      </Stack>
  );
}

type TypeSelectorProps =
{
  typeIndex: number

  priv: PrivatePlayerInfo;
  setPriv: React.Dispatch<React.SetStateAction<PrivatePlayerInfo>>
}

function TypeSelector(props: TypeSelectorProps) {

  const [slider, setSlider] = useState(props.priv.citizens[props.typeIndex]);
  const [checked, setChecked] = useState(props.priv.witches[props.typeIndex] == 1);

  let labelString = type_string[props.typeIndex];
  
  const handleChangeCheckBox = (event: any) => 
  {
    setChecked(event.target.checked);
    console.log("checkbox newValue ", event.target.checked);
    props.priv.witches[props.typeIndex] = (event.target.checked ? 1 : 0);
    console.log("checkbox priv ", props.priv);
    props.setPriv({... props.priv})
  };

  const handleChangeSlider = (event: any, newValue:number|number[]) => 
  {
    setSlider(newValue as number);
    console.log("slider newValue ", newValue);
    props.priv.citizens[props.typeIndex] = newValue as number;
    console.log("slider priv ", props.priv);
    props.setPriv({... props.priv})
  };

  return (
      <Stack direction="row"
      spacing = {1}>
          <TextField label={labelString} variant="outlined" InputProps={{readOnly: true,}} />
          <Slider
          aria-label={labelString + " Selector"}
          defaultValue={slider}
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
          checked={checked}
          onChange={handleChangeCheckBox}
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
  let enemyPlayerIds = [1,2,3];

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

type TableauProps =
{
  type: number;
  target?: number;
  witchType?: number;
  
  actionProps: MyActionProps;
}

function ActionTableau(props: TableauProps) {
  // TODO Ugly

  let description_grid = [
                          ["gather 1 food", "gather 2 food", "gather 3 food", "gather 4 food"],
                          ["gather 1 lumber", "gather 2 lumber", "gather 3 lumber", "gather 4 lumber"],
                          ["Trade 2 food for 1 Lumber", "Trade 2 Lumber for 1 Food", "Steal 1 Lumber", "Steal 1 Food"], 
                          ["Inquisition for 3 Food 3 Lumber", "Inquisition for 2 Food 2 Lumber", "Inquisition for 1 Food 1 Lumber", "Inquisition for Free"]
                         ];
  
                         // TODO WitchType

  function HaveCitizens(priv: PrivatePlayerInfo, tgs: TotalGameState, citizen_type: number, count_required: number ) : boolean 
  {
    return (priv.citizens[citizen_type] >= count_required || (priv.witches[citizen_type] == 1 && tgs.players[priv.slot].WitchAlive[citizen_type] == 1))
  } 

  function HasFoodAndLumber(tgs: TotalGameState,  food_req: number, lumber_req: number, playerId?: number) : boolean 
  {
    if ( playerId == undefined ) return false;  
    return (tgs.players[playerId].food >= food_req && tgs.players[playerId].lumber >= lumber_req);
  }

  function WitchAlive(tgs: TotalGameState, playerId?: number, witch_type?: number) : boolean 
  {
    if ( playerId == undefined ) return false;  
    if ( witch_type == undefined ) return false;  
    return (tgs.players[playerId].WitchAlive[witch_type] == 1); 
  }

  let priv = props.actionProps.priv;
  let tgs = props.actionProps.tgs;

  // TODO super ugly

  let enabled_grid = 
  [
    [HaveCitizens(priv, tgs, 0, 0), HaveCitizens(priv, tgs, 0, 1), HaveCitizens(priv, tgs, 0, 2), HaveCitizens(priv, tgs, 0, 3)],
    [HaveCitizens(priv, tgs, 1, 0), HaveCitizens(priv, tgs, 1, 1), HaveCitizens(priv, tgs, 1, 2), HaveCitizens(priv, tgs, 1, 3)],
    [HaveCitizens(priv, tgs, 2, 0) && HasFoodAndLumber(tgs, 2, 0, priv.slot) && HasFoodAndLumber(tgs, 0, 1, props.target,), 
     HaveCitizens(priv, tgs, 2, 1) && HasFoodAndLumber(tgs, 0, 2, priv.slot) && HasFoodAndLumber(tgs, 1, 0, props.target,),
     HaveCitizens(priv, tgs, 2, 2) && HasFoodAndLumber(tgs, 0, 1, props.target), 
     HaveCitizens(priv, tgs, 2, 3) && HasFoodAndLumber(tgs, 1, 0, props.target)], 
     [HaveCitizens(priv, tgs, 3, 0) && HasFoodAndLumber(tgs, 3, 3, priv.slot) && WitchAlive(tgs, props.target, props.witchType), 
      HaveCitizens(priv, tgs, 3, 1) && HasFoodAndLumber(tgs, 2, 2, priv.slot) && WitchAlive(tgs, props.target, props.witchType),
      HaveCitizens(priv, tgs, 3, 2) && HasFoodAndLumber(tgs, 1, 1, priv.slot) && WitchAlive(tgs, props.target, props.witchType),
      HaveCitizens(priv, tgs, 3, 3) && WitchAlive(tgs, props.target, props.witchType)]
    ];

    let actionInfo : ActionInfo = { type : props.type, target : props.target, witchType : props.witchType };

    return (
        <ButtonGroup
        variant="contained"
        orientation="vertical"
        aria-label="outlined button group"          
        //color={colors[props.type]} TODO FIX
        >
          <Button
          onClick={() => props.actionProps.backend.DoAction(priv, actionInfo, 3)}
          disabled={!enabled_grid[props.type][3]}
          >
          {type_string[props.type]} 3 - {description_grid[props.type][3]}
          </Button>
          <Button
          onClick={() => props.actionProps.backend.DoAction(priv, actionInfo, 2)}
          disabled={!enabled_grid[props.type][2]}
          >
          {type_string[props.type]} 2 - {description_grid[props.type][2]}
          </Button>
          <Button
          onClick={() => props.actionProps.backend.DoAction(priv, actionInfo, 1)}
          disabled={!enabled_grid[props.type][1]}
          >
          {type_string[props.type]} 1 - {description_grid[props.type][1]}
          </Button>
          <Button
          onClick={() => props.actionProps.backend.DoAction(priv, actionInfo, 0)}
          disabled={!enabled_grid[props.type][0]}
          >
          {type_string[props.type]} 0 - {description_grid[props.type][0]}
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

// DebugMenu 

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


