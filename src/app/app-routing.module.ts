import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component'
import { TunerComponent } from './tuner/tuner.component';
import { AboutComponent } from './about/about.component';
import { MetronomeComponent } from './metronome/metronome.component';

const routes: Routes = [
  { path: '', redirectTo: '/tuner', pathMatch: 'full' },
  {path: "tuner", component: TunerComponent},
  {path: "metronome", component: MetronomeComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'about', component: AboutComponent},
  {path: "**", component: TunerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
