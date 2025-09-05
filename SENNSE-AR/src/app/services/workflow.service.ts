import { Injectable } from '@angular/core';
import { Board } from '../model/board.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  currentStep = 1;
  selectedBoard = '';
  selectedSensors: any[] = [];
  qrText = '';
  qrCode = false; // Flag to indicate if QR was generated
  boards: Board[] = [];



  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  toggleSensor(sensor: any) {
    const index = this.selectedSensors.findIndex(s => s.sensorName === sensor.sensorName);

    if (index > -1) {
      this.selectedSensors.splice(index, 1);
    } else {
      this.selectedSensors.push(sensor);
    }
  }

  generateQRCode() {
    // QR generation logic
  }


}
