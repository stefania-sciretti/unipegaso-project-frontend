import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {GlycemiaComponent} from './glycemia.component';
import {GlycemiaService} from '../../services/glycemia.service';
import {ClientService} from '../../services/client.service';
import {StaffService} from '../../services/trainer.service';
import {AlertService} from '../../services/alert.service';

describe('GlycemiaComponent', () => {
  let component: GlycemiaComponent;
  let fixture: ComponentFixture<GlycemiaComponent>;

  const mockGlycemiaService = jasmine.createSpyObj('GlycemiaService', ['getAll', 'create', 'update', 'delete']);
  const mockClientService   = jasmine.createSpyObj('ClientService', ['getAll']);
  const mockStaffService    = jasmine.createSpyObj('StaffService', ['getAll']);
  const mockAlertService    = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockGlycemiaService.getAll.calls.reset();
    mockGlycemiaService.create.calls.reset();
    mockGlycemiaService.update.calls.reset();
    mockGlycemiaService.delete.calls.reset();
    mockClientService.getAll.calls.reset();
    mockStaffService.getAll.calls.reset();
    mockGlycemiaService.getAll.and.returnValue(of([]));
    mockClientService.getAll.and.returnValue(of([]));
    mockStaffService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [GlycemiaComponent],
      providers: [
        { provide: GlycemiaService, useValue: mockGlycemiaService },
        { provide: ClientService,   useValue: mockClientService },
        { provide: StaffService,    useValue: mockStaffService },
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
