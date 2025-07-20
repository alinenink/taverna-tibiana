import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-grimorio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grimorio.component.html',
  styleUrls: ['./grimorio.component.scss']
})
export class GrimorioComponent {

  constructor(private router: Router) {}

  navigateToWeapons(): void {
    this.router.navigate(['/weapons']);
  }
}
