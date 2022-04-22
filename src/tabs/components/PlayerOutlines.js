import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';

import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";

import { BrigandTableau, FoodTableau, InquisitorTableau, LumberTableau } from "./ActionTableau";
import ResourceIndicator from "./ResourceIndicator";

export function ActivePlayer(props)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.playerId + " (You)"} variant="outlined" />
      <ResourceIndicator food={1} lumber={2} />
      <FoodTableau />
      <LumberTableau />
    </Stack>
  )
}

export function EnemyPlayer(props)
{
  return (
    <Stack direction="row"
    spacing = {1}>
      <TextField label={"Player " + props.playerId} variant="outlined" />
      <ResourceIndicator food={1} lumber={2} />
      <BrigandTableau />
      <InquisitorTableau />
    </Stack>
  )
}