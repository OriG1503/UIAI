import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_SM, ICON_SIZE_MD } from '../../../../../shared/consts/icon-size.consts';
import { Encoding } from '../../../types/encoding.type';
import { ENCODING_LABEL_MAP, HIGHLIGHT_NAV_LABEL_MAP, MAIL_CONTENT_TOOLBAR_LABEL_MAP } from '../../../mapping/mail-content.label-map';

@Component({
  selector: 'app-mail-content-toolbar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-content-toolbar.component.html',
  styleUrl: './mail-content-toolbar.component.scss',
})
export class MailContentToolbarComponent {
  private _elementRef: ElementRef = inject(ElementRef);

  public $selectedEncoding: InputSignal<Encoding> = input<Encoding>('none', { alias: 'selectedEncoding' });
  public $currentHighlightIndex: InputSignal<number> = input<number>(0, { alias: 'currentHighlightIndex' });
  public $totalHighlights: InputSignal<number> = input<number>(0, { alias: 'totalHighlights' });

  public encodingChange: OutputEmitterRef<Encoding> = output<Encoding>();
  public downloadClick: OutputEmitterRef<void> = output<void>();
  public extraInfoClick: OutputEmitterRef<void> = output<void>();
  public previousClick: OutputEmitterRef<void> = output<void>();
  public nextClick: OutputEmitterRef<void> = output<void>();

  public $isEncodingPopupOpen: WritableSignal<boolean> = signal<boolean>(false);

  public $hasPrevious: Signal<boolean> = computed<boolean>(() => this.$totalHighlights() > 0);
  public $hasNext: Signal<boolean> = computed<boolean>(() => this.$totalHighlights() > 0);

  public $nextIconColor: Signal<string> = computed<string>(() =>
    this.$hasNext() ? 'var(--color-dark-navy)' : 'var(--color-light-gray)',
  );

  public $prevIconColor: Signal<string> = computed<string>(() =>
    this.$hasPrevious() ? 'var(--color-dark-navy)' : 'var(--color-light-gray)',
  );

  public $encodingIconColor: Signal<string> = computed<string>(() => {
    if (this.$isEncodingPopupOpen()) {
      return 'var(--color-white)';
    }
    if (this.$selectedEncoding() !== 'none') {
      return 'var(--color-blue)';
    }
    return 'var(--color-dark-navy)';
  });

  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_SM = ICON_SIZE_SM;
  public readonly ICON_SIZE_MD = ICON_SIZE_MD;
  public readonly encodings: Encoding[] = ['none', 'utf-8', 'iso-8859-1', 'windows-1255'];
  public readonly encodingLabels: Record<Encoding, string> = ENCODING_LABEL_MAP;
  public readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;
  public readonly highlightLabels: typeof HIGHLIGHT_NAV_LABEL_MAP = HIGHLIGHT_NAV_LABEL_MAP;
  public readonly toolbarTranslations: typeof MAIL_CONTENT_TOOLBAR_LABEL_MAP = MAIL_CONTENT_TOOLBAR_LABEL_MAP;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const encodingWrapper: HTMLElement | null = this._elementRef.nativeElement.querySelector('.encoding-wrapper');
    if (encodingWrapper && !encodingWrapper.contains(event.target as HTMLElement)) {
      this.$isEncodingPopupOpen.set(false);
    }
  }

  public onEncodingClick(): void {
    this.$isEncodingPopupOpen.update((value: boolean) => !value);
  }

  public onEncodingSelect(encoding: Encoding): void {
    this.$isEncodingPopupOpen.set(false);
    this.encodingChange.emit(encoding);
  }

  public onDownloadClick(): void {
    this.downloadClick.emit();
  }

  public onExtraInfoClick(): void {
    this.extraInfoClick.emit();
  }

  public onPreviousClick(): void {
    this.previousClick.emit();
  }

  public onNextClick(): void {
    this.nextClick.emit();
  }
}
