import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDashboardComponent } from './bulk-dashboard';

describe('BulkDashboard', () => {
  let component: BulkDashboardComponent;
  let fixture: ComponentFixture<BulkDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
