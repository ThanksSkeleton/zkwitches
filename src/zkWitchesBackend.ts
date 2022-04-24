export {}

class PrivateUserData {}
class TotalGameState {}
class ActionInfo {}

interface IZKBackend 
{
    GetTotalGameState() : TotalGameState;
    RefreshStatus(): Promise<void>;
    JoinGame(priv: PrivateUserData) : Promise<void>;
    DoAction(priv: PrivateUserData, action:ActionInfo): Promise<void>;
    RespondToAccusation(priv: PrivateUserData): Promise<void>;
    Surrender(): Promise<void>
    KickActivePlayer(): Promise<void>
}

class EmptyZKBackend implements IZKBackend 
{
    private tgs: TotalGameState = new TotalGameState();

    GetTotalGameState(): TotalGameState 
    {
        return this.tgs;
    }

    RefreshStatus(): Promise<void> 
    {
        return new Promise(r => { setTimeout(r, 2000)});
    }

    JoinGame(priv: PrivateUserData): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DoAction(priv: PrivateUserData, action: ActionInfo): Promise<void> {
        return this.RefreshStatus();
    }

    RespondToAccusation(priv: PrivateUserData): Promise<void> {
        return this.RefreshStatus();
    }

    Surrender(): Promise<void> {
        return this.RefreshStatus();
    }

    KickActivePlayer(): Promise<void> 
    {
        return this.RefreshStatus();
    }
}

// TODO

class MockZKBackend implements IZKBackend 
{
    private tgs: TotalGameState = new TotalGameState();

    GetTotalGameState(): TotalGameState 
    {
        return this.tgs;
    }

    RefreshStatus(): Promise<void> 
    {
        return new Promise(r => { setTimeout(r, 2000)});
    }

    JoinGame(priv: PrivateUserData): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DoAction(priv: PrivateUserData, action: ActionInfo): Promise<void> {
        return this.RefreshStatus();
    }

    RespondToAccusation(priv: PrivateUserData): Promise<void> {
        return this.RefreshStatus();
    }

    Surrender(): Promise<void> {
        return this.RefreshStatus();
    }

    KickActivePlayer(): Promise<void> 
    {
        return this.RefreshStatus();
    }
}

// TODO

class ZKBackend implements IZKBackend 
{
    private tgs: TotalGameState = new TotalGameState();

    GetTotalGameState(): TotalGameState 
    {
        return this.tgs;
    }

    RefreshStatus(): Promise<void> 
    {
        return new Promise(r => { setTimeout(r, 2000)});
    }

    JoinGame(priv: PrivateUserData): Promise<void> 
    {
        return this.RefreshStatus();
    }

    DoAction(priv: PrivateUserData, action: ActionInfo): Promise<void> {
        return this.RefreshStatus();
    }

    RespondToAccusation(priv: PrivateUserData): Promise<void> {
        return this.RefreshStatus();
    }

    Surrender(): Promise<void> {
        return this.RefreshStatus();
    }

    KickActivePlayer(): Promise<void> 
    {
        return this.RefreshStatus();
    }
}