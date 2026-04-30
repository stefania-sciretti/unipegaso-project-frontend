import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {TrainingComponent} from './training.component';
import {TrainingPlanService} from '../../services/training-plan.service';
import {ClientService} from '../../services/client.service';
import {StaffService} from '../../services/trainer.service';
import {AlertService} from '../../services/alert.service';

describe('TrainingComponent', () => {
  let fixture: ComponentFixture<TrainingComponent>;
  const mockTrainingService = jasmine.createSpyObj('TrainingPlanService', ['getAll']);
  const mockClientService = jasmine.createSpyObj('ClientService', ['getAll']);
  const mockStaffService = jasmine.createSpyObj('StaffService', ['getAll']);
  const mockAlertService = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockTrainingService.getAll.calls.reset();
    mockTrainingService.getAll.and.returnValue(of([]));
    mockClientService.getAll.calls.reset();
    mockClientService.getAll.and.returnValue(of([]));
    mockStaffService.getAll.calls.reset();
    mockStaffService.getAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [TrainingComponent],
      providers: [
        { provide: TrainingPlanService, useValue: mockTrainingService },
        { provide: ClientService, useValue: mockClientService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TrainingComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
  it('should call getAll on init', () => expect(mockTrainingService.getAll).toHaveBeenCalled());
});
