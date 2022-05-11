import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { ZKBackend, LoadingWidgetOutput, EventRepresentation } from "../zkWitchesEthers";


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