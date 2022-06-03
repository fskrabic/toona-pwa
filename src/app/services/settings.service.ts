import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../components/tuner/tuner.component';

import {
  guitarStandard,
  guitarCeltic,
  guitarDropA,
  guitarDropD,
  guitarHalfStepDown,
  guitarOpenA,
  guitarOpenB,
  guitarOpenC,
  guitarOpenD,
  guitarOpenE,
  guitarOpenF,
  guitarOpenG,
  bassStandard,
  bassCStandard,
  bassDropC,
  bassDropD,
  bassHalfStepDown,
  bassPiccolo,
  bassWholeStepDown,
  ukuleleBaritone,
  ukuleleC,
  ukuleleLowG,
  ukuleleSlackKey,
  ukuleleStandard,
} from './tuning.consts';

export interface Instrument {
  code: string;
  name: string;
  numberOfStrings: number;
}
export interface Tuning {
  instrument: string;
  code: string;
  name: string;
  notes: Note[];
  noteString: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  private autoDetectionMode: boolean = true;

  public showTapTempo$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public selectedInstrument$: BehaviorSubject<Instrument> = new BehaviorSubject(
    { code: 'guitar', name: 'Guitar', numberOfStrings: 6 }
  );
  public selectedTuning$: BehaviorSubject<Tuning> = new BehaviorSubject({
    instrument: 'guitar',
    code: 'guitar-standard',
    noteString: 'E2 A2 D3 G3 B3 E4',
    name: 'Standard',
    notes: guitarStandard,
  });

  public instruments: Instrument[] = [
    { code: 'guitar', name: 'Guitar', numberOfStrings: 6 },
    { code: 'bass', name: 'Bass', numberOfStrings: 4 },
    { code: '7stringguitar', name: '7 String Guitar', numberOfStrings: 7 },
    { code: 'ukulele', name: 'Ukulele', numberOfStrings: 4}
  ];
  private guitarTunings: Tuning[] = [
    {
      instrument: 'guitar',
      code: 'guitar-standard',
      name: 'Standard',
      notes: guitarStandard,
      noteString: this.getNotes(guitarStandard),
    },
    {
      instrument: 'guitar',
      code: 'guitar-half-step-down',
      name: 'Half-step down',
      notes: guitarHalfStepDown,
      noteString: this.getNotes(guitarHalfStepDown),
    },
    {
      instrument: 'guitar',
      code: 'guitar-drop-d',
      name: 'Drop D',
      notes: guitarDropD,
      noteString: this.getNotes(guitarDropD),
    },
    {
      instrument: 'guitar',
      code: 'guitar-drop-a',
      name: 'Drop A',
      notes: guitarDropA,
      noteString: this.getNotes(guitarDropA),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-a',
      name: 'Open A',
      notes: guitarOpenA,
      noteString: this.getNotes(guitarOpenA),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-b',
      name: 'Open B',
      notes: guitarOpenB,
      noteString: this.getNotes(guitarOpenB),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-c',
      name: 'Open C',
      notes: guitarOpenC,
      noteString: this.getNotes(guitarOpenC),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-d',
      name: 'Open D',
      notes: guitarOpenD,
      noteString: this.getNotes(guitarOpenD),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-e',
      name: 'Open E',
      notes: guitarOpenE,
      noteString: this.getNotes(guitarOpenE),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-f',
      name: 'Open F',
      notes: guitarOpenF,
      noteString: this.getNotes(guitarOpenF),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-g',
      name: 'Open G',
      notes: guitarOpenG,
      noteString: this.getNotes(guitarOpenG),
    },
    {
      instrument: 'guitar',
      code: 'guitar-celtic',
      name: 'Celtic',
      notes: guitarCeltic,
      noteString: this.getNotes(guitarCeltic),
    },
  ];
  private bassTunings: Tuning[] = [
    {
      instrument: 'bass',
      code: 'bass-standard',
      name: 'Standard',
      notes: bassStandard,
      noteString: this.getNotes(bassStandard),
    },
    {
      instrument: 'bass',
      code: 'bass-half-step-down',
      name: 'Half-step down',
      notes: bassHalfStepDown,
      noteString: this.getNotes(bassHalfStepDown),
    },
    {
      instrument: 'bass',
      code: 'bass-whole-step-down',
      name: 'Whole-step down',
      notes: bassWholeStepDown,
      noteString: this.getNotes(bassWholeStepDown),
    },
    {
      instrument: 'bass',
      code: 'bass-c-standard',
      name: 'C Standard',
      notes: bassCStandard,
      noteString: this.getNotes(bassCStandard),
    },
    {
      instrument: 'bass',
      code: 'bass-drop-c',
      name: 'Drop C',
      notes: bassDropC,
      noteString: this.getNotes(bassDropC),
    },
    {
      instrument: 'bass',
      code: 'bass-drop-d',
      name: 'Drop D',
      notes: bassDropD,
      noteString: this.getNotes(bassDropD),
    },
    {
      instrument: 'bass',
      code: 'bass-piccolo',
      name: 'Piccolo',
      notes: bassPiccolo,
      noteString: this.getNotes(bassPiccolo),
    },
  ];

  private ukuleleTunings: Tuning[] = [
    {
      instrument: 'ukulele',
      code: 'ukulele-standard',
      name: 'Standard',
      notes: ukuleleStandard,
      noteString: this.getNotes(ukuleleStandard),
    },
    {
      instrument: 'ukulele',
      code: 'ukulele-c',
      name: 'C Standard',
      notes: ukuleleC,
      noteString: this.getNotes(ukuleleC),
    },
    {
      instrument: 'ukulele',
      code: 'ukulele-baritone',
      name: 'Baritone',
      notes: ukuleleBaritone,
      noteString: this.getNotes(ukuleleBaritone),
    },
    {
      instrument: 'ukulele',
      code: 'ukulele-low-g',
      name: 'Low G',
      notes: ukuleleLowG,
      noteString: this.getNotes(ukuleleLowG),
    },
    {
      instrument: 'ukulele',
      code: 'ukulele-slack-key',
      name: 'Slack key',
      notes: ukuleleSlackKey,
      noteString: this.getNotes(ukuleleSlackKey),
    },
  ];

  public getInstruments() {
    return this.instruments;
  }
  public getGuitarTunings() {
    return this.guitarTunings;
  }
  public getBassTunings() {
    return this.bassTunings;
  }
  public getUkuleleTunings() {
    return this.ukuleleTunings;
  }
  public getAutoDetection() {
    return this.autoDetectionMode;
  }

  public setTuning(tuning: Tuning) {
    this.selectedTuning$.next(tuning);
  }
  public setAutoDetection(value: boolean) {
    this.autoDetectionMode = value;
  }
  private getNotes(notes: Note[]) {
    let noteString: string = '';
    notes.forEach((note) => {
      noteString += ' ' + note.note;
    });
    return noteString.trimStart();
  }
}
