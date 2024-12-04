import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  selector: 'app-manage-rentals',
  templateUrl: './manage-rentals.component.html',
  styleUrls: ['./manage-rentals.component.css'],
})
export class ManageRentalsComponent implements OnInit {
  rentals: any[] = [];
  rentalForm: any = {
    customerId: '',
    rentalDate: '',
    returnDate: '',
    dueDate: '',
    totalCost: 0,
    fine: 0,
  };
  searchQuery: string = '';
  isEdit: boolean = false;
  selectedRentalId: string | null = null;

  private apiUrl = 'http://localhost:8080/api/rentals';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllRentals();
  }

  getAllRentals() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.rentals = data.map((rental) => ({
        rentalId: rental.rentalId,
        customerId: rental.customerId,
        rentalDate: rental.rentalDate,
        returnDate: rental.returnDate,
        dueDate: rental.dueDate,
        totalCost: rental.totalCost,
        fine: rental.fine,
      }));
    });
  }

  addRental() {
    this.http.post(this.apiUrl, this.rentalForm).subscribe(() => {
      this.getAllRentals();
      this.resetForm();
    });
  }

  updateRental() {
    if (this.selectedRentalId) {
      this.http
        .put(`${this.apiUrl}/${this.selectedRentalId}`, this.rentalForm)
        .subscribe(() => {
          this.getAllRentals();
          this.resetForm();
        });
    }
  }

  deleteRental(id: string) {
    if (confirm('Are you sure you want to delete this rental?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.getAllRentals();
      });
    }
  }

  editRental(rental: any) {
    this.rentalForm = {
      ...rental,
      rentalDate: new Date(rental.rentalDate).toISOString().split('T')[0],
      returnDate: new Date(rental.returnDate).toISOString().split('T')[0],
      dueDate: new Date(rental.dueDate).toISOString().split('T')[0],
    };
    this.selectedRentalId = rental.rentalId;
    this.isEdit = true;
  }

  searchRentals() {
    if (this.searchQuery.trim() === '') {
      this.getAllRentals();
    } else {
      this.rentals = this.rentals.filter((rental) =>
        rental.rentalId.toString().includes(this.searchQuery)
      );
    }
  }

  resetForm() {
    this.rentalForm = {
      customerId: '',
      rentalDate: '',
      returnDate: '',
      dueDate: '',
      totalCost: 0,
      fine: 0,
    };
    this.selectedRentalId = null;
    this.isEdit = false;
  }
}
