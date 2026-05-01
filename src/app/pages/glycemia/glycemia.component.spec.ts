import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {GlycemiaComponent} from './glycemia.component';
import {GlycemiaService} from '../../services/glycemia.service';
import {PatientService} from '../../services/patient.service';
import {SpecialistService} from '../../services/specialist.service';
import {AlertService} from '../../services/alert.service';

describe('GlycemiaComponent', () => {
  let component: GlycemiaComponent;
  let fixture: ComponentFixture<GlycemiaComponent>;

  const mockGlycemiaService   = jasmine.createSpyObj('GlycemiaService', ['getAll', 'create', 'update', 'delete']);
  const mockPatientService    = jasmine.createSpyObj('PatientService', ['getAll']);
  const mockSpecialistService = jasmine.createSpyObj('SpecialistService', ['getAll']);
  const mockAlertService    = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockGlycemiaService.getAll.calls.reset();
    mockGlycemiaService.create.calls.reset();
    mockGlycemiaService.update.calls.reset();
    mockGlycemiaService.delete.calls.reset();
    mockPatientService.getAll.calls.reset();
    mockSpecialistService.getAll.calls.reset();
    mockGlycemiaService.getAll.and.returnValue(of([]));
    mockPatientService.getAll.and.returnValue(of([]));
    mockSpecialistService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [GlycemiaComponent],
      providers: [
        { provide: GlycemiaService,   useValue: mockGlycemiaService },
        { provide: PatientService,    useValue: mockPatientService },
        { provide: SpecialistService, useValue: mockSpecialistService },
        { provide: AlertService,    useValue: mockAlertService }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(GlycemiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should call getAll on init', () => expect(mockGlycemiaService.getAll).toHaveBeenCalled());
});
