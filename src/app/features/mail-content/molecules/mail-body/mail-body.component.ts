import { Component, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HighlightService } from '../../../../core/services';

@Component({
  selector: 'app-mail-body',
  standalone: true,
  imports: [],
  templateUrl: './mail-body.component.html',
  styleUrl: './mail-body.component.scss',
})
export class MailBodyComponent {
  private _sanitizer = inject(DomSanitizer);
  private _highlightService = inject(HighlightService);

  $content = input.required<string>({ alias: 'content' });
  $mailFilename = input<string>('', { alias: 'mailFilename' });

  $highlightedContent = computed(() => {
    const content = this.$content();
    const mailFilename = this.$mailFilename();
    const highlightData = this._highlightService.getMailHighlight(mailFilename);

    if (!highlightData || highlightData.bodyWords.length === 0) {
      return content;
    }

    return this._highlightService.highlightBodyContent(
      content,
      highlightData.bodyWords
    );
  });

  public get safeContent(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this.$highlightedContent());
  }
}
