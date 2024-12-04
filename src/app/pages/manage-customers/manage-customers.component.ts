import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  selector: 'app-manage-customers',
  templateUrl: './manage-customers.component.html',
  styleUrls: ['./manage-customers.component.css'],
})
export class ManageCustomersComponent implements OnInit {
  customers: any[] = [];
  customerForm: any = {
    customerName: '',
    customerCity: '',
    customerContact: '',
  };
  searchQuery: string = '';
  isEdit: boolean = false;
  selectedCustomerId: string | null = null;

  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.customers = data;
    });
  }

  addCustomer() {
    this.http.post(this.apiUrl, this.customerForm).subscribe(() => {
      this.getAllCustomers();
      this.resetForm();
    });
  }

  updateCustomer() {
    if (this.selectedCustomerId) {
      this.http
        .put(`${this.apiUrl}/${this.selectedCustomerId}`, this.customerForm)
        .subscribe(() => {
          this.getAllCustomers();
          this.resetForm();
        });
    }
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.getAllCustomers();
      });
    }
  }

  editCustomer(customer: any) {
    this.customerForm = { ...customer };
    this.selectedCustomerId = customer.customerId;
    this.isEdit = true;
  }

  searchCustomers() {
    if (this.searchQuery.trim() === '') {
      this.getAllCustomers();
    } else {
      this.customers = this.customers.filter((customer) =>
        customer.customerName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  resetForm() {
    this.customerForm = { customerName: '', customerCity: '', customerContact: '' };
    this.selectedCustomerId = null;
    this.isEdit = false;
  }
}
