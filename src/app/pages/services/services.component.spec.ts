import {TestBed} from '@angular/core/testing';
import {ServicesComponent} from './services.component';

describe('ServicesComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [ServicesComponent] }));
  it('should create', () => expect(TestBed.createComponent(ServicesComponent).componentInstance).toBeTruthy());
});
