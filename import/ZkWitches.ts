/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export declare namespace ZkWitches {
  export type SharedStateStruct = {
    stateEnum: BigNumberish;
    playerSlotWaiting: BigNumberish;
    currentNumberOfPlayers: BigNumberish;
    playerAccusing: BigNumberish;
    accusationWitchType: BigNumberish;
    previous_action_game_block: BigNumberish;
    current_block: BigNumberish;
    current_sequence_number: BigNumberish;
  };

  export type SharedStateStructOutput = [
    number,
    number,
    number,
    number,
    number,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    stateEnum: number;
    playerSlotWaiting: number;
    currentNumberOfPlayers: number;
    playerAccusing: number;
    accusationWitchType: number;
    previous_action_game_block: BigNumber;
    current_block: BigNumber;
    current_sequence_number: BigNumber;
  };

  export type PlayerStateStruct = {
    isAlive: boolean;
    handCommitment: BigNumberish;
    food: BigNumberish;
    lumber: BigNumberish;
    WitchAlive: [boolean, boolean, boolean, boolean];
  };

  export type PlayerStateStructOutput = [
    boolean,
    BigNumber,
    number,
    number,
    [boolean, boolean, boolean, boolean]
  ] & {
    isAlive: boolean;
    handCommitment: BigNumber;
    food: number;
    lumber: number;
    WitchAlive: [boolean, boolean, boolean, boolean];
  };

  export type TotalGameStateStruct = {
    shared: ZkWitches.SharedStateStruct;
    addresses: [string, string, string, string];
    players: [
      ZkWitches.PlayerStateStruct,
      ZkWitches.PlayerStateStruct,
      ZkWitches.PlayerStateStruct,
      ZkWitches.PlayerStateStruct
    ];
  };

  export type TotalGameStateStructOutput = [
    ZkWitches.SharedStateStructOutput,
    [string, string, string, string],
    [
      ZkWitches.PlayerStateStructOutput,
      ZkWitches.PlayerStateStructOutput,
      ZkWitches.PlayerStateStructOutput,
      ZkWitches.PlayerStateStructOutput
    ]
  ] & {
    shared: ZkWitches.SharedStateStructOutput;
    addresses: [string, string, string, string];
    players: [
      ZkWitches.PlayerStateStructOutput,
      ZkWitches.PlayerStateStructOutput,
      ZkWitches.PlayerStateStructOutput,
      ZkWitches.PlayerStateStructOutput
    ];
  };
}

