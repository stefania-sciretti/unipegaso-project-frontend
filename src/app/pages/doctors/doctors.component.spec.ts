import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {DoctorsComponent} from './doctors.component';
import {DoctorService} from '../../services/doctor.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';

describe('DoctorsComponent', () => {
  let fixture: ComponentFixture<DoctorsComponent>;
  const mockDoctorService = jasmine.createSpyObj('DoctorService', ['getAll']);
  const mockAlertService = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    mockDoctorService.getAll.calls.reset();
    mockDoctorService.getAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [DoctorsComponent],
      providers: [
        { provide: DoctorService, useValue: mockDoctorService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DoctorsComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
  it('should call getAll on init', () => expect(mockDoctorService.getAll).toHaveBeenCalled());
});
