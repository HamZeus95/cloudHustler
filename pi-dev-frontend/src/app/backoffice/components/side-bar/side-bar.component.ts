import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private subscription: Subscription;

  constructor(
    private router: Router, 
    private sidebarService: SidebarService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    // Subscribe to sidebar toggle events
    this.subscription.add(
      this.sidebarService.toggle$.subscribe(() => {
        this.toggleSidebar();
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    // For mobile views, we'll also add a class to the body to help with styling
    document.body.classList.toggle('g-sidenav-pinned', this.isSidebarOpen);
    document.body.classList.toggle('g-sidenav-hidden', !this.isSidebarOpen);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
