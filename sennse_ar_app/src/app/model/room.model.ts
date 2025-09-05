import { Board } from "./board.model";

export interface Room {
  projectName: string;
  projectDescription: string;
  sensorModelResponseList: Board[];
}