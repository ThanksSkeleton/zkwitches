import ReactMarkdown from 'react-markdown';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { TotalGameState, IZKBackend, GetSlot } from "../zkWitchesTypes";
import banner from '../images/zkWitches.png';
import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";


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

  let welcomeDescription = "Welcome to ZKWitches! This is a ZK Game prototype that uses ZK Proofs to play a social deduction game on-chain. For detailed documentation, including how to play, check out " ;
  let linkText = "https://github.com/ThanksSkeleton/zkwitches"
  let connectToContinue = "Connect with a wallet to continue.";

  let joinGameMessage = "zkWitches Lobbies: 0/1 full. A game is currently starting! Click on the 'Play' tab."
  let gameFullMessage = "zkWitches Lobbies: 1/1 active. All lobbies are currently full. You can spectate using the 'Play' tab."

  return (
    <Stack direction="column" spacing={4}>
      <img src={banner} width={723} height={288} alt='banner' />
      <Typography>
        {welcomeDescription} 
        <Link href={linkText}>
          the Github.
        </Link>
      </Typography>
      { noDataPresent && <Typography>{connectToContinue}</Typography>}
      { noDataPresent && <NoData action={() => { props.backend.RefreshStatus();}} /> }
      { (!noDataPresent && (tgs as TotalGameState).shared.stateEnum == 0) && <Typography>{joinGameMessage}</Typography> }
      { (!noDataPresent && (tgs as TotalGameState).shared.stateEnum != 0) && <Typography>{gameFullMessage}</Typography> }
    </Stack>
  );
}

// function ChainHelp() 
// {
//   //const chainName = useNetwork().chains[0].name;

//   let targetString = "This instance of ZKWitches is targeted to the " + "Z" + " blockchain.";

//   let howToAdd = "For instructions on adding this chain to your wallet, check here: ";
//   let howToGetCoins = "You need currency to pay gas fees - for instructions on getting currency - check here: ";

//   return(
//     <Stack>      
//       <Typography>{targetString}</Typography>
//       <Stack direction="row">
//         <Typography>{howToAdd}</Typography>
//         <Link href={"https://google.com/"}>Link</Link>
//       </Stack>
//       <Stack direction="row">
//         <Typography>{howToGetCoins}</Typography>
//         <Link href={"https://google.com/"}>Link</Link>
//       </Stack>
//     </Stack>
//   )
// }

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

