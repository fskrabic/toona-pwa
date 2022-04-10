import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TunerService } from 'src/app/services/tuner.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TunerComponent } from './components/tuner/tuner.component';
import { MatSelectModule } from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { AboutComponent } from './components/about/about.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MetronomeComponent } from './components/metronome/metronome.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AppUpdateService } from './services/app-update.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    TunerComponent,
    SettingsComponent,
    AboutComponent,
    MetronomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    NgxSliderModule,
    MatDialogModule,
  ],
  providers: [TunerService, AppUpdateService],
  bootstrap: [AppComponent, NavigationComponent],
  exports: []
})
export class AppModule {}
