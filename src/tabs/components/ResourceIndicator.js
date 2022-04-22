import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';


export default function ResourceIndicator(props) {
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

