import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaryForm } from './salary-form';

describe('SalaryForm', () => {
  let component: SalaryForm;
  let fixture: ComponentFixture<SalaryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
