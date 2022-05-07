import { PrivatePlayerInfo, TotalGameState } from "./zkWitchesTypes";

export {}

const FOOD = 0;
const LUMBER = 1;
const BRIGAND = 2;
const INQUISITION = 3;


const GAMESTART_COLOR_WHITE : string = "white";
const JOIN_COLOR_WHITE : string = "white";
const ACTION_COLORS : string[] = ["white", "white", "white", "white"];
const VICTORY_COLOR : string = "white";
const LOSS_COLOR : string = "white";

let colors = ["food", "lumber", "brigand", "inquisitor"];
let type_string = ["Farmer", "LumberJack", "Brigand", "Inquisitor"];

export type FoodAndLumber = [number, number];

let food_amounts = [1,2,3,4];
let lumber_amounts = [1,2,3,4];

let brigandTrades : FoodAndLumber[] = [[2,0], [0,2], [0,0], [0,0]];
let stealAmounts : FoodAndLumber[]  = [[0,1], [1,0], [0,1], [1,0]];
let inquisitionCosts : FoodAndLumber[] = [[3,3], [2,2], [1,1], [0,0]];

function ShortDescription(actionType :number, actionTarget: number, witchType: number, actionLevel: number) : string
{
    if (actionType == FOOD) 
    {
        return `gather ${food_amounts[actionLevel]} food`
    } 
    else if (actionType == LUMBER) 
    {
        return `gather ${lumber_amounts[actionLevel]} lumber`
    } 
    else if (actionType == BRIGAND) 
    {
        if (actionLevel == 0) 
        {
            return `forced trade with Player ${actionTarget}, ${brigandTrades[0][0]} food for ${stealAmounts[0][1]} lumber`
        } else if (actionLevel == 1)
        {
            return `forced trade with Player ${actionTarget}, ${brigandTrades[1][1]} lumber for ${stealAmounts[1][0]} food`
        } else if (actionLevel == 2){
            return `steal ${stealAmounts[2][1]} lumber from Player ${actionTarget}`
        } else {
            return `steal ${stealAmounts[3][0]} food from Player ${actionTarget}`
        }
    } else {
        if (actionLevel < 3)
        {
            return `accuse Player ${actionTarget} of having a ${type_string[witchType]} witch. ${inquisitionCosts[actionLevel][0]} food ${inquisitionCosts[actionLevel][0]} lumber`
        } else {
            return `accuse Player ${actionTarget} of having a ${type_string[witchType]} witch.`
        }
    }
}

function LongPastTenseDescription(actionType :number, actionTarget: number, witchType: number, actionLevel: number) : string 
{
    if (actionType == FOOD) 
    {
        return `Gathered ${food_amounts[actionLevel]} food using ${actionLevel} Farmers.`
    } 
    else if (actionType == LUMBER) 
    {
        return `Gathered ${lumber_amounts[actionLevel]} lumber using ${actionLevel} LumberJacks.`
    } 
    else if (actionType == BRIGAND) 
    {
        if (actionLevel == 0) 
        {
            return `Forced a trade with Player ${actionTarget}. Traded ${brigandTrades[0][0]} food for ${stealAmounts[0][1]} lumber, using ${actionLevel} Brigands.`
        } else if (actionLevel == 1)
        {
            return `Forced a trade with Player ${actionTarget}. Traded ${brigandTrades[1][1]} lumber for ${stealAmounts[1][0]} food, using ${actionLevel} Brigands.`
        } else if (actionLevel == 2){
            return `Stole ${stealAmounts[2][1]} lumber from Player ${actionTarget}, using ${actionLevel} Brigands.`
        } else {
            return `Stole ${stealAmounts[3][0]} food from Player ${actionTarget}, using ${actionLevel} Brigands.`
        }
    } else {
        if (actionLevel < 3)
        {
            return `Accused Player ${actionTarget} of having a ${type_string[witchType]} witch. Spent ${inquisitionCosts[actionLevel][0]} food ${inquisitionCosts[actionLevel][0]} lumber, using ${actionLevel} Inquisitors.`
        } else {
            return `Accused Player ${actionTarget} of having a ${type_string[witchType]} witch, using ${actionLevel} Inquisitors.`
        }
    }
}

function HaveCitizens(priv: PrivatePlayerInfo, tgs: TotalGameState, citizen_type: number, count_required: number ) : boolean 
{
  return (priv.citizens[citizen_type] >= count_required || (priv.witches[citizen_type] == 1 && tgs.players[priv.slot].WitchAlive[citizen_type]))
} 

function HasFoodAndLumber(tgs: TotalGameState, fl: FoodAndLumber, playerId?: number) : boolean 
{
  if ( playerId == undefined ) return false;  
  return (tgs.players[playerId].food >= fl[0] && tgs.players[playerId].lumber >= fl[1]);
}

function WitchAlive(tgs: TotalGameState, playerId?: number, witch_type?: number) : boolean 
{
  if ( playerId == undefined ) return false;  
  if ( witch_type == undefined ) return false;  
  return (tgs.players[playerId].WitchAlive[witch_type]); 
}

function IsEnabled(tgs: TotalGameState, priv: PrivatePlayerInfo, actionType :number, actionTarget: number, witchType: number, actionLevel: number) : boolean 
{   
    if (actionType == FOOD)
    {
        return HaveCitizens(priv, tgs, FOOD, actionLevel);
    } 
    else if (actionType == LUMBER)
    {
        return HaveCitizens(priv, tgs, LUMBER, actionLevel);
    } 
    else if (actionType == BRIGAND)
    {
        return HaveCitizens(priv, tgs, BRIGAND, actionLevel) && HasFoodAndLumber(tgs, brigandTrades[actionLevel], priv.slot) && HasFoodAndLumber(tgs, stealAmounts[actionLevel], actionTarget);
    } 
    else 
    {
        return HaveCitizens(priv, tgs, INQUISITION, 0) && HasFoodAndLumber(tgs, inquisitionCosts[actionLevel], priv.slot) && WitchAlive(tgs, actionTarget, witchType);
    }
}