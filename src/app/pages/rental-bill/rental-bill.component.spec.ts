import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalBillComponent } from './rental-bill.component';

describe('RentalBillComponent', () => {
  let component: RentalBillComponent;
  let fixture: ComponentFixture<RentalBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
