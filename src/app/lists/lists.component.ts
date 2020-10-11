import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Lists } from 'src/model/lists';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  dataSource: Lists[];
  
  constructor(private api: ApiService, private spinner: NgxSpinnerService) { }  
  
  ngOnInit() {   
    this.loadingEvent(true); 
    this.api.getLists().subscribe(res => {
      this.dataSource = res;
      this.loadingEvent(false);
    }, err => {
      console.log(err);
      this.loadingEvent(false);
    });
  }

  delList(id, index){
    if(confirm("Deseja deletar está lista? Todas as tarefas destas lista também serão exluidas")){
      this.loadingEvent(true);
      this.api.deleteList(id).subscribe(res => {
        this.loadingEvent(false);
        this.dataSource.splice(index, 1);
      }, (err) => {
        console.log(err);
        this.loadingEvent(false);
      });
    }
  }

  loadingEvent(loading){
    if(loading){
      this.spinner.show();
    }else{
      this.spinner.hide();
    }
  }
}