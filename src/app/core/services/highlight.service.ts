import { Injectable, signal, computed } from '@angular/core';
import { HighlightData, MailHighlight } from '../../shared/types';

@Injectable({ providedIn: 'root' })
export class HighlightService {
  private _highlights = signal<Map<string, MailHighlight>>(new Map());
  private _searchTerms = signal<string[]>([]);

  $searchTerms = computed(() => this._searchTerms());

  setSearchTerms(terms: string[]): void {
    this._searchTerms.set(terms);
  }

  setMailHighlight(mailFilename: string, data: HighlightData): void {
    const highlights = new Map(this._highlights());
    highlights.set(mailFilename, { mailFilename, data });
    this._highlights.set(highlights);
  }

  clearHighlights(): void {
    this._highlights.set(new Map());
    this._searchTerms.set([]);
  }

  getMailHighlight(mailFilename: string): HighlightData | undefined {
    return this._highlights().get(mailFilename)?.data;
  }

  isAttachmentContentHighlighted(
    mailFilename: string,
    attachmentName: string
  ): boolean {
    const data = this.getMailHighlight(mailFilename);
    if (!data) return false;
    return data.attachmentContents.includes(attachmentName);
  }

  isAttachmentNameHighlighted(
    mailFilename: string,
    attachmentName: string
  ): boolean {
    const data = this.getMailHighlight(mailFilename);
    if (!data) return false;
    return data.attachmentNames.includes(attachmentName);
  }

  hasAnyAttachmentHighlight(mailFilename: string): boolean {
    const data = this.getMailHighlight(mailFilename);
    if (!data) return false;
    return (
      data.attachmentContents.length > 0 || data.attachmentNames.length > 0
    );
  }

  highlightText(text: string, words: string[]): string {
    if (!text || !words || words.length === 0) {
      return text;
    }

    const escapedWords = words.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const pattern = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
  }

  highlightBodyContent(html: string, words: string[]): string {
    if (!html || !words || words.length === 0) {
      return html;
    }

    const escapedWords = words.map((word) =>
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const pattern = new RegExp(`(${escapedWords.join('|')})`, 'gi');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    this._highlightTextNodes(tempDiv, pattern);

    return tempDiv.innerHTML;
  }

  private _highlightTextNodes(element: Node, pattern: RegExp): void {
    if (element.nodeType === Node.TEXT_NODE) {
      const text = element.textContent ?? '';
      if (pattern.test(text)) {
        pattern.lastIndex = 0;
        const span = document.createElement('span');
        span.innerHTML = text.replace(
          pattern,
          '<mark class="search-highlight">$1</mark>'
        );
        element.parentNode?.replaceChild(span, element);
      }
    } else if (element.nodeType === Node.ELEMENT_NODE) {
      const children = Array.from(element.childNodes);
      children.forEach((child) => this._highlightTextNodes(child, pattern));
    }
  }
}
