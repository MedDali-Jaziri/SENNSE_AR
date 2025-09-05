import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SennseBoardsApiService } from '../../services/api/sennse-boards-api.service';
import { Project } from '../../model/project.model';
import { Board } from '../../model/board.model';
import { Sensor } from '../../model/sensor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'step3',
  imports: [CommonModule, FormsModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.css'
})
export class Step3Component implements OnInit {
  selectedSensors: any[] = [];
  targetContent = '';
  showOverviewModal = false;
  projectName: any = '';
  projectDescription = '';
  showProjectNameError = false;
  showProjectDescriptionError = false;


  constructor(public workflow: WorkflowService, private sennseBoardsApiService: SennseBoardsApiService, private router: Router) { }

  ngOnInit() {
    console.log("The first log step3 !!!");

    this.selectedSensors = [...this.workflow.selectedSensors];
    this.updateTargetPreview();
  }

  toggleSensor(sensor: any) {
    const index = this.selectedSensors.findIndex(s => s.sensorName === sensor.sensorName);
    if (index > -1) {
      this.selectedSensors.splice(index, 1);
    } else {
      this.selectedSensors.push(sensor);
    }
    this.updateTargetPreview();
  }

  isSelected(sensor: any) {
    return this.selectedSensors.some(s => s.sensorName === sensor.sensorName);
  }

  updateTargetPreview() {
    this.targetContent = this.generateTargetFile();
  }

  generateTargetFile() {
    console.log(this.selectedSensors);
    console.log(this.selectedSensors.length);

    const timestamp = new Date().toISOString();
    const boardId = this.workflow.selectedBoard;

    let content = `// Workflow Configuration Target File
// Generated on: ${timestamp}
// Board ID: ${this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))?.id}
// Board Name: ${this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))?.boardName.toUpperCase()}
// Board UUID: ${this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))?.boardUUId}
// Total Sensors: ${this.selectedSensors.length}

{
  "configuration": {
    "board": "${this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))?.boardName}",
    "timestamp": "${timestamp}",
    "sensors": [`;

    this.selectedSensors.forEach((sensor, index) => {
      content += `
      {
        "id": "${sensor.sensorId}",
        "name": "${sensor.sensorName}",
        "description": "${sensor.sensorDescription}",
        "enabled": true,
        "config": {
          "pin": "auto",
          "sampling_rate": 1000,
          "data_type": "float"
        }
      }${index < this.selectedSensors.length - 1 ? ',' : ''}`;
    });

    content += `
    ],
    "qr_code": {
      "generated": ${!!this.workflow.qrCode},
      "type": "${this.workflow.qrCode ? 'generated' : 'not_generated'}"
    },
    "output_format": "json",
    "version": "1.0.0"
  }
}`;

    return content;
  }

  isProjectNameValid(): boolean {
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    return validPattern.test(this.projectName.trim());
  }

  downloadFinalTargetFile() {
    if (!this.projectName.trim() || !this.projectDescription.trim()) {
      this.showProjectNameError = true;
      this.showProjectDescriptionError = true;
      return;
    }

    this.showProjectNameError = false;

    const name = this.projectName.trim();
    const description = this.projectDescription.trim();

    const sensorList: Sensor[] = [];
    const boardList: Board[] = [];

    this.selectedSensors.forEach((sensor, index) => {
      sensorList.push({
        sensorId: sensor.sensorId,
        sensorName: sensor.sensorName,
        sensorDescription: sensor.sensorDescription
      });
    });

    boardList.push({
      id: this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))!.id,
      boardName: this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))!.boardName.toString(),
      boardDescription: this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))!.boardDescription.toString(),
      boardUUId: this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard))!.boardUUId,
      qrCodePath: this.workflow.qrText,
      sensorModelList: sensorList
    });

    const projectData: Project = {
      projectName: name,
      projectDescription: description,
      boardModelList: boardList
    }
    this.jsonGeneratorFile(projectData);

    const blob = new Blob([this.targetContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.showOverviewModal = false;

    const boardName = this.getSelectedBoardName();

    alert(`Workflow completed successfully!\n\nConfiguration Summary:\n- Project: ${name}\n- Board: ${boardName}\n- Sensors: ${this.selectedSensors.length}\n- QR Code: ${this.workflow.qrCode ? 'Generated' : 'Not generated'}`);
  }

  jsonGeneratorFile(project: Project) {
    console.log("Project Object", project);
    console.log("Project Object - Board Details: ", project.boardModelList);
    console.log("Project Object - Sensor Details: ", project.boardModelList);
    
    this.sennseBoardsApiService.createProject(project).subscribe({
      next: (response) => {
        console.log("Project created successfully", response);
        this.workflow.currentStep = 1;
        this.workflow.selectedSensors = [];
        this.router.navigate([''], { replaceUrl: true });
      },
      error: (error) => {
        console.log("Error creating project", error);
      }
    });
  }


  openOverviewModal() {
    if (this.selectedSensors.length === 0) {
      alert('Please select at least one sensor for the target file');
      return;
    }
    this.showOverviewModal = true;
  }

  getSelectedBoardName(): string {
    const board = this.workflow.boards.find(b => b.id === Number(this.workflow.selectedBoard));
    return board ? board.boardName : '';
  }


}
