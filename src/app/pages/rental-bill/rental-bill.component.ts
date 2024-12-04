import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-rental-bill',
  templateUrl: './rental-bill.component.html',
  styleUrls: ['./rental-bill.component.css'],
})
export class RentalBillComponent implements OnInit {
  rental: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.rental = history.state.rental;

    if (!this.rental) {
      alert('No rental data available!');
      window.history.back();
    }
  }
}
