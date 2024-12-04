import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  selector: 'app-manage-items',
  templateUrl: './manage-items.component.html',
  styleUrls: ['./manage-items.component.css'],
})
export class ManageItemsComponent implements OnInit {
  items: any[] = [];
  itemForm: any = {
    itemName: '',
    itemAvailability: '',
    rentalPerDay: 0,
    finePerDay: 0,
  };
  searchQuery: string = '';
  isEdit: boolean = false;
  selectedItemId: string | null = null;

  private apiUrl = 'http://localhost:8080/api/items';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.items = data;
    });
  }

  addItem() {
    this.http.post(this.apiUrl, this.itemForm).subscribe(() => {
      this.getAllItems();
      this.resetForm();
    });
  }

  updateItem() {
    if (this.selectedItemId) {
      this.http
        .put(`${this.apiUrl}/${this.selectedItemId}`, this.itemForm)
        .subscribe(() => {
          this.getAllItems();
          this.resetForm();
        });
    }
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.getAllItems();
      });
    }
  }

  editItem(item: any) {
    this.itemForm = { ...item };
    this.selectedItemId = item.itemId;
    this.isEdit = true;
  }

  searchItems() {
    if (this.searchQuery.trim() === '') {
      this.getAllItems();
    } else {
      this.items = this.items.filter((item) =>
        item.itemName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  resetForm() {
    this.itemForm = {
      itemName: '',
      itemAvailability: '',
      rentalPerDay: 0,
      finePerDay: 0,
    };
    this.selectedItemId = null;
    this.isEdit = false;
  }
}
