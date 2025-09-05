import { Board } from "./board.model";

export interface Project{
    projectName: string;
    projectDescription: string;
    boardModelList: Board[];
}