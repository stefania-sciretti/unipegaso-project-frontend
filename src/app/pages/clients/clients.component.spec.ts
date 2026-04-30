import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {ClientsComponent} from './clients.component';
import {ClientService} from '../../services/client.service';
import {AlertService} from '../../services/alert.service';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  const mockClientService = jasmine.createSpyObj('ClientService', ['getAll', 'create', 'update', 'delete']);
  const mockAlertService  = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockClientService.getAll.calls.reset();

    mockClientService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        { provide: ClientService,  useValue: mockClientService },
        { provide: AlertService,   useValue: mockAlertService }
      ]
    }).compileComponents();

    fixture   = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should call getAll on init', () => expect(mockClientService.getAll).toHaveBeenCalled());
  it('clients array starts empty', () => expect(component.clients).toEqual([]));
});
