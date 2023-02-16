import { Component, Input, OnInit } from '@angular/core';
import { IAction } from '../../dto/action.dto';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent implements OnInit {
  @Input() action!: IAction;
  @Input() size: 'large' | 'default' | 'small' = 'small';

  constructor() { }

  ngOnInit(): void {
  }

  __onEvent(sender: any, event?: any) {
    this.action.onEvent(sender, event);
  }
}
