import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';
import { TodosStore } from '../../store/todos.store';
import { NgStyle } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Todo } from '../../model/todo.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'todos-list',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    NgStyle,
    MatPaginator
  ],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosListComponent {
  store = inject(TodosStore);
  filter = viewChild.required(MatButtonToggleGroup);
  sort = viewChild.required(MatSelect);
  paginator = viewChild.required(MatPaginator);
  pageEvent?: PageEvent;

  constructor() {
    effect(() => {
      const filter = this.filter();
      const sort = this.sort();
      const paginator = this.paginator();

      filter.value = this.store.filter();
      sort.value = this.store.params().IsDescending;
      paginator.length = this.store.todosLength();
      paginator.pageSize = this.store.pageSize();
      paginator.pageIndex = this.store.page()-1;
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.store.updatePage(this.pageEvent);
  }
  
  onAddTodo(title:string, element: HTMLInputElement) {
    this.store.addTodo(title);
    element.value = "";
  }
  
  onDeleteTodo(id: string, event: MouseEvent) {
    event.stopPropagation();

    this.store.deleteTodo(id);
  }

  onTodoToggled(id: string, title: string, completed: boolean) {
    this.store.updateTodo(id, completed, title);
  }

  onFilterTodos(event: MatButtonToggleChange) {
    this.store.updateFilter(event.value);
  }

  onSortChange(descending: boolean) {
    this.store.updateSort(descending);
  }
}
