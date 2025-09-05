import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Board } from '../../model/board.model';
import { SennseBoardsApiService } from '../../services/api/sennse-boards-api.service';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'step1',
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.css'
})
export class Step1Component implements OnInit {

  constructor(public workflow: WorkflowService, private sennseBoardsApiService: SennseBoardsApiService) { }

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.sennseBoardsApiService.getBoardList().subscribe({
      next: (data) => {
        this.workflow.boards = data;
      },
      error: (err) => {
        console.error('Failed to fetch board list:', err);
      }
    });
  }

  boardChanged() {
    console.log();
    
    this.workflow.selectedSensors = [];
  }

  get availableSensors() {
    const board = this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard));
    return board?.sensorModelList || [];
  }


  isSelected(sensor: any) {
    return this.workflow.selectedSensors.some(s => s.sensorName === sensor.sensorName );
  }

  toggleSensor(sensor: any) {    
    this.workflow.toggleSensor(sensor);
  }

  removeSensor(sensor: any) {
    this.workflow.toggleSensor(sensor);
  }
}
