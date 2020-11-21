import { Component } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AAVE Calculator';
  showAbout: boolean = false;
  aboutIcon = faQuestionCircle;

  rotate = false;

  toggleAbout() {
    this.showAbout = !this.showAbout;
  }

  onAboutMouseEnter() {
    this.rotate = true;
  }

  onAboutMouseLeave() {
    this.rotate = false;
  }
}
