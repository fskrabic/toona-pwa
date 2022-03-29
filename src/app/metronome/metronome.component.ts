import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SettingsService } from '../settings-service/settings.service';
import Timer from './timer';

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.css'],
})
export class MetronomeComponent implements OnInit, AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private router: Router,
    public settingsService: SettingsService
  ) {}

  //@ViewChild('container') container: ElementRef<HTMLElement>;
  @ViewChild('tapContainer') tapContainer: ElementRef<HTMLElement>;

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
  public bpm: number = 150;
  public beatsPerMeasure: number = 4;
  public tempoTextString: string = 'Medium';
  public count: number = 0;
  private isRunning: boolean = false;

  public groundZero = 0;
  public lastTap = 0;
  public counter = 0;
  public tapDiff = 0;
  public previousTap = 0;
  public elapsed = 0;
  public showTapTempo: boolean = false;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.metronome.stop();
      }
    });

    this.settingsService.showTapTempo$.subscribe((val) => {
      if (val) {
        setTimeout(() => {
          const clickArea = this.tapContainer.nativeElement;
          if (this.isTouchDevice()) {
            this.renderer.listen(clickArea, 'touchstart', () => this.tapTempo());
          } else {
            this.renderer.listen(clickArea, 'click', () => this.tapTempo());
          }
        }, 100);
       
        //const container = this.container.nativeElement;
       
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

  close() {
    this.settingsService.showTapTempo$.next(false);
  }

  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  tapTempo() {
    window.addEventListener('keydown', function (e) {
      if (e.code === 'space' && e.target === document.body) {
        e.preventDefault();
      }
    });

    // changeBGColor();
    // const element = document.getElementsByTagName('.bpmContainer');
    // element[0].classList.add('addAnimation');

    // This function runs when the CSS animation is completed
    //   const listener = element[0].addEventListener('animationend', function() {
    //     element[0].classList.remove('addAnimation');

    //     // this removes the listener after it runs so that it doesn't get re-added every time the button is clicked
    //     element[0].removeEventListener('animationend', listener);
    //     console.log('remove class element');
    //   });

    // if first time then record first tap
    if (this.lastTap === 0) {
      this.groundZero = new Date().getTime();
      this.counter = 0;
    }

    this.lastTap = new Date().getTime();
    this.elapsed = new Date().getTime() - this.previousTap;

    this.previousTap = this.lastTap;
    this.tapDiff = this.lastTap - this.groundZero;
    if (this.tapDiff !== 0) {
      this.bpm = Math.round((60000 * this.counter) / this.tapDiff);
    }
    // eslint-disable-next-line no-plusplus
    this.counter++;
    // console.log(`elapsed: ${elapsed} avgbpm: ${avgbpm}`);
    if (this.elapsed > 3000) {
      this.lastTap = 0;
    }
  }

  // public detectDoubleTapCloseure() {
  //   let lastTap = 0;
  //   let timeout;
  //   return function detectDoubleTap(event) {
  //     const curTime = new Date().getTime();
  //     const tapLen = curTime - lastTap;
  //     if (tapLen < 500 && tapLen > 0) {
  //       console.log('xd')
  //       event.preventDefault();
  //     } else {
  //       timeout = setTimeout(() => {
  //         clearTimeout(timeout);
  //       }, 500);
  //     }
  //     lastTap = curTime;
  //   };
  // }
}
