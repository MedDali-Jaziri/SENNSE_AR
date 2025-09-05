import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NewRoomComponent } from './modules/new-room/new-room.component';
import { RoomDetailComponent } from './modules/room-detail/room-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'new-room', component: NewRoomComponent, pathMatch: 'full'},
  { path: 'room/:id', component: RoomDetailComponent, pathMatch: 'full'}
];


@NgModule({
  providers: [provideHttpClient()],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
