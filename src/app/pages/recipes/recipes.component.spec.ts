import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {RecipesComponent} from './recipes.component';
import {RecipeService} from '../../services/recipe.service';
import {AlertService} from '../../services/alert.service';

describe('RecipesComponent', () => {
  let fixture: ComponentFixture<RecipesComponent>;
  const mockRecipeService = jasmine.createSpyObj('RecipeService', ['getAll']);
  const mockAlertService = jasmine.createSpyObj('AlertService', ['show'], { alert: () => null });

  beforeEach(async () => {
    mockRecipeService.getAll.calls.reset();
    mockRecipeService.getAll.and.returnValue(of([]));
    await TestBed.configureTestingModule({
      imports: [RecipesComponent],
      providers: [
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RecipesComponent);
    fixture.detectChanges();
  });

  it('should create', () => expect(fixture.componentInstance).toBeTruthy());
  it('should call getAll on init', () => expect(mockRecipeService.getAll).toHaveBeenCalled());
});
