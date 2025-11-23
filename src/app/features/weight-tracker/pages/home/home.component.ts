import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';
import { StorageService } from '../../../../core/services/storage.service';
import { EntryListComponent } from '../../components/entry-list/entry-list.component';
import { EntryFormComponent } from '../../components/entry-form/entry-form.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FabComponent } from '../../../../shared/components/fab/fab.component';
import { WeightEntry } from '../../models/weight-entry.model';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EntryListComponent, EntryFormComponent, ButtonComponent, FabComponent, TranslatePipe],
  template: `
    <section class="fitlog-container">
      <header class="fitlog-header">
        <h1>{{ 'home.title' | translate }}</h1>
      </header>

      <main class="fitlog-main">
        <p>{{ 'home.subtitle' | translate }}</p>
        
        @if (!isEntryFormVisible()) {
          <app-button 
            (clicked)="showEntryForm()" 
            [ariaLabel]="'home.addEntry' | translate" 
            size="lg" 
            class="add-entry-btn"
          >
            {{ 'home.addEntry' | translate }}
          </app-button>
        }
        
        <!-- Mobile FAB -->
        @if (!isEntryFormVisible()) {
          <app-fab 
            (clicked)="showEntryForm()" 
            [ariaLabel]="'home.addEntry' | translate"
            color="primary"
            size="normal">
            +
          </app-fab>
        }

        @if (isEntryFormVisible()) {
          <app-entry-form 
            [entry]="editingEntry()" 
            (entrySaved)="onEntrySaved($event)" 
            (formCancelled)="hideEntryForm()">
          </app-entry-form>
        }

        @if (!isEntryFormVisible()) {
          <app-entry-list 
            [entries]="entries()" 
            (entryEdited)="showEntryForm($event)" 
            (entryDeleted)="onEntryDeleted($event)">
          </app-entry-list>
        }
      </main>
    </section>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    isEntryFormVisible = signal(false);
  editingEntry = signal<WeightEntry | undefined>(undefined);
  entries = signal<WeightEntry[]>([]);

  private storageService = inject(StorageService);
  /**
   * feature: Theming with CSS Variables + Theme Service
   * 
   * Steps:
   * 1. Created themes.scss with :root {} and [data-theme="dark"] blocks
   * 2. Applied color variables in styles.scss using var(--color-xyz)
   * 3. Created ThemeService to manage theme state and persistence
   * 4. Used ThemeService in HomeComponent for toggling themes
   * 
   * What It Does:
   * We use CSS variables for theming because they're lightweight, runtime-adjustable,
   * and don't need recompilation. The ThemeService centralizes theme management and
   * persists user preferences in localStorage.
   * 
   * Design Principles:
   * - Separation of Concerns - theme logic is in a dedicated service
   * - Single Responsibility - component only handles UI, service handles theme state
   * - Persistence - user preferences are saved between sessions
   */
      constructor(public theme: ThemeService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

  async loadEntries(): Promise<void> {
    const entries = await this.storageService.getAllEntries();
    this.entries.set(entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  showEntryForm(entry?: WeightEntry): void {
    this.editingEntry.set(entry);
    this.isEntryFormVisible.set(true);
  }

  hideEntryForm(): void {
    this.isEntryFormVisible.set(false);
    this.editingEntry.set(undefined);
  }

    async onEntrySaved(entry: WeightEntry): Promise<void> {
    await this.storageService.addEntry(entry);
    this.hideEntryForm();
    await this.loadEntries();
  }

  async onEntryDeleted(id: string): Promise<void> {
    await this.storageService.deleteEntry(id);
    await this.loadEntries();
  }
}
