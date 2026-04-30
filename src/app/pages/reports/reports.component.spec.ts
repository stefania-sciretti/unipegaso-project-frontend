import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {ReportsComponent} from './reports.component';
import {ReportService} from '../../services/report.service';
import {ClinicalAppointmentService} from '../../services/clinical-appointment.service';
import {AlertService} from '../../services/alert.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  const mockReportService  = jasmine.createSpyObj('ReportService', ['getAll', 'create', 'update']);
  const mockApptService    = jasmine.createSpyObj('ClinicalAppointmentService', ['getAll']);
  const mockAlertService   = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockReportService.getAll.calls.reset();
    mockApptService.getAll.calls.reset();
    mockReportService.getAll.and.returnValue(of([]));
    mockApptService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [
        { provide: ReportService,              useValue: mockReportService },
        { provide: ClinicalAppointmentService, useValue: mockApptService },
        { provide: AlertService,               useValue: mockAlertService }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should call getAll on init', () => expect(mockReportService.getAll).toHaveBeenCalled());
});
