import { Component, OnInit } from '@angular/core';
import { Step1Component } from '../step1/step1.component';
import { Step2Component } from '../step2/step2.component';
import { Step3Component } from '../step3/step3.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { WorkflowService } from '../../services/workflow.service';
import { SennseBoardsApiService } from '../../services/api/sennse-boards-api.service';
import { Board } from '../../model/board.model';

@Component({
  selector: 'app-new-room',
  imports: [
    ProgressBarComponent,
    Step1Component,
    Step2Component,
    Step3Component
  ],
  templateUrl: './new-room.component.html',
  styleUrl: './new-room.component.css',
  standalone: true
})
export class NewRoomComponent {
  constructor(public workflow: WorkflowService) { }

}
