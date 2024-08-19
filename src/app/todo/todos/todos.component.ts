import { Component, inject, OnInit } from '@angular/core';
import { TodosStore } from '../../store/todos.store';
import { TodosListComponent } from '../todos-list/todos-list.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'todos',
  standalone: true,
  imports: [TodosListComponent, MatProgressSpinner],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {

  store = inject(TodosStore);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.store.loadAll();
  }

}
