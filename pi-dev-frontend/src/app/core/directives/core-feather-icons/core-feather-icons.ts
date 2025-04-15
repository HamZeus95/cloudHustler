import { Directive, ElementRef, Input, Inject, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Feather from 'feather-icons';
// FontAwesome imports
import { icon, Icon } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Directive({
  selector: '[app-icon]'
})
export class IconDirective implements OnChanges {
  private _nativeElement: any;

  @Input('app-icon') name!: string;
  @Input() library: 'feather' | 'fontawesome'= 'feather';
  @Input() class!: string;
  @Input() size!: string;
  @Input() inner!: boolean;

  constructor(
    @Inject(ElementRef) private _elementRef: ElementRef,
    @Inject(ChangeDetectorRef) private _changeDetector: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // Get the native element
    this._nativeElement = this._elementRef.nativeElement;

    // Extract parameters
    this.name = changes['name']?.currentValue || this.name || '';
    this.library = changes['library']?.currentValue || this.library || 'feather';
    this.size = changes['size']?.currentValue || this.size || '25';
    this.class = changes['class']?.currentValue || this.class || '';

    // Generate SVG based on library
    let svg: string | null = null;

    switch (this.library) {
      case 'feather':
        svg = this.renderFeatherIcon();
        break;
      case 'fontawesome':
        svg = this.renderFontAwesomeIcon();
        break; 
      default:
        console.error(`Unsupported icon library: ${this.library}`);
    }

    // Set SVG if rendered
    if (svg) {
      if (this.inner) {
        this._nativeElement.innerHTML = svg;
      } else {
        this._nativeElement.outerHTML = svg;
      }
    }
    
    this._changeDetector.markForCheck();
  }

  private renderFeatherIcon(): string | null {
    if (this.name && Feather.icons[this.name as keyof typeof Feather.icons]) {
      return Feather.icons[this.name as keyof typeof Feather.icons].toSvg({
        class: this.class,
        width: this.size,
        height: this.size
      });
    } else {
      console.error(`Feather icon "${this.name}" not found`);
      return null;
    }
  }

  private renderFontAwesomeIcon(): string | null {
    if (!this.name) {
      console.error('FontAwesome icon name not provided');
      return null;
    }

    try {
      // Parse the icon name to handle prefixes like 'fas fa-home'
      let iconName = this.name;
      let iconPrefix = 'fas'; // default to solid (only solid supported in this version)

      if (this.name.includes(' ')) {
        const parts = this.name.split(' ');
        iconName = parts.length > 1 ? parts[1].replace('fa-', '') : parts[0].replace('fa-', '');
      } else if (this.name.startsWith('fa-')) {
        iconName = this.name.replace('fa-', '');
      }

      // With only free-solid-svg-icons installed, we only support 'fas' icons
      if (iconPrefix !== 'fas') {
        console.warn(`Only 'fas' (solid) FontAwesome icons are supported. Using solid version of "${iconName}"`);
      }

      // Check if the icon exists in the solid icon set
      if (!fas[`fa${this.capitalize(iconName)}`]) {
        console.error(`FontAwesome icon "${iconName}" not found in solid icons`);
        return null;
      }

      // Create the icon
      const faIcon: Icon = icon(fas[`fa${this.capitalize(iconName)}`]);
      
      if (!faIcon) {
        console.error(`Could not create FontAwesome icon for "${this.name}"`);
        return null;
      }

      // Convert to SVG string
      const svg = faIcon.html[0];
      
      // Add custom classes and adjust size
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      
      if (svgElement) {
        if (this.class) {
          this.class.split(' ').forEach(cls => {
            if (cls) svgElement.classList.add(cls);
          });
        }
        
        if (this.size) {
          svgElement.setAttribute('width', this.size);
          svgElement.setAttribute('height', this.size);
        }
        
        return svgElement.outerHTML;
      }
      
      return svg;
    } catch (error) {
      console.error(`Error rendering FontAwesome icon "${this.name}":`, error);
      return null;
    }
  }

 

  // Helper function to capitalize first letter
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}