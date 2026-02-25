import { Component, input, InputSignal } from '@angular/core';
import { SKELETON_COUNT } from '../../../consts/mail-skeleton.consts';

@Component({
  selector: 'app-mail-skeleton',
  standalone: true,
  templateUrl: './mail-skeleton.component.html',
  styleUrl: './mail-skeleton.component.scss',
})
export class MailSkeletonComponent {
  public $count: InputSignal<number> = input<number>(SKELETON_COUNT, { alias: 'count' });

  public get items(): number[] {
    return Array.from({ length: this.$count() }, (_: undefined, i: number) => i);
  }
}
