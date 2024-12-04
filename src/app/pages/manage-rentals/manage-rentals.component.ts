import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

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

  processReturn(rental: any) {
    const currentDate = new Date();
    const dueDate = new Date(rental.dueDate);

    const extraDays = Math.max(
      0,
      Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    const finePerDay = rental.finePerDay || 0;
    const fine = extraDays * finePerDay;

    const totalWithFine = rental.totalCost + fine;

    alert(
      `Rental Processed:\n\n` +
      `Customer ID: ${rental.customerId}\n` +
      `Rental Date: ${rental.rentalDate}\n` +
      `Due Date: ${rental.dueDate}\n` +
      `Return Date: ${currentDate.toISOString().split('T')[0]}\n` +
      `Extra Days: ${extraDays}\n` +
      `Fine Per Day: Rs.${finePerDay.toFixed(2)}\n` +
      `Total Fine: Rs.${fine.toFixed(2)}\n` +
      `Total Amount (with Fine): Rs.${totalWithFine.toFixed(2)}`
    );

    const updatePayload = {
      ...rental,
      returnDate: currentDate.toISOString().split('T')[0],
      totalCost: totalWithFine,
    };

    this.http.put(`${this.apiUrl}/${rental.rentalId}`, updatePayload).subscribe(
      () => {
        this.getAllRentals();
      },
      (error) => console.error('Error processing return:', error)
    );
  }


  viewBill(rental: any) {
    const customerApiUrl = `http://localhost:8080/api/customers/${rental.customerId}`;

    this.http.get<any>(customerApiUrl).subscribe(
      (customer) => {
        const rentalBill = {
          ...rental,
          customerName: customer.customerName,
        };
        this.router.navigate(['/rental-bill'], { state: { rentalBill } });
      },
      (error) => {
        console.error('Error fetching customer details:', error);
        alert('Failed to fetch customer details for the rental bill.');
      }
    );
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
