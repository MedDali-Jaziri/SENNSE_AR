import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SennseBoardsApiService } from '../../services/api/sennse-boards-api.service';
import { CommonModule } from '@angular/common';
import { Room } from '../../model/room.model';
import { RoomService } from '../../services/room.service';
import { QRCode } from 'src/app/model/QRCode.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'dashboard',
  imports: [CommonModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  hoveredCard: string | null = null;
  boards: any[] = [];
  rooms: Room[] = [];
  qrCodeList: QRCode[] = [];

  showQRTable = false;
  baseUrl = environment.apiUrl

  constructor(private router: Router, private sennseBoardsApiService: SennseBoardsApiService, private roomService: RoomService) { }


  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    console.log('ngOnInit - runs once when component is created');

    this.fetchRooms();

    this.fetchQRCode();
  }

  // Ionic lifecycles
  ionViewWillEnter() {
    console.log('ionViewWillEnter - about to show the page');

    this.fetchRooms();

    this.fetchQRCode();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter - page fully active');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave - about to leave the page');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave - page is now inactive');
  }

  // handleRoomClick(roomPath: string) {
  //   this.router.navigate([roomPath]);
  // }

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
      console.log(this.rooms);
      console.log(this.rooms[0]);
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
