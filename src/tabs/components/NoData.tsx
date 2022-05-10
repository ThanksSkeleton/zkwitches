import { Button } from "@mui/material";

export type NoDataProps = 
{
  action: React.MouseEventHandler<HTMLButtonElement>;
}

export default function NoData(props: NoDataProps) 
{
  return (
    <Button
    onClick={props.action} >
    Fetch Data
    </Button>
  );
}