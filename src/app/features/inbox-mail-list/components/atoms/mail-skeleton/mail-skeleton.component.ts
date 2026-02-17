import { Component, input } from '@angular/core';
import { SKELETON_COUNT } from '../../../constants/mail-skeleton.constants';

@Component({
  selector: 'app-mail-skeleton',
  standalone: true,
  templateUrl: './mail-skeleton.component.html',
  styleUrl: './mail-skeleton.component.scss'
})
export class MailSkeletonComponent {
  $count = input<number>(SKELETON_COUNT, { alias: 'count' });

  get items(): number[] {
    return Array.from({ length: this.$count() }, (_, i) => i);
  }
}
