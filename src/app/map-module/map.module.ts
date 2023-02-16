import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenlayerComponent } from './components/openlayer/openlayer.component';
import { MyCommonModule } from '../common-module/my-common.module';

// npm ======================================================
// npm i ol
// npm ====================================================== 

// tsconfig.json ============================================
// "compilerOptions": {
//   ...
//   "skipLibCheck": true,
// }
// tsconfig.json ============================================

// angular.json =============================================
// "styles": [
//   ...
//   "node_modules/ol/ol.css"
// ]
// angular.json =============================================

@NgModule({
  declarations: [
    OpenlayerComponent
  ],
  imports: [
    CommonModule,
    MyCommonModule
  ],
  exports: [
    OpenlayerComponent
  ]
})
export class MapModule { }
