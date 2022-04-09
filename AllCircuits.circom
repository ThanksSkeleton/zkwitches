pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
// TODO Include the other logic stuff

template HandHash() 
{    
    signal input[4] CitizenCount;
    signal input[4] WitchPresent;

    signal input HandSalt;

    signal output Hash;

    component poseidon = Poseidon(9);

    for (var i = 0; i < 4; i++) 
    {         
        poseidon.in[i*2] <== CitizenCount[i];
        poseidon.in[i*2+1] <== WitchPresent[i];
    }

    poseidon.in[8] <== HandSalt;

    Hash <== poseidon.out;
}

template HandValid() {

    signal input[4] CitizenCount;
    signal input[4] WitchPresent;

    // Citizen Counts + Witch Counts == 8 inputs
    component AllValid = MultiAND(8);

    for (var i = 0; i < 4; i++) 
    {         
        component citizen_gate = LessThan(3);
        citizen_gate.in[0] <== CitizenCount[i];
        citizen_gate.in[1] <== 4;
        AllValid.in[i*2] <== citizen_gate.out;
        component witch_gate = LessThan(1);
        witch_gate.in[0] <== WitchPresent[i];
        witch_gate.in[1] <== 2;
        AllValid.in[i*2+1] <== witch_gate.out;
    }

    // TODO Assert?
    CitizenCount[0] + WitchPresent[0] + CitizenCount[1] + WitchPresent[1] + CitizenCount[2] + WitchPresent[2] + CitizenCount[3] + WitchPresent[3] === 9
    AllValid.out === 1;
}

template HandCommitment() 
{
    signal input[4] CitizenCount;
    signal input[4] WitchPresent;

    signal input HandSalt;

    signal output Hash;

    component hh = HandHash();
    // TODO Wire up
    component hv = HandValid();
    // TODO Wire up

    Hash <== hh.Hash;
}

template HandSwap()
{
    signal input[4] OldCitizenCount;
    signal input[4] NewCitizenCount;

    signal input[4] WitchPresent;

    signal input HandSalt;

    public signal input OldHash;

    signal output NewHash;

    component oldhash = HandHash();
    // TODO Wire up

    oldhash.Hash === OldHash;

    component newCommitment = HandCommitment();
    // TODO Wire up

    NewHash <== newCommitment.Hash;
}

template MoveValid() 
{
    signal input[4] CitizenCount;
    signal input[4] WitchPresent;

    signal input HandSalt;

    public signal input ExpectedHash;

    public signal input[4] WitchAlive; 

    public signal input citizenType;
    public signal input citizenCount;

    component hh = HandHash();
    // Todo Wire Up;

    component citizenCountCheck = GreaterThan(3);
    citizenCountCheck.in[0] <== CitizenCount[citizenType];
    citizenCountCheck.in[1] <== citizenCount;

    component witchPresentAndAlive = AND();
    witchPresentAndAlive.in[0] <== WitchPresent[citizenType];
    witchPresentAndAlive.in[1] <== WitchAlive[citizenType];

    component citizenOrWitch = OR();
    citizenOrWitch.in[0] <== citizenCountCheck.out;
    citizenOrWitch.in[1] <== witchPresentAndAlive.out;

    // TODO Assert?
    hh.out === ExpectedHash;
    citizenOrWitch.out === 1;
}

template NoWitch() 
{
    signal input[4] CitizenCount;
    signal input[4] WitchPresent;

    signal input HandSalt;

    public signal input ExpectedHash;

    public signal input[4] WitchDead; 

    public signal input citizenType;

    component witchPresentAndAlive = AND();
    witchPresentAndAlive.in[0] <== WitchPresent[citizenType];
    witchPresentAndAlive.in[1] <== WitchAlive[citizenType];

    component hh = HandHash();

    // TODO Assert?
    hh.out === ExpectedHash;
    witchPresentAndAlive.out === 0;
}

component main {public [signalHash, externalNullifier]} = MoveValid(20);