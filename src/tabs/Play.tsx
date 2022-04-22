import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BrigandTableau, FoodTableau, InquisitorTableau, LumberTableau } from "./components/ActionTableau";
import Stack from '@mui/material/Stack';
import ResourceIndicator from "./components/ResourceIndicator";
import TextField from "@mui/material/TextField";
import { ActivePlayer, EnemyPlayer } from "./components/PlayerOutlines";


export default function Play() {

  const [nameDisable, setNameDisable] = useState(true);
  const [descDisable, setDescDisable] = useState(true);
  const [imageDisable, setImageDisable] = useState(true);

  const mintToken = async (event: any) => {}

  const mintToken2 = async (event: any, foo: number) => {}

  return (
    <Stack direction="column" spacing={1}>
      <ActivePlayer playerId={1} />
      <EnemyPlayer playerId={2} />
      <EnemyPlayer playerId={3} />
      <EnemyPlayer playerId={4} />
    </Stack>
  );
}