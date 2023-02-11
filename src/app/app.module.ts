import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TournamentsPage } from './pages/tournaments/tournaments.page';
import { FreeSpotsColorPipe } from './pipes/free-spots-color.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TournamentsPage,
    FreeSpotsColorPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
