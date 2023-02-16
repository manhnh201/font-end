import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRowExpand]'
})
export class RowExpandDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
