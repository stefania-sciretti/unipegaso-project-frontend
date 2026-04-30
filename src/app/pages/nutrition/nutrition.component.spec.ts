import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {NutritionComponent} from './nutrition.component';
import {DietPlanService} from '../../services/diet-plan.service';
import {ClientService} from '../../services/client.service';
import {StaffService} from '../../services/trainer.service';
import {AlertService} from '../../services/alert.service';

describe('NutritionComponent', () => {
  let fixture: ComponentFixture<NutritionComponent>;
  const mockDietPlanService = jasmine.createSpyObj('DietPlanService', ['getAll']);
  const mockClientService = jasmine.createSpyObj('ClientService', ['getAll']);
  const mockStaffService = jasmine.createSpyObj('StaffService', ['getAll']);
  const mockAlertService = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockDietPlanService.getAll.calls.reset();
    mockDietPlanService.getAll.and.returnValue(of([]));
    mockClientService.getAll.calls.reset();
    mockClientService.getAll.and.returnValue(of([]));
    mockStaffService.getAll.calls.reset();
    mockStaffService.getAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [NutritionComponent],
      providers: [
        { provide: DietPlanService, useValue: mockDietPlanService },
        { provide: ClientService, useValue: mockClientService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NutritionComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
  it('should call getAll on init', () => expect(mockDietPlanService.getAll).toHaveBeenCalled());
});
