import { Component, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mail-body',
  standalone: true,
  imports: [],
  templateUrl: './mail-body.component.html',
  styleUrl: './mail-body.component.scss',
})
export class MailBodyComponent {
  $content = input.required<string>({ alias: 'content' });

  constructor(private _sanitizer: DomSanitizer) {}

  get safeContent(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this.$content());
  }
}
