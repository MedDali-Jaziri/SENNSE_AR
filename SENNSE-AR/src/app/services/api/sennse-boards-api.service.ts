import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Board } from '../../model/board.model';
import { Sensor } from '../../model/sensor.model';
import { Project } from '../../model/project.model';
import { Room } from '../../model/room.model';
import { QRCode } from '../../model/QRCode.models';


@Injectable({
  providedIn: 'root'
})
export class SennseBoardsApiService {
  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }


  getBoardList() {
    const getBoardListAPI = `${this.baseUrl}/sennse-ar/list-board`;

    return this.http.get<Board[]>(getBoardListAPI).pipe(
      catchError((error) => {
        console.log('Error fetching board list', error);
        return throwError(() => new Error('Failed to load board list.'));
      })
    )
  }

  getSensorsByBoard(board: Board): Sensor[] {
    return board.sensorModelList;
  }

  qrCodeGenerator(data: string, logoFile: File) {
    const qrCodeGeneratorAPI = `${this.baseUrl}/sennse-ar/qr-code-generate`;

    const formData = new FormData();
    formData.append('data', data);
    formData.append('logoPath', logoFile);

    return this.http.post(qrCodeGeneratorAPI, formData, { responseType: 'blob' });
  }

  createProject(project: Project): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/sennse-ar/json-generator-file`, project, { headers });
  }

  // fetchRoom(): Observable<{ [key: string]: Room[] }> {
  //   const getRoomListAPI = `${this.baseUrl}/sennse-ar/list-of-files`;

  //   // return this.http.get<{ [key: string]: Room[] }>(getRoomListAPI).pipe(
  //   //   catchError((error) => {
  //   //     console.log('Error fetching board list', error);
  //   //     return throwError(() => new Error('Failed to load board list.'));
  //   //   })
  //   // );
  //   return this.http.get<Record<string, Room[]>>(getRoomListAPI);

  // }

  fetchRoom(): Observable<Room[]> {
    const getRoomListAPI = `${this.baseUrl}/sennse-ar/list-of-files`;
    return this.http.get<Room[]>(getRoomListAPI);
  }

  fetchQRCodeList(): Observable<QRCode[]> {
    const getQRCodeListAPI = `${this.baseUrl}/sennse-ar/qr-code-list`
    return this.http.get<QRCode[]>(getQRCodeListAPI);
  }

}
