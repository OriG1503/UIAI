import { Component, input, InputSignal } from '@angular/core';
import { SKELETON_COUNT } from '../../../consts/mail-skeleton.consts';

@Component({
  selector: 'app-mail-skeleton',
  standalone: true,
  templateUrl: './mail-skeleton.component.html',
  styleUrl: './mail-skeleton.component.scss',
})
export class MailSkeletonComponent {
  $count: InputSignal<number> = input<number>(SKELETON_COUNT, { alias: 'count' });

  get items(): number[] {
    return Array.from({ length: this.$count() }, (_: unknown, i: number) => i);
  }
}
