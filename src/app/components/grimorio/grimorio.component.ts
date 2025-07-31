import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-grimorio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grimorio.component.html',
  styleUrl: './grimorio.component.scss',
})
export class GrimorioComponent implements OnInit {
  constructor(
    private router: Router,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.scrollService.scrollToTop();
  }

  navigateToWeapons(): void {
    this.router.navigate(['/weapons']);
  }

  navigateToProficiency() {
    this.router.navigate(['/proficiency-tables']);
  }

  navigateToBestiary(): void {
    this.router.navigate(['/bestiary']);
  }
}
