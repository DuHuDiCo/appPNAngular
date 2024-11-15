import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'pn-frontend';

  constructor(private router: Router) {}

  ngOnInit(): void {
    initFlowbite();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
  }
}
