import {TestBed} from '@angular/core/testing';
import {FaqComponent} from './faq.component';

describe('FaqComponent', () => {
  beforeEach(() => {
    spyOn(window, 'scrollTo');
    TestBed.configureTestingModule({ imports: [FaqComponent] });
  });
  it('should create', () => expect(TestBed.createComponent(FaqComponent).componentInstance).toBeTruthy());
});
