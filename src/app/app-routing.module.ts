import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TunerComponent } from './components/tuner/tuner.component';
import { AboutComponent } from './components/about/about.component';
import { MetronomeComponent } from './components/metronome/metronome.component';

const routes: Routes = [
  {path: '', redirectTo: '/tuner', pathMatch: 'full' },
  {path: "tuner", component: TunerComponent},
  {path: "metronome", component: MetronomeComponent},
  {path: 'about', component: AboutComponent},
  {path: "**", component: TunerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
