import { Injectable, OnDestroy, OnInit } from '@angular/core';
import ml5 from 'ml5';
import { Subject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TunerService implements OnDestroy, OnInit{
  private audioContext: AudioContext = new AudioContext();
  private pitch: any;

  public pitchSubject: Subject<number> = new Subject();

  private pitchSubscription: Subscription;

  constructor() {}


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(document);
   
  }

  setup = async () => {
   
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.startPitch(stream, this.audioContext);
    document.addEventListener('visibilitychange', this.checkTabFocused);
  };

  public startPitch = (stream: MediaStream, audioContext: AudioContext) => {
    this.pitch = ml5.pitchDetection(
      '../../model',
      audioContext,
      stream,
      this.modelLoaded
    );
  };

  public modelLoaded = () => {
    const src = interval(300);
    if (!this.pitchSubscription) {
      this.pitchSubscription = src.subscribe(this.getPitch);
    }
  };

  public getPitch = () => {
    if (this.pitch.frequency) {
      this.pitchSubject.next(this.pitch.frequency);
    }
  };

  ngOnDestroy(): void {
    this.pitchSubscription.unsubscribe();
  }

  checkTabFocused = () => {
    if (document.visibilityState === 'visible') {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } else {
      if (this.audioContext.state === 'running') {
        this.audioContext.suspend();
      }
    }
  }
}
