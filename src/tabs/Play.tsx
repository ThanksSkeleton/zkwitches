import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BrigandTableau, FoodTableau, InquisitorTableau, LumberTableau } from "./components/ActionTableau";
import Stack from '@mui/material/Stack';
import ResourceIndicator from "./components/ResourceIndicator";
import TextField from "@mui/material/TextField";
import Loading  from "./components/Loading";
import { ActivePlayer, EnemyPlayer } from "./components/PlayerOutlines";
import CitizenSelector from "./components/CitizenSelector";
import { Divider } from "@mui/material";


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