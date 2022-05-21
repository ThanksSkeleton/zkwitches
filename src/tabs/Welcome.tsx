import ReactMarkdown from 'react-markdown';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { TotalGameState, IZKBackend, GetSlot } from "../zkWitchesTypes";
import { targetChain } from '../chainInfo';
import banner from '../images/zkWitches.png';
import { useState } from 'react';

type WelcomeProps = 
{
  backend: IZKBackend

  isLoading : boolean
  loadingString: string,
}
// {
//   isLoading : boolean
//   loadingString: string,

//   privMapper : PrivMapper, 

//   backend: IZKBackend

//   widget: LoadingWidgetOutput
// }

export default function Welcome(props: WelcomeProps) 
{
  let tgs = props.backend.GetTotalGameState();
  let priv = undefined;
  let noDataPresent = tgs == undefined;

  let slot = GetSlot(tgs, props.backend.GetAddress());

  let targetChainObject = targetChain();

  let targetString = "ZKWitches is played on the " + targetChainObject.longName + " blockchain.";

  let howToAdd = "For instructions on adding this chain to your wallet, check here: ";
  let howToGetCoints = "You need currency to pay gas fees - for instructions on getting currency - check here: ";

  let connectToContinue = "Connect with a wallet to continue.";

  let joinGameMessage = "zkWitches Lobbies: 0/1 full. A game is currently starting! Click on the 'Play' tab."
  let gameFullMessage = "zkWitches Lobbies: 1/1 active. All lobbies are currently full. You can spectate using the 'Play' tab."

  return (
    <Stack direction="column" spacing={4}>
      <img src={banner} width={723} height={288} alt='banner' />
      <Typography>Welcome to zkWitches!</Typography>
      <Typography>{targetString}</Typography>
      <Stack direction="row"><Typography>{howToAdd}</Typography><Link href={targetChainObject.addHyperlink}>Link</Link></Stack>
      <Stack direction="row"><Typography>{howToGetCoints}</Typography><Link href={targetChainObject.getCoinsHyperlink}>Link</Link></Stack>
      { noDataPresent && <Typography>{connectToContinue}</Typography>}
      { noDataPresent && <NoData action={() => { props.backend.RefreshStatus();}} /> }
      { (!noDataPresent && (tgs as TotalGameState).shared.stateEnum == 0) && <Typography>{joinGameMessage}</Typography> }
      { (!noDataPresent && (tgs as TotalGameState).shared.stateEnum != 0) && <Typography>{gameFullMessage}</Typography> }
      <Documentation />
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

function Documentation() 
{
  const md = `
  ## Player's Summary of the Game
  This is a 4 player, turn based, secret information dapp card game with resource management and social deduction. The game is played on chain, and uses zk (zero knowledge) proofs to allow players to make validated moves without revealing their secrets.
  
  The objective of the game is to become the most prosperous village by accumulating 10 food and 10 lumber. 
  
  At the start of the game, each player makes a secret selection of their village's citizens: a total of 7 citizens. 
  
  ## The Citizens
  
  Farmers:
  
  Gather Food. 0/1/2/3 farmers can gather 1/2/3/4 food 
  
  Lumberjacks:
  
  Gather Lumber. 0/1/2/3 lumberjacks can gather 1/2/3/4 lumber
  
  Brigands:
  
  Can force trades and steal Food or Lumber.
  
  0 : Trade 2 food for 1 lumber with another player.
  
  1 : Trade 2 lumber for 1 food with another player.
  
  2 : Steal 1 food
  
  3 : Steal 1 lumber 
  
  Inquisitors:
  
  Can eliminate the witches of other players.
  
  In an inquisition, the targeted village proves they do not have a specific witch. If they cannot, they pay 2 food, and 2 lumber to the inquisitor, and their witch flees forever. If they cannot pay the inquisitor's fee, the village is eliminated.
  
  0/1/2/3 inquisitors can launch a inquisition by spending 3/2/1/0 food and lumber.
  
  ## The Witches
  
  Witches perform actions like normal citizens, but they are 3 times as strong, so a witch can perform the action of 3 normal citizens.! But, they can be eliminated if you are targeted by Inquisitors, at a hefty cost.
  
  ## Game Over
  
  The game ends when 3 players have surrendered or have been eliminated, or a player accumulates 10 food and 10 lumber.
  `;

  return (
    <ReactMarkdown children={md} />
  );
}

