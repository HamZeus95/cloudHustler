import { NgModule } from '@angular/core';

import { InitialsPipe } from '../pipes/initials.pipe'; 
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
  declarations: [InitialsPipe, FilterPipe],
  imports: [],
  exports: [InitialsPipe, FilterPipe]
})
export class CorePipesModule {}
