import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsPage } from './pages/tournaments/tournaments.page';

const routes: Routes = [
  { path: 'tournaments', component: TournamentsPage },
  { path: '**', redirectTo: 'tournaments' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
