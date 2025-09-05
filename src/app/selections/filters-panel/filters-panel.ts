import { Component, effect, inject, input, model } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FieldFilterEnum } from '../models/field-filter-enum';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FiltersInterface } from '../models/filters-interface';
import { NotificationsService, NotificationType } from '../../services/notifications-service';

// Cross validator
function selectedFieldValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedField = control.get('selectedField')?.value;
    const valueField = control.get('valueField')?.value;

    if (valueField !== '' && selectedField === FieldFilterEnum.nessuno) {
      return { invalidSelection: true };
    }

    return null;
  };
}

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
  private readonly formBuilder = inject(FormBuilder);
  private readonly notificationsService = inject(NotificationsService);

  filters = model.required<FiltersInterface>();
  filtersResetted = input.required<FiltersInterface>();

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
    this.filterForm = this.formBuilder.group(
      {
        selectedField: [this.filters().selectedField],
        valueField: [this.filters().valueField],
      },
      {
        validators: selectedFieldValidator(),
      }
    );
  }

  private updateForm(filters: FiltersInterface) {
    this.filterForm.reset(filters);
  }

  onSubmit() {
    if (this.filterForm.invalid) {
      this.notificationsService.notify(
        'Errore: hai inserito un testo di ricerca senza selezionare un campo di ricerca',
        NotificationType.Error
      );
      return;
    }

    // Validation are already made, so we can use the "as" operator
    this.filters.set(this.filterForm.value as FiltersInterface);
  }

  onReset() {
    // Update the filters selected
    this.filters.set(this.filtersResetted());

    // Update the form
    this.filterForm.patchValue(this.filtersResetted());
  }
}
