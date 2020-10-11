import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Lists } from 'src/model/lists';
import { Tasks } from 'src/model/tasks';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrlLists = 'http://localhost:3000/lists';
const apiUrlTasks = 'http://localhost:3000/tasks';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      return of(result as T);
    };
  }

  getLists(): Observable<Lists[]> {
    return this.http.get<Lists[]>(apiUrlLists)
      .pipe(
        catchError(this.handleError('getLists', []))
      );
  }

  getList(id: number): Observable<Lists> {
    const url = `${apiUrlLists}/${id}`;
    return this.http.get<Lists>(url).pipe(
      catchError(this.handleError<Lists>(`getList id=${id}`))
    );
  }

  addList(list): Observable<Lists> {
    return this.http.post<Lists>(apiUrlLists, list, httpOptions).pipe(
      catchError(this.handleError<Lists>('addList'))
    );
  }

  updateList(id, list): Observable<any> {
    const url = `${apiUrlLists}/${id}`;
    return this.http.put(url, list, httpOptions).pipe(
      catchError(this.handleError<any>('updateList'))
    );
  }

  deleteList (id): Observable<Lists> {
    const url = `${apiUrlLists}/${id}`;

    return this.http.delete<Lists>(url, httpOptions).pipe(
      catchError(this.handleError<Lists>('deleteList'))
    );
  }

  getTasks(idList): Observable<Tasks[]> {
    const url = `${apiUrlTasks}?listId=${idList}`;
    return this.http.get<Tasks[]>(url)
      .pipe(
        catchError(this.handleError(`getTasks id=${idList}`, []))
      );
  }  

  addTask(task): Observable<Tasks> {
    return this.http.post<Tasks>(apiUrlTasks, task, httpOptions).pipe(
      catchError(this.handleError<Tasks>('addList'))
    );
  }

  updateTask(id, task): Observable<any> {
    const url = `${apiUrlTasks}/${id}`;
    return this.http.put(url, task, httpOptions).pipe(
      catchError(this.handleError<any>('updateTask'))
    );
  }

  deleteTask (id): Observable<Tasks> {
    const url = `${apiUrlTasks}/${id}`;

    return this.http.delete<Tasks>(url, httpOptions).pipe(
      catchError(this.handleError<Tasks>('deleteTask'))
    );
  }
}
