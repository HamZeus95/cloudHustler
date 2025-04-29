import { NgModule } from '@angular/core';

import { IconDirective } from './core-feather-icons/core-feather-icons'; 
import { ClickOutsideDirective } from './click-outside.directive';

@NgModule({
  declarations: [IconDirective, ClickOutsideDirective],
  exports: [IconDirective, ClickOutsideDirective],
})
export class CoreDirectivesModule {}