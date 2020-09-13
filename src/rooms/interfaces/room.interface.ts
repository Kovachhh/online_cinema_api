import { RoomModel } from "../models/room.model";

export interface ICreateRoom {
    readonly name: RoomModel['name'];
    readonly membersId: RoomModel['membersId'];
    readonly owner: RoomModel['owner'];
}