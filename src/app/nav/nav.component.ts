import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Output() onAboutClick: EventEmitter<void> = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleAbout() {
    this.onAboutClick.emit();
  }

  getActiveClass(url: string) {
    return this.router.url == url? 'active': '';
  }
}
