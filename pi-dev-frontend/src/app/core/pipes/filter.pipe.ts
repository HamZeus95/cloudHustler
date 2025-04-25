import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param items
   * @param searchText
   * @param property
   * @returns
   */
  transform(items: any[], searchText: string, property?: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (property) {
        if (item[property]) {
          return item[property].toLowerCase().includes(searchText);
        }
        return false;
      } else {
        // When no property is specified, search across common properties
        return (
          (item.title && item.title.toLowerCase().includes(searchText)) ||
          (item.name && item.name.toLowerCase().includes(searchText)) ||
          (item.description && item.description.toLowerCase().includes(searchText))
        );
      }
    });
  }
}
