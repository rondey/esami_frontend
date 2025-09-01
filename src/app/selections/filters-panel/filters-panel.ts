import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FieldFilter } from '../models/field-filter';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Validators } from '@angular/forms';

const defaultFilterForm = {
  selectedField: FieldFilter.nessuno,
  value: '',
};
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

  filterForm = this.formBuilder.group({
    selectedField: [defaultFilterForm.selectedField, Validators.required],
    value: [defaultFilterForm.value],
  });

  onSubmit() {
    if (this.filterForm.invalid) return;
    console.log(this.filterForm.value);
  }

  onReset() {
    this.filterForm.reset();

    // Required, otherwise the form appears invalid
    this.filterForm.clearValidators();
    console.log(this.filterForm);
  }
}
