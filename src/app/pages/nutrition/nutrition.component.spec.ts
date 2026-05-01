import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {NutritionComponent} from './nutrition.component';
import {DietPlanService} from '../../services/diet-plan.service';
import {PatientService} from '../../services/patient.service';
import {SpecialistService} from '../../services/specialist.service';
import {AlertService} from '../../services/alert.service';

describe('NutritionComponent', () => {
  let fixture: ComponentFixture<NutritionComponent>;
  const mockDietPlanService   = jasmine.createSpyObj('DietPlanService', ['getAll']);
  const mockPatientService    = jasmine.createSpyObj('PatientService', ['getAll']);
  const mockSpecialistService = jasmine.createSpyObj('SpecialistService', ['getAll']);
  const mockAlertService = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockDietPlanService.getAll.calls.reset();
    mockDietPlanService.getAll.and.returnValue(of([]));
    mockPatientService.getAll.calls.reset();
    mockPatientService.getAll.and.returnValue(of([]));
    mockSpecialistService.getAll.calls.reset();
    mockSpecialistService.getAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [NutritionComponent],
      providers: [
        { provide: DietPlanService,   useValue: mockDietPlanService },
        { provide: PatientService,    useValue: mockPatientService },
        { provide: SpecialistService, useValue: mockSpecialistService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(NutritionComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
  it('should call getAll on init', () => expect(mockDietPlanService.getAll).toHaveBeenCalled());
});
