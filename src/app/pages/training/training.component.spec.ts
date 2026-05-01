import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {TrainingComponent} from './training.component';
import {TrainingPlanService} from '../../services/training-plan.service';
import {PatientService} from '../../services/patient.service';
import {SpecialistService} from '../../services/specialist.service';
import {AlertService} from '../../services/alert.service';

describe('TrainingComponent', () => {
  let fixture: ComponentFixture<TrainingComponent>;
  const mockTrainingService   = jasmine.createSpyObj('TrainingPlanService', ['getAll']);
  const mockPatientService    = jasmine.createSpyObj('PatientService', ['getAll']);
  const mockSpecialistService = jasmine.createSpyObj('SpecialistService', ['getAll']);
  const mockAlertService = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockTrainingService.getAll.calls.reset();
    mockTrainingService.getAll.and.returnValue(of([]));
    mockPatientService.getAll.calls.reset();
    mockPatientService.getAll.and.returnValue(of([]));
    mockSpecialistService.getAll.calls.reset();
    mockSpecialistService.getAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [TrainingComponent],
      providers: [
        { provide: TrainingPlanService, useValue: mockTrainingService },
        { provide: PatientService,    useValue: mockPatientService },
        { provide: SpecialistService, useValue: mockSpecialistService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TrainingComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
  it('should call getAll on init', () => expect(mockTrainingService.getAll).toHaveBeenCalled());
});
