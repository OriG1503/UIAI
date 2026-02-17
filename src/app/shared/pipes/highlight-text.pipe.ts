import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightText',
  standalone: true,
})
export class HighlightTextPipe implements PipeTransform {
  private _sanitizer: DomSanitizer = inject(DomSanitizer);

  public transform(text: string, words: string[]): SafeHtml {
    if (!text || !words || words.length === 0) {
      return text;
    }

    const escapedWords: string[] = words.map((word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern: RegExp = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    const highlighted: string = text.replace(pattern, '<mark class="search-highlight">$1</mark>');

    return this._sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
