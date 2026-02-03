import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightText',
  standalone: true,
})
export class HighlightTextPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);

  public transform(text: string, words: string[]): SafeHtml {
    if (!text || !words || words.length === 0) {
      return text;
    }

    const escapedWords = words.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const pattern = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    const highlighted = text.replace(
      pattern,
      '<mark class="search-highlight">$1</mark>'
    );

    return this._sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
