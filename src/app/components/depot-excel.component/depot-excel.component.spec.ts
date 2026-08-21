import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotExcelComponent } from './depot-excel.component';

describe('DepotExcel', () => {
  let component: DepotExcelComponent;
  let fixture: ComponentFixture<DepotExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotExcelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepotExcelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
