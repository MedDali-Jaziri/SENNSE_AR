import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../model/room.model';
import { Board } from '../../model/board.model';
import { CommonModule } from '@angular/common';
import { SennseDataRequestService } from '../../services/sennse-data-request.service';
import { Sensor } from '../../model/sensor.model';
import { WidgetGernatorService } from '../../services/widget-gernator.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-room-detail',
  imports: [CommonModule],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class RoomDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  room: Room | null = null;
  boards: Board[] = [];
  token: string | null = null;

  constructor(private roomService: RoomService, private seDaReSe: SennseDataRequestService, private wiGeSe: WidgetGernatorService) {

  }

  async ngOnInit(): Promise<void> {
    console.log("Get Room", this.roomService.getRoom());

    this.room = this.roomService.getRoom();
    this.boards = this.room?.sensorModelResponseList || [];

    console.log("Get Room Name:", this.room?.projectName);
    console.log("Get Room Description:", this.room?.projectDescription);
    console.log("Get Boards:", this.boards);

    for (let board of this.boards) {
      console.log("Board Name:", board.boardName);
      console.log("UUID:", board.boardUUId);
      console.log("QR Code Path:", board.qrCodePath);
      console.log("Target Index:", board.targetIndex);
    }

    this.token = await this.seDaReSe.login();
    console.log('Token Authentication is: ', this.token);
  }

  ngAfterViewInit(): void {
    const sceneEl = document.querySelector('a-scene') as any;

    if (sceneEl?.hasLoaded) {
      this.setupMarkerEvents();
    } else {
      sceneEl?.addEventListener('loaded', () => {
        this.setupMarkerEvents();
      });
    }

  }

  setupMarkerEvents(): void {
    if (!this.boards || this.boards.length === 0) return;

    for (const board of this.boards) {
      if (!board.qrCodePath) continue;

      const markerEl = document.querySelector(`#${board.qrCodePath}`) as HTMLElement;

      if (!markerEl) {
        console.warn(`⚠️ Could not find marker element with id: ${board.qrCodePath}`);
        continue;
      }

      var sensorValue = "";
      var sensorKey = "";
      markerEl.addEventListener('targetFound', () => {
        console.log(`🔵 Marker Found: ${board.sensorHandled}`);
        if (board?.sensorHandled?.length) {
          for (const handled of board.sensorHandled) {
            for (const sensorLabel in handled) {
              sensorValue = handled[sensorLabel];
              sensorKey = sensorLabel;
            }
          }
        }


        this.onMarkerDetected(board, board.boardName, board.boardUUId, sensorKey, sensorValue);
      });

      markerEl.addEventListener('targetLost', () => {
        console.log(`🔴 Marker Lost: ${board.qrCodePath}`);
      });
    }
  }

  async onMarkerDetected(board: Board, boardName: string, boardUUId: string, sensorKey: string, sensorValue: string): Promise<void> {
    console.log(`🟡 onMarkerDetected: ${boardName}`);
    console.log(boardUUId);
    console.log(sensorKey);
    console.log(sensorValue);


    var telemetryMap = await this.seDaReSe.buildTelemetryBetaVersion(this.token!, boardName, boardUUId, sensorKey, sensorValue);

    console.log("Telemetry Map result: ", telemetryMap);

    const widgetElement = this.wiGeSe.createDynamicWidget(boardName, telemetryMap);
    document.body.appendChild(widgetElement);

    const firstSensorKey = Object.keys(telemetryMap)[0];
    const firstDataPoint = telemetryMap[firstSensorKey][0];

    console.log("First Sensor Key: ",firstSensorKey);
    console.log("First Data Point: ",firstDataPoint);
    
    const canvas = widgetElement.querySelector("#chart") as HTMLCanvasElement;

    if (firstDataPoint.unit.includes("lx")) {
      await this.wiGeSe.drawLumxSensorChart(telemetryMap, widgetElement);
    } else {
      await this.wiGeSe.drawTemp_HumSensorChart(telemetryMap, canvas, widgetElement);
    }

    await this.captureAndSaveWidgetImage(widgetElement, board);

    // const filteredESP32Result: any = {};
    // for (const key in telemetryMap) {
    //   console.log(key);

    //   if (key.includes(nodesType)) {
    //     filteredESP32Result[key] = telemetryMap[key];
    //   }
    // }
    // console.log(filteredESP32Result);
  }



  ngOnDestroy(): void {
    const scene = document.querySelector('a-scene');
    if (scene && scene.parentNode) {
      scene.parentNode.removeChild(scene);
    }

    // Also remove leftover MindAR canvases or overlays
    const mindarCanvas = document.querySelector('canvas');
    if (mindarCanvas && mindarCanvas.parentNode) {
      mindarCanvas.parentNode.removeChild(mindarCanvas);
    }

    // Remove all overlays or scanning UIs
    const overlays = document.querySelectorAll('[class*=mindar], .ar-container');
    overlays.forEach(el => el.remove());
  }

  async captureAndSaveWidgetImage(widgetElement: HTMLElement, board: Board): Promise<void> {
  try {
    const canvasImage = await html2canvas(widgetElement);
    const dataUrl = canvasImage.toDataURL("image/png");

    const entityId = board.qrCodePath;
    const imageId = board.qrCodePath.toLowerCase().replace(/[^a-z0-9]/gi, '');

    // Save to variable if needed
    (this as any)[`imageDataUrl_${imageId}`] = dataUrl;

    // 1. Create <img> in <a-assets>
    const assets = document.querySelector('a-assets');
    const imgElement = document.createElement('img');
    imgElement.setAttribute('id', imageId);
    imgElement.setAttribute('crossorigin', 'anonymous');
    imgElement.setAttribute('src', dataUrl);
    assets?.appendChild(imgElement);

    // 2. Create <a-image> inside the correct <a-entity>
    const entity = document.getElementById(entityId);
    const aImage = document.createElement('a-image');
    aImage.setAttribute('src', `#${imageId}`);
    aImage.setAttribute('position', '0 0 0');
    aImage.setAttribute('width', '1');
    aImage.setAttribute('height', '1');
    entity?.appendChild(aImage);

    console.log(`✅ Image saved and added to entity ${entityId}`);
  } catch (error) {
    console.error("❌ Error capturing/saving widget image:", error);
  }
}

}
