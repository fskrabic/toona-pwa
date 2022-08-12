import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import Metronome from './metronome';
import {
  trigger,
  style,
  animate,
  transition,
  state,
} from '@angular/animations';
import { MatButton } from '@angular/material/button';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  animations: [
    trigger('flyIn', [
      state('in', style({})),
      transition('void => *', [
        style({ transform: 'translateY(-100%)' }),
        animate(300),
      ]),
    ]),
  ],
})
export class MetronomeComponent implements OnInit, AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private router: Router,
    public settingsService: SettingsService
  ) {}

  @ViewChild('tapContainer') tapContainer: ElementRef<HTMLElement>;

  @ViewChild('increaseTempoBtn')
  increaseTempoBtn: MatButton;
  @ViewChild('deacreaseTempoBtn')
  decreaseTempoBtn: MatButton;
  @ViewChild('decreaseMeasureCountBtn')
  decreaseMeasureCountBtn: MatButton;
  @ViewChild('increaseMeasureCountBtn')
  increaseMeasureCountBtn: MatButton;
  @ViewChild('slider') slider: ElementRef;
  @ViewChild('startBtn') startBtn: MatButton;

  private click1 = new Audio('assets/sounds/click1.mp3');
  private click2 = new Audio('assets/sounds/click2.mp3');

  private metronome: any;
  public bpm: number = 150;
  public beatsPerMeasure: number = 4;
  public tempoTextString: string = 'Allegro';
  public count: number = 0;
  public isRunning: boolean = false;
  public metronomeOptions: Options = {
    floor: 20,
    ceil: 280,
    step: 1,
  };

  public startingTime = 0;
  public lastTap = 0;
  public counter = 0;
  public tapDiff = 0;
  public previousTap = 0;
  public elapsed = 0;
  public showTapTempo: boolean = false;
  public tapTempoMsg: string;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.metronome.stopMetronome();
      }
    });

    this.isTouchDevice()
      ? (this.tapTempoMsg = 'Tap to find BPM!')
      : (this.tapTempoMsg = 'Click left mouse button to find BPM!');
    this.settingsService.showTapTempo$.subscribe((val) => {
      if (val) {
        setTimeout(() => {
          const clickArea = this.tapContainer?.nativeElement;
          if (clickArea) {
            if (this.isTouchDevice()) {
              this.renderer.listen(clickArea, 'touchstart', () =>
                this.tapTempo()
              );
            } else {
              this.renderer.listen(clickArea, 'click', () => this.tapTempo());
            }
          }
        }, 100);
      }
    });
  }

  ngAfterViewInit(): void {
    this.metronome = new Metronome(this.playClick, 60000 / this.bpm);
  }

  public decreaseTempo() {
    if (this.bpm <= 20) {
      return;
    }
    this.bpm--;
    this.updateMetronome();
  }

  public increaseTempo() {
    if (this.bpm >= 280) {
      return;
    }
    this.bpm++;
    this.updateMetronome();
  }

  public startMetronome() {
    this.count = 0;
    if (!this.isRunning) {
      this.metronome.startMetronome();
      this.isRunning = true;
    } else {
      this.metronome.stopMetronome();
      this.isRunning = false;
    }
  }

  public subtractBeats() {
    if (this.beatsPerMeasure <= 2) {
      return;
    }
    this.beatsPerMeasure--;
    this.count = 0;
  }

  public addBeats() {
    if (this.beatsPerMeasure >= 12) {
      return;
    }
    this.beatsPerMeasure++;
    this.count = 0;
  }

  public updateMetronome = () => {
    this.metronome.interval = 60000 / this.bpm;

    if (this.bpm <= 40) {
      this.tempoTextString = 'Grave';
    }
    if (this.bpm > 40 && this.bpm < 45) {
      this.tempoTextString = 'Largo';
    }
    if (this.bpm > 45 && this.bpm < 60) {
      this.tempoTextString = 'Lento';
    }
    if (this.bpm > 60 && this.bpm < 66) {
      this.tempoTextString = 'Larghetto';
    }
    if (this.bpm > 66 && this.bpm < 76) {
      this.tempoTextString = 'Adagio';
    }
    if (this.bpm > 76 && this.bpm < 108) {
      this.tempoTextString = 'Andante';
    }
    if (this.bpm > 108 && this.bpm < 120) {
      this.tempoTextString = 'Moderato';
    }
    if (this.bpm > 120 && this.bpm <= 156) {
      this.tempoTextString = 'Allegro';
    }
    if (this.bpm > 156 && this.bpm <= 176) {
      this.tempoTextString = 'Vivace';
    }
    if (this.bpm > 176 && this.bpm <= 200) {
      this.tempoTextString = 'Presto';
    }
    if (this.bpm > 200 && this.bpm <= 280) {
      this.tempoTextString = 'Prestissimo';
    }
  };
  private playClick = () => {
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

  public close() {
    this.settingsService.showTapTempo$.next(false);
  }

  public isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private tapTempo() {
    window.addEventListener('keydown', function (e) {
      if (e.code === 'space' && e.target === document.body) {
        e.preventDefault();
      }
    });

    this.renderer.addClass(this.tapContainer.nativeElement, 'addAnimation');

    this.renderer.listen(
      this.tapContainer.nativeElement,
      'animationend',
      () => {
        this.renderer.removeClass(
          this.tapContainer.nativeElement,
          'addAnimation'
        );
      }
    );

    if (this.lastTap === 0) {
      this.startingTime = new Date().getTime();
      this.counter = 0;
    }

    this.lastTap = new Date().getTime();
    this.elapsed = new Date().getTime() - this.previousTap;

    this.previousTap = this.lastTap;
    this.tapDiff = this.lastTap - this.startingTime;
    this.counter++;
    if (this.tapDiff !== 0) {
      this.bpm = Math.round((60000 * this.counter) / this.tapDiff);
      if (this.bpm > 280) {
        this.bpm = 280;
      }
    }
   
    if (this.elapsed > 3000) {
      this.lastTap = 0;
    }
    this.updateMetronome();
  }
}
