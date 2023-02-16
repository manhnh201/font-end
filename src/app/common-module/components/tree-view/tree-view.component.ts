import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {
  @ViewChild('tree') __tree: any;

  @Input() data: any[] = [];
  @Input() viewHeight: string = "200px";
  @Input() checkable: Boolean = true;
  @Input() multiple: Boolean = true;
  @Input() checkedKeys: any[] = [];
  @Output() checkedKeysChange = new EventEmitter<string[]>();
  @Output() onEvent = new EventEmitter<any>();

  searchValue: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  __onEvent(sender: string, event: any = undefined) {
    switch (sender) {
      case 'onCheckBoxChange':
        this.checkedKeysChange.emit(event.keys);
        break;
      case 'onClick':
        break;
    }

    this.onEvent.emit({ sender: sender, event: event });
  }
}
