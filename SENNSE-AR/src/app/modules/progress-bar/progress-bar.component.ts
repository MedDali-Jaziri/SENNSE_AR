import { Component, Input } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'progress-bar',
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent {
  @Input() steps = [1, 2, 3];
  stepTitles = ['SENNSE Interfacing', 'QR Code Generation', 'Target File Creation'];

  constructor(public workflow: WorkflowService) { }

  getStepClasses(step: number) {
    return {
      'progress-step': true,
      'active': this.workflow.currentStep === step,
      'completed': this.workflow.currentStep > step
    };
  }

  setStep(step: number) {
    if (step < this.workflow.currentStep) {
      this.workflow.currentStep = step;
    }
  }
}
