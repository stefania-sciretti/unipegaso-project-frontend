import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RecipeService} from '../../services/recipe.service';
import {Recipe, RecipeRequest} from '../../models/models';

@Component({
    selector: 'app-recipes',
    imports: [ReactiveFormsModule],
    templateUrl: './recipes.component.html'
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  loading = false;
  alertMsg  = '';
  alertType = 'success';
  filterCategory = '';
  searchText     = '';
  showModal      = false;
  showDetail     = false;
  editingId: number | null = null;
  selected: Recipe | null = null;
  form!: FormGroup;

  readonly categories = ['Pre-Workout', 'Post-Workout', 'Colazione', 'Pranzo Fit', 'Cena Fit', 'Snack', 'Smoothie'];

  constructor(private svc: RecipeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  buildForm(): void {
    this.form = this.fb.group({
      title:        ['', Validators.required],
      description:  [''],
      ingredients:  [''],
      instructions: [''],
      calories:     [null],
      category:     ['']
    });
  }

  load(): void {
    this.loading = true;
    this.svc.getAll(this.filterCategory, this.searchText).subscribe({
      next: (d) => { this.recipes = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch(e: Event): void { this.searchText = (e.target as HTMLInputElement).value; this.load(); }
  onCategory(e: Event): void { this.filterCategory = (e.target as HTMLSelectElement).value; this.load(); }

  openDetail(r: Recipe): void { this.selected = r; this.showDetail = true; }
  openCreate(): void { this.editingId = null; this.form.reset(); this.showModal = true; }
  openEdit(r: Recipe): void {
    this.editingId = r.id;
    this.form.patchValue({ title: r.title, description: r.description ?? '', ingredients: r.ingredients ?? '',
      instructions: r.instructions ?? '', calories: r.calories, category: r.category ?? '' });
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
      next: () => { this.showAlert(this.editingId ? 'Recipe updated!' : 'Recipe created!'); this.showModal = false; this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Save failed', 'error')
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this recipe?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.showAlert('Recipe deleted.'); this.load(); },
      error: (err) => this.showAlert(err.error?.message || 'Delete failed', 'error')
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field); return !!(c && c.invalid && c.touched);
  }

  showAlert(msg: string, type = 'success'): void {
    this.alertMsg = msg; this.alertType = type;
    setTimeout(() => this.alertMsg = '', 3500);
  }
}
