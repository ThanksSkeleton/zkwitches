export type ValidMoveInput =
{
	CitizenCount : number[]
	WitchPresent : number[]
	HandSalt : string,
	ExpectedHash : string,
	WitchAlive: number[],
	citizenType: number,
	requiredCitizenCount : number
}