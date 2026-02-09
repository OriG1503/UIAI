import { Component, input, output, signal, computed, inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Mail } from '../../../../shared/types/mail.type';
import { DrawerState } from '../../types/drawer-state.type';
import { GraphSelection } from '../../types/graph-selection.type';
import { GraphSelectionInfo } from '../../../inbox-mail-list/types/graph-selection-info.type';
import { GRAPH_TRANSLATIONS } from '../../translations/graph.translations';
import { DRAWER_HEIGHT_MIN, DRAWER_HEIGHT_MAX, DRAWER_HEIGHT_DEFAULT } from '../../constants/graph.constants';
import { MailListComponent } from '../../../inbox-mail-list/organisms/mail-list/mail-list.component';
import { MailContentViewComponent } from '../../../mail-content/organisms/mail-content-view/mail-content-view.component';
import { SelectedMailService } from '../../../../core/services/selected-mail.service';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-graph-drawer',
  standalone: true,
  imports: [MailListComponent, MailContentViewComponent, IconComponent],
  templateUrl: './graph-drawer.component.html',
  styleUrl: './graph-drawer.component.scss'
})
export class GraphDrawerComponent {
  $mails = input<Mail[]>([], { alias: 'mails' });
  $isOpen = input<boolean>(false, { alias: 'isOpen' });
  $selection = input<GraphSelection>({ type: 'none' }, { alias: 'selection' });

  drawerClose = output<void>();

  $graphSelectionInfo = computed<GraphSelectionInfo | null>(() => {
    const selection = this.$selection();
    if (selection.type === 'node' && selection.nodeEmail) {
      return { type: 'node', email: selection.nodeEmail };
    }
    if (selection.type === 'edge' && selection.edgeSourceEmail && selection.edgeTargetEmail) {
      return { type: 'edge', fromEmail: selection.edgeSourceEmail, toEmail: selection.edgeTargetEmail };
    }
    return null;
  });

  private _selectedMailService = inject(SelectedMailService);
  private _ngZone = inject(NgZone);

  readonly $selectedMail = this._selectedMailService.selectedMail;
  readonly $hasPrevious = this._selectedMailService.$hasPrevious;
  readonly $hasNext = this._selectedMailService.$hasNext;

  $heightPercent = signal(DRAWER_HEIGHT_DEFAULT);
  $isFullscreen = signal(false);
  $isDragging = signal(false);

  private _lastHeightBeforeFullscreen = DRAWER_HEIGHT_DEFAULT;

  readonly translations = GRAPH_TRANSLATIONS;

  private _startY = 0;
  private _startHeight = 0;
  private _containerHeight = 0;

  private _boundOnMouseMove = this._onMouseMove.bind(this);
  private _boundOnMouseUp = this._onMouseUp.bind(this);

  @ViewChild('drawerContainer') private _drawerContainer!: ElementRef<HTMLDivElement>;

  $drawerStyle = computed(() => {
    if (this.$isFullscreen()) {
      return { height: '100%' };
    }
    return { height: `${this.$heightPercent()}%` };
  });

  public onDragStart(event: MouseEvent): void {
    event.preventDefault();
    this.$isDragging.set(true);
    this._startY = event.clientY;
    this._startHeight = this.$heightPercent();
    this._containerHeight = (this._drawerContainer?.nativeElement?.offsetParent as HTMLElement)?.clientHeight ?? 0;

    document.addEventListener('mousemove', this._boundOnMouseMove);
    document.addEventListener('mouseup', this._boundOnMouseUp);
  }

  private _onMouseMove(event: MouseEvent): void {
    if (!this.$isDragging()) {
      return;
    }
    this._ngZone.run(() => {
      const deltaY = this._startY - event.clientY;
      const deltaPercent = (deltaY / this._containerHeight) * 100;
      const newHeight = Math.max(DRAWER_HEIGHT_MIN, Math.min(DRAWER_HEIGHT_MAX, this._startHeight + deltaPercent));
      this.$heightPercent.set(newHeight);
    });
  }

  private _onMouseUp(): void {
    this._ngZone.run(() => {
      this.$isDragging.set(false);
    });
    document.removeEventListener('mousemove', this._boundOnMouseMove);
    document.removeEventListener('mouseup', this._boundOnMouseUp);
  }

  public onToggleFullscreen(): void {
    if (this.$isFullscreen()) {
      this.$isFullscreen.set(false);
      this.$heightPercent.set(this._lastHeightBeforeFullscreen);
    } else {
      this._lastHeightBeforeFullscreen = this.$heightPercent();
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

  public onPreviousMail(): void {
    this._selectedMailService.selectPrevious();
  }

  public onNextMail(): void {
    this._selectedMailService.selectNext();
  }
}
