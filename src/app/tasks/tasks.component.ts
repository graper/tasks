import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Tasks } from 'src/model/tasks';
import { FormBuilder, Validators, FormArray} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  listId: number = 0;
  dataSource: Tasks[];  
  taskForm;

  get arrayTasks(): FormArray {
    return this.taskForm.get("tasks") as FormArray;
  }

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {        
    if(this.route.snapshot.params['listId'] == 0){
      console.log("sem listId: " + this.listId)
      this.router.navigate(['/']);
    }

    this.listId = this.route.snapshot.params['listId'];
    this.taskForm = this.formBuilder.group({
      tasks: this.formBuilder.array([])
    });

    this.loadingEvent(true);
    this.api.getTasks(this.listId).subscribe(res => {
      this.dataSource = res;
      for(var x = 0; x < this.dataSource.length; x++){
        this.arrayTasks.push(
          this.formBuilder.group({
            id: [this.dataSource[x].id],
            listId: [this.dataSource[x].listId],
            title: [this.dataSource[x].title],
            status: [this.dataSource[x].status || "aberto"]
          })
        )
      }
      this.loadingEvent(false);
    }, err => {
      this.loadingEvent(false);
      console.log(err);      
    });
  }

  addTask() {
    this.arrayTasks.push(this.createFormGroup());
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [0],
      listId: [this.listId],
      title: ["", Validators.required],
      status: ["aberto"]
    });
  }

  delTask(index) {
    var id = this.arrayTasks.at(index).value.id;
    if(id > 0){
      this.loadingEvent(true);
      this.api.deleteTask(id).subscribe(res => {
        this.loadingEvent(false);
      }, (err) => {
        console.log(err);
        this.loadingEvent(false);
      });
    }
    this.arrayTasks.removeAt(index);
  }

  saveTasks(){
    var task;
    var haveError = false;
    this.loadingEvent(true);
    for(var x = 0; x < this.arrayTasks.length; x++){
      task = this.arrayTasks.at(x).value;
      if(task.id > 0){
        this.api.updateTask(task.id, task).subscribe(res => {
        }, (err) => {
          haveError = true;
          console.log(err);
        });
      }else{
        this.api.addTask(task).subscribe(res => {
        }, (err) => {
          haveError = true;
          console.log(err);          
        });
      }
      if(!haveError){
        this.loadingEvent(false);
        this.router.navigate(['/']);
      }else{
        this.loadingEvent(false);
        break;
      }
    }
  }

  backList(){
    this.router.navigate([`/list/${this.listId}`]);
  }

  loadingEvent(loading){
    if(loading){
      this.spinner.show();
    }else{
      this.spinner.hide();
    }
  }

}
