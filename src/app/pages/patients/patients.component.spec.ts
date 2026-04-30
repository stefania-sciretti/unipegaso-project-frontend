import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {PatientsComponent} from './patients.component';
import {PatientService} from '../../services/patient.service';
import {AlertService} from '../../services/alert.service';

describe('PatientsComponent', () => {
  let component: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;

  const mockPatientService = jasmine.createSpyObj('PatientService', ['getAll', 'create', 'update', 'delete', 'search']);
  const mockAlertService   = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockPatientService.getAll.calls.reset();

    mockPatientService.getAll.and.returnValue(of([]));
    mockPatientService.create.and.returnValue(of({}));
    mockPatientService.update.and.returnValue(of({}));
    mockPatientService.delete.and.returnValue(of({}));
    mockPatientService.search.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PatientsComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: AlertService,   useValue: mockAlertService }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should call getAll on init', () => expect(mockPatientService.getAll).toHaveBeenCalled());
});
