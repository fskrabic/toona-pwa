import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import Timer from './timer';

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.css'],
})
export class MetronomeComponent implements OnInit, AfterViewInit {
  constructor(private renderer: Renderer2, private router: Router) {}

  @ViewChild('increaseTempoBtn')
  increaseTempoBtn: ElementRef<HTMLButtonElement>;
  @ViewChild('deacreaseTempoBtn')
  decreaseTempoBtn: ElementRef<HTMLButtonElement>;
  @ViewChild('decreaseMeasureCountBtn')
  decreaseMeasureCountBtn: ElementRef<HTMLButtonElement>;
  @ViewChild('increaseMeasureCountBtn')
  increaseMeasureCountBtn: ElementRef<HTMLButtonElement>;
  @ViewChild('slider') slider: ElementRef<HTMLInputElement>;
  @ViewChild('startBtn') startBtn: ElementRef<HTMLButtonElement>;

  private click1 = new Audio('assets/sounds/click1.mp3');
  private click2 = new Audio('assets/sounds/click2.mp3');

  private metronome: any;

  public bpm: number = 140;
  public beatsPerMeasure: number = 4;
  public tempoTextString: string = 'Medium';
  public count: number = 0;
  private isRunning: boolean = false;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.metronome.stop();
      }
    });
  }

  ngAfterViewInit(): void {
    this.metronome = new Timer(this.playClick, 60000 / this.bpm, {
      immediate: true,
    });
    this.renderer.listen(this.increaseTempoBtn.nativeElement, 'click', () => {
      this.bpm++;
      this.validateTempo();
      this.updateMetronome();
    });
    this.renderer.listen(this.decreaseTempoBtn.nativeElement, 'click', () => {
      this.bpm--;
      this.validateTempo();
      this.updateMetronome();
    });
    this.renderer.listen(this.slider.nativeElement, 'input', () => {
      this.bpm = this.slider.nativeElement.valueAsNumber;
      this.validateTempo();
      this.updateMetronome();
    });
    this.renderer.listen(
      this.increaseMeasureCountBtn.nativeElement,
      'click',
      () => {
        if (this.beatsPerMeasure >= 12) {
          return;
        }
        this.beatsPerMeasure++;
        this.count = 0;
      }
    );
    this.renderer.listen(
      this.decreaseMeasureCountBtn.nativeElement,
      'click',
      () => {
        if (this.beatsPerMeasure <= 2) {
          return;
        }
        this.beatsPerMeasure--;
        this.count = 0;
      }
    );
    this.renderer.listen(this.startBtn.nativeElement, 'click', () => {
      this.count = 0;
      if (!this.isRunning) {
        this.metronome.start();
        this.isRunning = true;
        this.startBtn.nativeElement.textContent = 'STOP';
      } else {
        this.metronome.stop();
        this.isRunning = false;
        this.startBtn.nativeElement.textContent = 'START';
      }
    });
  }

  private updateMetronome = () => {
    this.slider.nativeElement.value = this.bpm.toString();
    this.metronome.timeInterval = 60000 / this.bpm;
  };
  private validateTempo = () => {
    if (this.bpm <= 20 || this.bpm >= 280) {
      return;
    }
  };
  private playClick = () => {
    console.log(this);
    if (this.count === this.beatsPerMeasure) {
      this.count = 0;
    }
    if (this.count === 0) {
      this.click1.play();
      this.click1.currentTime = 0;
    } else {
      this.click2.play();
      this.click2.currentTime = 0;
    }
    this.count++;
  };
}
