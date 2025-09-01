import { Component, effect, inject, model } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FieldFilterEnum } from '../models/field-filter-enum';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Validators } from '@angular/forms';
import { FiltersInterface } from '../models/filters-interface';

@Component({
  selector: 'app-filters-panel',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './filters-panel.html',
  styleUrl: './filters-panel.css',
})
export class FiltersPanel {
  private formBuilder = inject(FormBuilder);

  filters = model.required<FiltersInterface>();

  // Used only to have the enum in the template
  FieldFilterEnum = FieldFilterEnum;

  // We use the "!" operator to tell TypeScript that this variable will be initialized later
  filterForm!: FormGroup;

  constructor() {
    // Update the form when the filters change
    effect(() => {
      const filters = this.filters();
      if (this.filterForm) {
        this.updateForm(filters);
      }
    });
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      selectedField: [this.filters().selectedField, Validators.required],
      valueField: [this.filters().valueField],
    });
  }

  private updateForm(filters: FiltersInterface) {
    this.filterForm.reset(filters);
  }

  onSubmit() {
    if (this.filterForm.invalid) return;

    // Validation are already made, so we can use the "as" operator
    this.filters.set(this.filterForm.value as FiltersInterface);
  }

  onReset() {
    this.filterForm.reset();

    // Required, otherwise the form appears invalid
    this.filterForm.clearValidators();
  }
}
