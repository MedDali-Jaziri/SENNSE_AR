import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SennseBoardsApiService } from '../../services/api/sennse-boards-api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'step2',
  imports: [CommonModule, FormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component implements OnDestroy {

  selectedSensors: any[] = [];
  qrData = '';
  uploadedImage: string | null = null;

  qrImageFromApi: SafeUrl | null = null;
  qrBlobUrl: string | null = null;
  logoFile: File | null = null;
  hasQRCode = false;


  constructor(public workflow: WorkflowService, private sennseBoardsApiService: SennseBoardsApiService, private sanitizer: DomSanitizer) { }
  ngOnDestroy(): void {
    if (this.qrBlobUrl) {
      URL.revokeObjectURL(this.qrBlobUrl);
    }

  }

  generateQR() {
    const hasText = this.workflow.qrText?.trim().length > 0;
    const hasImage = !!this.logoFile;

    if (!hasText || !hasImage) {
      alert('Please provide both QR code text and upload an image before proceeding.');
      return;
    }

    this.sennseBoardsApiService.qrCodeGenerator(this.workflow.qrText.trim(), this.logoFile!)
      .subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          this.qrImageFromApi = this.sanitizer.bypassSecurityTrustUrl(url);
          this.qrBlobUrl = url;
          this.hasQRCode = true;
          this.selectedSensors = [...this.workflow.selectedSensors];
        },
        error: (err) => {
          console.error('Error generating QR code:', err);
          alert('Failed to generate QR code. Please try again.');
        }
      });
  }

  handleFileUpload(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.logoFile = input.files[0];
  }

  downloadQR() {
    if (!this.qrBlobUrl || !this.workflow.qrText?.trim()) return;

    const link = document.createElement('a');
    link.href = this.qrBlobUrl;

    // Clean filename: remove illegal filename characters
    const safeFileName = this.workflow.qrText.trim().replace(/[\\/:*?"<>|]/g, '_');
    link.download = `${safeFileName}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  private createQRPlaceholder(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    canvas.width = 200;
    canvas.height = 200;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#fff';

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * 10, j * 10, 10, 10);
        }
      }
    }

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE', 100, 100);
    ctx.fillText(this.workflow.qrText.substring(0, 10), 100, 115);
  }

  private downloadCanvas(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.download = 'workflow-qr.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  // get hasQRCode() {
  //   return this.qrData || this.uploadedImage;
  // }

}
