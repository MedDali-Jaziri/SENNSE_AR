import { Sensor } from "./sensor.model";

export interface Board{
    id: number;
    boardName: string;
    boardDescription: string;
    boardUUId: string;
    qrCodePath: string;
    targetIndex?: number;
    sensorModelList: Sensor[];
    sensorHandled?: Array<Record<string, string>>;
}
