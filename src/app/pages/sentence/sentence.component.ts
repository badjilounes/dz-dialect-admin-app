import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  ConfirmButtonColor,
  ConfirmData,
} from 'src/app/shared/design-system/confirm-dialog/confirm-dialog.service';
import { SentenceHttpService, SentenceResponseDto } from 'src/clients/dz-dialect-api';
import {
  UiSortableCrudComponent,
  UiSortableCrudConfiguration,
} from '../../shared/business/ui-sortable-crud/ui-sortable-crud.component';
import { AddSentenceComponent } from './add-sentence/add-sentence.component';

@UntilDestroy()
@Component({
  selector: 'app-sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.scss'],
  standalone: true,
  imports: [CommonModule, UiSortableCrudComponent],
})
export class SentenceComponent {
  configuration: UiSortableCrudConfiguration<SentenceResponseDto> = {
    title: 'Phrases',
    emptyState: {
      withSearch: (search: string) => ({
        title: search ? `Aucune phrase ne correspond à "${search}"` : 'Aucune phrase',
        subtitle: search ? '' : 'Cliquer sur "Ajouter une phrase" pour en créer une !',
      }),
    },
    search: {
      label: 'Rechercher une phrase',
      placeholder: 'Rechercher une phrase',
    },
    create: {
      buttonLabel: 'Ajouter une phrase',
      dialogComponent: AddSentenceComponent,
      dialogData: () => undefined,
      onSuccess: () =>
        this.snackBar.open(`La phrase a bien été ajoutée`, 'Fermer', { duration: 2000 }),
    },
    read: {
      service$: (pageIndex: number, pageSize: number, query?: string) =>
        this.sentenceHttpService.searchSentence(pageIndex, pageSize, query),
    },
    update: {
      dialogComponent: AddSentenceComponent,
      dialogData: (sentence: SentenceResponseDto) => sentence,
      onSuccess: () =>
        this.snackBar.open(`La phrase a bien été modifiée`, 'Fermer', { duration: 2000 }),
    },
    delete: {
      confirmConfiguration: (sentence: SentenceResponseDto): MatDialogConfig<ConfirmData> => ({
        data: {
          title: 'Supprimer la formation',
          content: `Êtes-vous sûr de vouloir supprimer la phrase "${sentence.fr}" ?`,
          cancelLabel: 'Annuler',
          acceptLabel: 'Supprimer',
          acceptButtonColor: ConfirmButtonColor.WARN,
        },
      }),
      onSuccess: (sentence: SentenceResponseDto) =>
        this.snackBar.open(`La phrase "${sentence.fr}" a été supprimée`, 'Fermer', {
          duration: 2000,
        }),
      service$: (sentence: SentenceResponseDto) =>
        this.sentenceHttpService.deleteSentence(sentence.id),
    },
  };

  constructor(
    private readonly sentenceHttpService: SentenceHttpService,
    private readonly snackBar: MatSnackBar,
    private readonly title: Title,
  ) {
    this.title.setTitle('Phrases');
  }
}
