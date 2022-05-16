import { ethers } from "ethers";
import { Empty, PrivatePlayerInfo } from "./zkWitchesTypes";

export class PrivMapper 
{

  private key?: string;
  private priv?: PrivatePlayerInfo;

  constructor() {}

  public Get(gameId : number, address: string): PrivatePlayerInfo
  {
    this.key = "GameId"+gameId+"Address"+address;

    if (localStorage.getItem(this.key))
    {
      console.log("Loading stored priv");
      this.priv = JSON.parse(localStorage.getItem(this.key) as string) as PrivatePlayerInfo;
      console.log("stored priv:", this.priv);
      return this.priv;
    } 
    else 
    {
      let random_salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
      this.priv = Empty(random_salt.toString());
      console.log("Creating new Priv");
      localStorage.setItem(this.key as string, JSON.stringify(this.priv));
      console.log("new priv:", this.priv);
      return this.priv;
    }
  }

  public SaveActive()
  {
    console.log("Persisting existing priv:", this.priv);
    localStorage.setItem(this.key as string, JSON.stringify(this.priv));
  }

  public ForceOverride(gameId : number, address: string, privInput : PrivatePlayerInfo)
  {
    this.key = "GameId"+gameId+"Address"+address;

    this.priv = privInput
    console.log("Overriding priv");
    localStorage.setItem(this.key as string, JSON.stringify(this.priv));
    console.log("new priv:", this.priv);
    return this.priv;
  }
}