export interface ZkWitchesInterface extends utils.Interface {
  functions: {
    "ActionNoProof(uint8,uint8,uint8)": FunctionFragment;
    "ActionWithProof(uint8,uint8,uint256[2],uint256[2][2],uint256[2],uint256[7])": FunctionFragment;
    "DEBUG_SetGameState(((uint8,uint8,uint8,uint8,uint8,uint256,uint256,uint256),address[4],tuple[4]))": FunctionFragment;
    "GetTGS()": FunctionFragment;
    "JoinGame(uint256[2],uint256[2][2],uint256[2],uint256[1])": FunctionFragment;
    "KickCurrentPlayer()": FunctionFragment;
    "RespondAccusation_NoWitch(uint256[2],uint256[2][2],uint256[2],uint256[2])": FunctionFragment;
    "RespondAccusation_YesWitch()": FunctionFragment;
    "Surrender()": FunctionFragment;
    "hc_verifierAddr()": FunctionFragment;
    "nw_verifierAddr()": FunctionFragment;
    "tgs()": FunctionFragment;
    "vm_verifierAddr()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "ActionNoProof"
      | "ActionWithProof"
      | "DEBUG_SetGameState"
      | "GetTGS"
      | "JoinGame"
      | "KickCurrentPlayer"
      | "RespondAccusation_NoWitch"
      | "RespondAccusation_YesWitch"
      | "Surrender"
      | "hc_verifierAddr"
      | "nw_verifierAddr"
      | "tgs"
      | "vm_verifierAddr"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "ActionNoProof",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ActionWithProof",
    values: [
      BigNumberish,
      BigNumberish,
      [BigNumberish, BigNumberish],
      [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      [BigNumberish, BigNumberish],
      BigNumberish[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "DEBUG_SetGameState",
    values: [ZkWitches.TotalGameStateStruct]
  ): string;
  encodeFunctionData(functionFragment: "GetTGS", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "JoinGame",
    values: [
      [BigNumberish, BigNumberish],
      [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      [BigNumberish, BigNumberish],
      [BigNumberish]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "KickCurrentPlayer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "RespondAccusation_NoWitch",
    values: [
      [BigNumberish, BigNumberish],
      [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "RespondAccusation_YesWitch",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "Surrender", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hc_verifierAddr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nw_verifierAddr",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "tgs", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "vm_verifierAddr",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "ActionNoProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ActionWithProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "DEBUG_SetGameState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "GetTGS", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "JoinGame", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "KickCurrentPlayer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "RespondAccusation_NoWitch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "RespondAccusation_YesWitch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "Surrender", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hc_verifierAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nw_verifierAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tgs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "vm_verifierAddr",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ZkWitches extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ZkWitchesInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    ActionNoProof(
      actionType: BigNumberish,
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    ActionWithProof(
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    DEBUG_SetGameState(
      inputTgs: ZkWitches.TotalGameStateStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    GetTGS(
      overrides?: CallOverrides
    ): Promise<[ZkWitches.TotalGameStateStructOutput]>;

    JoinGame(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    KickCurrentPlayer(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    RespondAccusation_NoWitch(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    RespondAccusation_YesWitch(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    Surrender(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hc_verifierAddr(overrides?: CallOverrides): Promise<[string]>;

    nw_verifierAddr(overrides?: CallOverrides): Promise<[string]>;

    tgs(
      overrides?: CallOverrides
    ): Promise<
      [ZkWitches.SharedStateStructOutput] & {
        shared: ZkWitches.SharedStateStructOutput;
      }
    >;

    vm_verifierAddr(overrides?: CallOverrides): Promise<[string]>;
  };

  ActionNoProof(
    actionType: BigNumberish,
    actionTarget: BigNumberish,
    witchType: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  ActionWithProof(
    actionTarget: BigNumberish,
    witchType: BigNumberish,
    a: [BigNumberish, BigNumberish],
    b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
    c: [BigNumberish, BigNumberish],
    input: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  DEBUG_SetGameState(
    inputTgs: ZkWitches.TotalGameStateStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  GetTGS(
    overrides?: CallOverrides
  ): Promise<ZkWitches.TotalGameStateStructOutput>;

  JoinGame(
    a: [BigNumberish, BigNumberish],
    b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
    c: [BigNumberish, BigNumberish],
    input: [BigNumberish],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  KickCurrentPlayer(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  RespondAccusation_NoWitch(
    a: [BigNumberish, BigNumberish],
    b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
    c: [BigNumberish, BigNumberish],
    input: [BigNumberish, BigNumberish],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  RespondAccusation_YesWitch(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  Surrender(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hc_verifierAddr(overrides?: CallOverrides): Promise<string>;

  nw_verifierAddr(overrides?: CallOverrides): Promise<string>;

  tgs(overrides?: CallOverrides): Promise<ZkWitches.SharedStateStructOutput>;

  vm_verifierAddr(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    ActionNoProof(
      actionType: BigNumberish,
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    ActionWithProof(
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    DEBUG_SetGameState(
      inputTgs: ZkWitches.TotalGameStateStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    GetTGS(
      overrides?: CallOverrides
    ): Promise<ZkWitches.TotalGameStateStructOutput>;

    JoinGame(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish],
      overrides?: CallOverrides
    ): Promise<void>;

    KickCurrentPlayer(overrides?: CallOverrides): Promise<void>;

    RespondAccusation_NoWitch(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish, BigNumberish],
      overrides?: CallOverrides
    ): Promise<void>;

    RespondAccusation_YesWitch(overrides?: CallOverrides): Promise<void>;

    Surrender(overrides?: CallOverrides): Promise<void>;

    hc_verifierAddr(overrides?: CallOverrides): Promise<string>;

    nw_verifierAddr(overrides?: CallOverrides): Promise<string>;

    tgs(overrides?: CallOverrides): Promise<ZkWitches.SharedStateStructOutput>;

    vm_verifierAddr(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    ActionNoProof(
      actionType: BigNumberish,
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    ActionWithProof(
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    DEBUG_SetGameState(
      inputTgs: ZkWitches.TotalGameStateStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    GetTGS(overrides?: CallOverrides): Promise<BigNumber>;

    JoinGame(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    KickCurrentPlayer(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    RespondAccusation_NoWitch(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    RespondAccusation_YesWitch(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    Surrender(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hc_verifierAddr(overrides?: CallOverrides): Promise<BigNumber>;

    nw_verifierAddr(overrides?: CallOverrides): Promise<BigNumber>;

    tgs(overrides?: CallOverrides): Promise<BigNumber>;

    vm_verifierAddr(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ActionNoProof(
      actionType: BigNumberish,
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    ActionWithProof(
      actionTarget: BigNumberish,
      witchType: BigNumberish,
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    DEBUG_SetGameState(
      inputTgs: ZkWitches.TotalGameStateStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    GetTGS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    JoinGame(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    KickCurrentPlayer(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    RespondAccusation_NoWitch(
      a: [BigNumberish, BigNumberish],
      b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]],
      c: [BigNumberish, BigNumberish],
      input: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    RespondAccusation_YesWitch(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    Surrender(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hc_verifierAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nw_verifierAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tgs(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vm_verifierAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
