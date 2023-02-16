import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() status!: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  @Input() title?: string;
  @Input() subTitle?: string;

  defaultTitle: any = {
    warning: 'There are some problems with your operation',
    error: 'There are some problems with your operation'
  }

  defaultSubTitle: any = {
  }

  constructor() { }

  ngOnInit(): void {
  }

}
