import {
  Directive,
  HostBinding,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Directive({
  selector: '[appOpenSidebarOnSwipe]',
})
export class OpenSidebarOnSwipeDirective {
  sidebar: MatSidenav;
  startTime: number;
  startX: number;
  endTime: number;
  endX: number;
  width: number;

  @HostBinding('style.width') hostWidth;
  @Input('sideNav') set sideNav(sideNav: MatSidenav) {
    this.sidebar = sideNav;
  }

  @Output() setWidth: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngAfterViewInit() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      this.setWidth.emit(80);
     // this.startOnTouch();
    this.startTouchMove();
      this.touchEnd();
    }
  }
  // startOnTouch() {
  //   fromEvent(document, 'touchstart')
  //     .pipe(
  //       tap((e: TouchEvent) =>
  //         e.touches[0].clientX <= 20 && e.touches[0].clientY >= 65
  //           ? (this.sidebar.open(),
  //             (this.startTime = new Date().getTime()),
  //             (this.startX = e.touches[0].clientX),
  //             this.setWidth.emit(e.touches[0].clientX))
  //           : ''
  //       )
  //     )
  //     .subscribe();
  // }
  startTouchMove() {
    fromEvent(document, 'touchmove')
      .pipe(debounceTime(0))
      .subscribe((e: TouchEvent) => {
        // this.endTime = new Date().getTime();
        // this.sidebar._getWidth() > 40 ? this.setWidth.emit(80) : '';
        // let w = this.sidebar._getWidth();
        // this.sidebar._getWidth() <= 79 ? this.setWidth.emit(w) : '';
        this.sidebar.toggle();
      });
  }
  touchEnd() {
    fromEvent(document, 'touchend').subscribe(() => {
      this.sidebar._getWidth() < 40 ? this.sidebar.close() : '';
    });
  }
}
