import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  computed,
  inject,
  ElementRef,
  ViewChild,
  NgZone,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { DrawerState } from '../../../types/drawer-state.type';
import { GraphSelection } from '../../../types/graph-selection.type';
import { GraphSelectionInfo } from '../../../../inbox-mail-list/types/graph-selection-info.type';
import { GRAPH_LABEL_MAP } from '../../../mapping/graph.label-map';
import { DRAWER_HEIGHT_MIN, DRAWER_HEIGHT_MAX, DRAWER_HEIGHT_DEFAULT } from '../../../consts/graph.consts';
import { MailListComponent } from '../../../../inbox-mail-list/components/organisms/mail-list/mail-list.component';
import { MailContentViewComponent } from '../../../../mail-content/components/organisms/mail-content-view/mail-content-view.component';
import { SelectedMailService } from '../../../../../core/services/selected-mail.service';

@Component({
  selector: 'app-graph-drawer',
  standalone: true,
  imports: [MailListComponent, MailContentViewComponent],
  templateUrl: './graph-drawer.component.html',
  styleUrl: './graph-drawer.component.scss',
})
export class GraphDrawerComponent {
  public $mails: InputSignal<Mail[]> = input<Mail[]>([], { alias: 'mails' });
  public $isOpen: InputSignal<boolean> = input<boolean>(false, { alias: 'isOpen' });
  public $selection: InputSignal<GraphSelection> = input<GraphSelection>({ type: 'none' }, { alias: 'selection' });

  public drawerClose: OutputEmitterRef<void> = output<void>();

  public $graphSelectionInfo: Signal<GraphSelectionInfo | null> = computed<GraphSelectionInfo | null>(() => {
    const selection: GraphSelection = this.$selection();
    if (selection.type === 'node' && selection.nodeEmail) {
      return { type: 'node', email: selection.nodeEmail };
    }
    if (selection.type === 'edge' && selection.edgeSourceEmail && selection.edgeTargetEmail) {
      return { type: 'edge', fromEmail: selection.edgeSourceEmail, toEmail: selection.edgeTargetEmail };
    }
    return null;
  });

  private _selectedMailService: SelectedMailService = inject(SelectedMailService);
  private _ngZone: NgZone = inject(NgZone);

  public readonly $selectedMail: Signal<Mail | null> = this._selectedMailService.selectedMail;

  private _$heightPercent: WritableSignal<number> = signal<number>(DRAWER_HEIGHT_DEFAULT);
  public $isFullscreen: WritableSignal<boolean> = signal<boolean>(false);
  private _$isDragging: WritableSignal<boolean> = signal<boolean>(false);

  private _lastHeightBeforeFullscreen: number = DRAWER_HEIGHT_DEFAULT;

  public readonly translations: typeof GRAPH_LABEL_MAP = GRAPH_LABEL_MAP;

  private _startY: number = 0;
  private _startHeight: number = 0;
  private _containerHeight: number = 0;

  private _boundOnMouseMove: (event: MouseEvent) => void = this._onMouseMove.bind(this);
  private _boundOnMouseUp: () => void = this._onMouseUp.bind(this);

  @ViewChild('drawerContainer') private _drawerContainer!: ElementRef<HTMLDivElement>;

  public $drawerStyle: Signal<{ height: string }> = computed<{ height: string }>(() => {
    if (this.$isFullscreen()) {
      return { height: '100%' };
    }
    return { height: `${this._$heightPercent()}%` };
  });

  public onDragStart(event: MouseEvent): void {
    event.preventDefault();
    this._$isDragging.set(true);
    this._startY = event.clientY;
    this._startHeight = this._$heightPercent();
    this._containerHeight = (this._drawerContainer?.nativeElement?.offsetParent as HTMLElement)?.clientHeight ?? 0;

    document.addEventListener('mousemove', this._boundOnMouseMove);
    document.addEventListener('mouseup', this._boundOnMouseUp);
  }

  private _onMouseMove(event: MouseEvent): void {
    if (!this._$isDragging()) {
      return;
    }
    this._ngZone.run(() => {
      const deltaY: number = this._startY - event.clientY;
      const deltaPercent: number = (deltaY / this._containerHeight) * 100;
      const newHeight: number = Math.max(
        DRAWER_HEIGHT_MIN,
        Math.min(DRAWER_HEIGHT_MAX, this._startHeight + deltaPercent),
      );
      this._$heightPercent.set(newHeight);
    });
  }

  private _onMouseUp(): void {
    this._ngZone.run(() => {
      this._$isDragging.set(false);
    });
    document.removeEventListener('mousemove', this._boundOnMouseMove);
    document.removeEventListener('mouseup', this._boundOnMouseUp);
  }

  public onToggleFullscreen(): void {
    if (this.$isFullscreen()) {
      this.$isFullscreen.set(false);
      this._$heightPercent.set(this._lastHeightBeforeFullscreen);
    } else {
      this._lastHeightBeforeFullscreen = this._$heightPercent();
      this.$isFullscreen.set(true);
    }
  }

  public onHandleDoubleClick(): void {
    this.onToggleFullscreen();
  }

  public onClose(): void {
    this.$isFullscreen.set(false);
    this.drawerClose.emit();
  }
}
