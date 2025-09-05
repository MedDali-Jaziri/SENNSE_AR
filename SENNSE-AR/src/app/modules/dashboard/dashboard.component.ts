import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SennseBoardsApiService } from '../../services/api/sennse-boards-api.service';
import { CommonModule } from '@angular/common';
import { Room } from '../../model/room.model';
import { RoomService } from '../../services/room.service';
import { QRCode } from '../../model/QRCode.models';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{
  hoveredCard: string | null = null;
  boards: any[] = [];
  rooms: Room[] = [];
  qrCodeList: QRCode[] = [];

  showQRTable = false;
  baseUrl = environment.apiUrl

  constructor(private router: Router, private sennseBoardsApiService: SennseBoardsApiService, private roomService: RoomService) { }

  ngOnInit(): void {
    console.log("Call OnInit !!!");
    this.fetchRooms();

    this.fetchQRCode();
  }

  handleCreateRoom() {
    this.router.navigate(['/new-room']);
  }

  handleRoomClick(room: Room) {
    this.roomService.setRoom(room);
    this.router.navigate(['/room', room.projectName]);
  }

  fetchRooms(): void {
    this.sennseBoardsApiService.fetchRoom().subscribe((data) => {
      // Flatten all rooms from all projects
      this.rooms = Object.values(data).flat();
    });

  }

  toggleQRTable(): void {
    this.showQRTable = !this.showQRTable
  }

  downloadQR(qr: QRCode, index: number): void {
    // Set downloading state
    this.qrCodeList[index].downloading = true

    // Simulate download process
    setTimeout(() => {
      // Create download link
      const link = document.createElement("a")
      link.href = `${this.baseUrl + qr.url_QR}`
      link.download = `${qr.qr_identifier.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Reset downloading state
      this.qrCodeList[index].downloading = false
    }, 1500)
  }

  fetchQRCode(): void {
    this.sennseBoardsApiService.fetchQRCodeList().subscribe((data) => {
      this.qrCodeList = Object.values(data).flat();
      console.log("QR Code List inside subscribe:", this.qrCodeList);
    });
    console.log("QR Code List inside subscribe:", this.qrCodeList);
  }

}
