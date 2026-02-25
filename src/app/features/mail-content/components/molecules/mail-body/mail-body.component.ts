import { Component, input, computed, inject, InputSignal, Signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { HighlightData } from '../../../../../shared/types/highlight-match.type';

@Component({
  selector: 'app-mail-body',
  standalone: true,
  imports: [],
  templateUrl: './mail-body.component.html',
  styleUrl: './mail-body.component.scss',
})
export class MailBodyComponent {
  private _sanitizer: DomSanitizer = inject(DomSanitizer);
  private _highlightService: HighlightService = inject(HighlightService);

  public $content: InputSignal<string> = input.required<string>({ alias: 'content' });
  public $mailFilename: InputSignal<string> = input<string>('', { alias: 'mailFilename' });

  private _$highlightedContent: Signal<string> = computed<string>(() => {
    const content: string = this.$content();
    const mailFilename: string = this.$mailFilename();
    const highlightData: HighlightData | undefined = this._highlightService.getMailHighlight(mailFilename);

    if (!highlightData || highlightData.bodyWords.length === 0) {
      return content;
    }

    return this._highlightService.highlightBodyContent(content, highlightData.bodyWords);
  });

  public $safeContent: Signal<SafeHtml> = computed<SafeHtml>(() =>
    this._sanitizer.bypassSecurityTrustHtml(this._$highlightedContent()),
  );
}
