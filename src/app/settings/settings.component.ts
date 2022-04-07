import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Instrument,
  SettingsService,
  Tuning,
} from '../settings-service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {}

  public instruments: Array<Instrument>;
  public tunings: Array<Tuning>;
  public selectedInstrument: Instrument;
  public selectedTuning: Tuning;

  ngOnInit(): void {
    this.instruments = this.settingsService.getInstruments();
  }
  public setInstrument() {
    if (this.selectedInstrument.name === 'Guitar') {
      this.settingsService.selectedInstrument$.next(this.selectedInstrument);
      this.tunings = this.settingsService.getGuitarTunings();
    } else if (this.selectedInstrument.name === 'Bass') {
      this.settingsService.selectedTuning$.next(this.selectedTuning);
      this.tunings = this.settingsService.getBassTunings();
    }
  }
  public setTuning() {
    this.settingsService.selectedTuning$.next(this.selectedTuning);
  }
  public saveSettings() {
    this.router.navigate(['/tuner']);
  }

}
