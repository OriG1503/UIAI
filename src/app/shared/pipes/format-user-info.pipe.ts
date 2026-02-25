import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { MailUserInfo } from '../types/mail-user-info.type';

@Injectable({ providedIn: 'root' })
@Pipe({
  name: 'formatUserInfo',
  standalone: true,
})
export class FormatUserInfoPipe implements PipeTransform {
  public transform(value: MailUserInfo | null | undefined): string {
    if (!value) {
      return '';
    }
    if (value.username) {
      return value.username;
    }
    if (value.mail) {
      return value.mail;
    }
    return value.tag ?? '';
  }
}
