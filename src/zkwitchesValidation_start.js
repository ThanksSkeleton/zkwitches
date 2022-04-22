"use strict";
exports.__esModule = true;
var FOOD = 0;
var LUMBER = 1;
var BRIGAND = 2;
var INQUISITOR = 3;
var GameStateEnum;
(function (GameStateEnum) {
    GameStateEnum[GameStateEnum["GAME_STARTING"] = 0] = "GAME_STARTING";
    GameStateEnum[GameStateEnum["WAITING_FOR_PLAYER_TURN"] = 1] = "WAITING_FOR_PLAYER_TURN";
    GameStateEnum[GameStateEnum["WAITING_FOR_PLAYER_ACCUSATION_RESPONSE"] = 2] = "WAITING_FOR_PLAYER_ACCUSATION_RESPONSE";
    GameStateEnum[GameStateEnum["GAME_OVER"] = 3] = "GAME_OVER";
})(GameStateEnum || (GameStateEnum = {}));
var TotalGameState = /** @class */ (function () {
    function TotalGameState() {
    }
    return TotalGameState;
}());
var SharedGameState = /** @class */ (function () {
    function SharedGameState() {
    }
    return SharedGameState;
}());
var PlayerGameState = /** @class */ (function () {
    function PlayerGameState() {
    }
    return PlayerGameState;
}());
var PrivatePlayerInfo = /** @class */ (function () {
    function PrivatePlayerInfo() {
    }
    return PrivatePlayerInfo;
}());
// Need
// MyTurnValidator
// MyReponseValidator
// HaveCitizensValidator
// StealValidator
// InquisitionValidator
function MyTurnValidator(gamestate, private_player_info) {
    return gamestate.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_TURN &&
        gamestate.shared.player_waiting == private_player_info.address &&
        gamestate.shared.current_sequence_number == private_player_info.my_last_action;
}
function MyReponseValidator(gamestate, private_player_info) {
    return gamestate.shared.stateEnum == GameStateEnum.WAITING_FOR_PLAYER_ACCUSATION_RESPONSE &&
        gamestate.shared.player_waiting == private_player_info.address &&
        gamestate.shared.current_sequence_number == private_player_info.my_last_action;
}
function HaveCitizensValidator(private_player_info, dead_witches, citizen_type, count_required) {
    return (private_player_info.citizens[citizen_type] >= count_required || private_player_info.witches[citizen_type] == 1 && dead_witches[citizen_type] == 0);
}
var m = 'Hello World s';
console.log(m);
