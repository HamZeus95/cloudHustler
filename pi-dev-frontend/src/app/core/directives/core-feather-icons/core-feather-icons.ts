import { Directive, ElementRef, Input, Inject, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

import * as Feather from 'feather-icons';

@Directive({
  selector: '[data-feather]'
})
export class FeatherIconDirective implements OnChanges {
  // Private
  private _nativeElement: any;

  @Input('data-feather') name!: string;
  @Input() class!: string;
  @Input() size!: string;
  @Input() inner!: boolean;

  /**
   * Constructor
   *
   * @param {ElementRef} _elementRef
   */
  constructor(
    @Inject(ElementRef) private _elementRef: ElementRef,
    @Inject(ChangeDetectorRef) private _changeDetector: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // Get the native element
    this._nativeElement = this._elementRef.nativeElement;

    // SVG parameter
    this.name = changes['name'] ? changes['name'].currentValue : '';
    this.size = changes['size'] ? changes['size'].currentValue : '25'; // Set default size 14
    this.class = changes['class'] ? changes['class'].currentValue : '';

    // Create SVG
    if (this.name && Feather.icons[this.name as keyof typeof Feather.icons]) {
      const svg = Feather.icons[this.name as keyof typeof Feather.icons].toSvg({
        class: this.class,
        width: this.size,
        height: this.size
      });
      // Set SVG
      if (this.inner) {
        this._nativeElement.innerHTML = svg;
      } else {
        this._nativeElement.outerHTML = svg;
      }
    } else {
      console.error(`Feather icon "${this.name}" not found`);
    }
    this._changeDetector.markForCheck();
  }
}

