import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { HighlightData, MailHighlight } from '../../shared/types/highlight-match.type';

@Injectable({ providedIn: 'root' })
export class HighlightService {
  private _highlights: WritableSignal<Map<string, MailHighlight>> = signal<Map<string, MailHighlight>>(new Map());
  private _searchTerms: WritableSignal<string[]> = signal<string[]>([]);

  $searchTerms: Signal<string[]> = computed<string[]>(() => this._searchTerms());

  public setSearchTerms(terms: string[]): void {
    this._searchTerms.set(terms);
  }

  public setMailHighlight(mailFilename: string, data: HighlightData): void {
    const highlights: Map<string, MailHighlight> = new Map(this._highlights());
    highlights.set(mailFilename, { mailFilename, data });
    this._highlights.set(highlights);
  }

  public clearHighlights(): void {
    this._highlights.set(new Map());
    this._searchTerms.set([]);
  }

  public getMailHighlight(mailFilename: string): HighlightData | undefined {
    return this._highlights().get(mailFilename)?.data;
  }

  public isAttachmentContentHighlighted(mailFilename: string, attachmentName: string): boolean {
    const data: HighlightData | undefined = this.getMailHighlight(mailFilename);
    if (!data) {
      return false;
    }
    return data.attachmentContents.includes(attachmentName);
  }

  public isAttachmentNameHighlighted(mailFilename: string, attachmentName: string): boolean {
    const data: HighlightData | undefined = this.getMailHighlight(mailFilename);
    if (!data) {
      return false;
    }
    return data.attachmentNames.includes(attachmentName);
  }

  public hasAnyAttachmentHighlight(mailFilename: string): boolean {
    const data: HighlightData | undefined = this.getMailHighlight(mailFilename);
    if (!data) {
      return false;
    }
    return data.attachmentContents.length > 0 || data.attachmentNames.length > 0;
  }

  public highlightText(text: string, words: string[]): string {
    if (!text || !words || words.length === 0) {
      return text;
    }

    const escapedWords: string[] = words.map((word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern: RegExp = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
  }

  public highlightBodyContent(html: string, words: string[]): string {
    if (!html || !words || words.length === 0) {
      return html;
    }

    const escapedWords: string[] = words.map((word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern: RegExp = new RegExp(`(${escapedWords.join('|')})`, 'gi');

    const tempDiv: HTMLDivElement = document.createElement('div');
    tempDiv.innerHTML = html;

    this._highlightTextNodes(tempDiv, pattern);

    return tempDiv.innerHTML;
  }

  private _highlightTextNodes(element: Node, pattern: RegExp): void {
    if (element.nodeType === Node.TEXT_NODE) {
      const text: string = element.textContent ?? '';
      if (pattern.test(text)) {
        pattern.lastIndex = 0;
        const span: HTMLSpanElement = document.createElement('span');
        span.innerHTML = text.replace(pattern, '<mark class="search-highlight">$1</mark>');
        element.parentNode?.replaceChild(span, element);
      }
    } else if (element.nodeType === Node.ELEMENT_NODE) {
      const children: Node[] = Array.from(element.childNodes);
      children.forEach((child: Node) => this._highlightTextNodes(child, pattern));
    }
  }
}
