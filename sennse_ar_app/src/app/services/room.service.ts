import { Injectable } from '@angular/core';
import { Room } from '../model/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private selectedRoom: Room | null = null;

  constructor() { }

  setRoom(room: Room) {
    this.selectedRoom = room;
  }

  getRoom(): Room | null {
    return this.selectedRoom;
  }

  clearRoom() {
    this.selectedRoom = null;
  }

}
