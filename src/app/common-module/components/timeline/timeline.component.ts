import { Component, Input, OnInit } from '@angular/core';

/**
 * Hiển thị nội dung dưới dạng timeline
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() datasetEmptyMessage?: string = "Không có nội dung";
  @Input() dataset!: any[];
  @Input() timestampKey: string = 'timestamp';
  @Input() contentKey: string = 'content';
  @Input() contentType: 'text' | 'html' | 'a' = 'text';
  @Input() colorKey: string = 'color';

  constructor() { }

  ngOnInit(): void {
    this.dataset.forEach((item: any, idx: number) => {
      if (!item[this.colorKey]) {
        if (idx === 0) {
          item[this.colorKey] = 'green'
        } else if (idx === this.dataset.length - 1) {
          item[this.colorKey] = 'red'
        }
      }
    })
  }

}
