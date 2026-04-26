import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { AlertService } from '../../services/alert.service';
import { Recipe, RecipeRequest } from '../../models/models';

@Component({
  selector: 'app-recipes',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './recipes.component.html'
})
export class RecipesComponent {
  private readonly svc        = inject(RecipeService);
  private readonly alertSvc   = inject(AlertService);
  private readonly fb         = inject(FormBuilder);

  protected readonly alertSignal = this.alertSvc.alert;

  recipes: Recipe[] = [];
  loading        = false;
  filterCategory = '';
  searchText     = '';
  showModal      = false;
  showDetail     = false;
  editingId: number | null = null;
  selected: Recipe | null  = null;

  readonly categories = ['Pre-Workout', 'Post-Workout', 'Colazione', 'Pranzo Fit', 'Cena Fit', 'Snack', 'Smoothie'];

  readonly form: FormGroup = this.fb.group({
    title:        ['', Validators.required],
    description:  [''],
    ingredients:  [''],
    instructions: [''],
    calories:     [null],
    category:     ['']
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAll(this.filterCategory, this.searchText).subscribe({
      next: (d) => { this.recipes = d; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
  }

  onSearch(e: Event): void   { this.searchText = (e.target as HTMLInputElement).value;  this.load(); }
  onCategory(e: Event): void { this.filterCategory = (e.target as HTMLSelectElement).value; this.load(); }

  openDetail(r: Recipe): void { this.selected = r; this.showDetail = true; }
  openCreate(): void          { this.editingId = null; this.form.reset(); this.showModal = true; }
  openEdit(r: Recipe): void {
    this.editingId = r.id;
    this.form.patchValue({
      title: r.title, description: r.description ?? '', ingredients: r.ingredients ?? '',
      instructions: r.instructions ?? '', calories: r.calories, category: r.category ?? ''
    });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const body: RecipeRequest = {
      title: v.title, description: v.description || null, ingredients: v.ingredients || null,
      instructions: v.instructions || null, calories: v.calories || null, category: v.category || null
    };
    const obs = this.editingId ? this.svc.update(this.editingId, body) : this.svc.create(body);
    obs.subscribe({
      next: () => {
        this.alertSvc.show(this.editingId ? 'Ricetta aggiornata!' : 'Ricetta creata!');
        this.showModal = false;
        this.load();
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Eliminare questa ricetta?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.alertSvc.show('Ricetta eliminata.'); this.load(); }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
