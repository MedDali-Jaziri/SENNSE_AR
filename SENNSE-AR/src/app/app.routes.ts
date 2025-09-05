import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NewRoomComponent } from './modules/new-room/new-room.component';
import { RoomDetailComponent } from './modules/room-detail/room-detail.component';

export const routes: Routes = [

    // Those for the MindAR Library
    { path: '', component: DashboardComponent},
    { path: 'new-room', component: NewRoomComponent, pathMatch: 'full'},
    { path: 'room/:id', component: RoomDetailComponent, pathMatch: 'full'}
];
