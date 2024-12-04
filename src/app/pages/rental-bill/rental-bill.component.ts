import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-rental-bill',
  templateUrl: './rental-bill.component.html',
  styleUrls: ['./rental-bill.component.css'],
})
export class RentalBillComponent implements OnInit {
  rentalBill: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.rentalBill = history.state.rentalBill;

    if (!this.rentalBill) {
      alert('No rental bill data available!');
      window.history.back();
    }
  }
}
