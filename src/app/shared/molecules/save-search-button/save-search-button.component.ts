import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-save-search-button',
  standalone: true,
  imports: [FormsModule, Dialog, InputText],
  templateUrl: './save-search-button.component.html',
  styleUrl: './save-search-button.component.scss',
})
export class SaveSearchButtonComponent {
  save = output<string>();

  $isDialogVisible = signal(false);
  $searchName = signal('');

  onSaveClick(): void {
    this.$isDialogVisible.set(true);
  }

  onSave(): void {
    const name = this.$searchName();
    if (name.trim()) {
      this.save.emit(name);
      this.$searchName.set('');
      this.$isDialogVisible.set(false);
    }
  }

  onCancel(): void {
    this.$searchName.set('');
    this.$isDialogVisible.set(false);
  }
}
