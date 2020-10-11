import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListsComponent } from './lists/lists.component';
import { ListComponent } from './list/list.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  {
    path: 'lists',
    component: ListsComponent,
    data: { title: 'Listas de tarefas' }
  },
  {
    path: 'list/:id',
    component: ListComponent,
    data: { title: 'Lista de tarefas' }
  },
  {
    path: 'tasks/:listId',
    component: TasksComponent,
    data: { title: 'Tarefas' }
  },
  { path: '',
    redirectTo: '/lists',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
