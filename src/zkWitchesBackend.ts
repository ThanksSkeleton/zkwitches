import { ActionInfo, DefaultTGS, IZKBackend, PrivatePlayerInfo, TotalGameState } from "./zkWitchesTypes";

// TODO

export class MockZKBackend implements IZKBackend 
{
    private tgs: TotalGameState = DefaultTGS();

    GetTotalGameState(): TotalGameState 
    {
        return this.tgs;
    }

    RefreshStatus(): Promise<void> 
    {
        return new Promise(r => { setTimeout(r, 2000)});
    }

    JoinGame(priv: PrivatePlayerInfo): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DoAction(priv: PrivatePlayerInfo, action: ActionInfo): Promise<void> {
        return this.RefreshStatus();
    }

    RespondToAccusation(priv: PrivatePlayerInfo): Promise<void> {
        return this.RefreshStatus();
    }

    Surrender(): Promise<void> {
        return this.RefreshStatus();
    }

    KickActivePlayer(): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DebugSetTotalGameState(tgs: TotalGameState): Promise<void> {
        return this.RefreshStatus();
    }
}

// TODO

