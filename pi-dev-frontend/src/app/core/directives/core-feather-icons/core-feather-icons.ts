import { Directive, ElementRef, Input, Inject, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import * as Feather from 'feather-icons';
// FontAwesome imports
import { icon, Icon } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// Material Design Icons
import * as mdi from '@mdi/js';
 

@Directive({
  selector: '[app-icon]'
})
export class IconDirective implements OnChanges {
  private _nativeElement: any;

  @Input('app-icon') name!: string;
  @Input() library: 'feather' | 'fontawesome' | 'mdi'= 'feather';
  @Input() variant: 'solid' | 'regular' | 'brands' = 'solid'; // For FontAwesome
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
    this.variant = changes['variant']?.currentValue || this.variant || 'solid';
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
      case 'mdi':
        svg = this.renderMaterialDesignIcon();
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
      let iconPrefix = 'fas'; // default to solid

      if (this.name.includes(' ')) {
        const parts = this.name.split(' ');
        // Handle different prefix notations (fas, far, fab)
        if (parts[0] === 'fas' || parts[0] === 'far' || parts[0] === 'fab') {
          iconPrefix = parts[0];
          this.variant = iconPrefix === 'fas' ? 'solid' : 
                         iconPrefix === 'far' ? 'regular' : 'brands';
        }
        iconName = parts.length > 1 ? parts[1].replace('fa-', '') : parts[0].replace('fa-', '');
      } else if (this.name.startsWith('fa-')) {
        iconName = this.name.replace('fa-', '');
      }

      // Convert kebab-case to camelCase for FontAwesome
      // Example: "power-off" should become "PowerOff" for faIconName construction
      iconName = iconName.split('-')
        .map(part => this.capitalize(part))
        .join('');

      // Select icon collection based on variant
      let iconCollection;
      switch (this.variant) {
        case 'solid':
          iconCollection = fas;
          break;
        case 'regular':
          iconCollection = far;
          break;
        case 'brands':
          iconCollection = fab;
          break;
        default:
          iconCollection = fas;
      }

      // Check if the icon exists in the selected collection
      const faIconName = `fa${iconName}`;
      if (!iconCollection[faIconName as keyof typeof iconCollection]) {
        console.error(`FontAwesome icon "${this.name}" (${faIconName}) not found in ${this.variant} icons`);
        return null;
      }

      // Create the icon
      const faIcon: Icon = icon(iconCollection[faIconName as keyof typeof iconCollection]);
      
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

  private renderMaterialDesignIcon(): string | null {
    if (!this.name) {
      console.error('Material Design icon name not provided');
      return null;
    }

    try {
      // MDI icons in @mdi/js are named like mdiAccountCircle
      let iconName = this.name;
      
      // Handle different naming formats
      if (this.name.startsWith('mdi-')) {
        // Convert from kebab-case (mdi-account-circle) to camelCase (mdiAccountCircle)
        iconName = 'mdi' + this.name.substring(4)
          .split('-')
          .map((part, index) => index === 0 ? part : this.capitalize(part))
          .join('');
      } else if (!this.name.startsWith('mdi')) {
        // If no prefix, assume it's just the name and add mdi prefix
        iconName = 'mdi' + this.capitalize(this.name);
      }

      // Check if icon exists
      if (!(mdi as any)[iconName]) {
        console.error(`Material Design icon "${iconName}" not found`);
        return null;
      }

      // Get icon path
      const path = (mdi as any)[iconName];
      
      // Build SVG
      const svgAttrs = `class="${this.class || ''}" width="${this.size}" height="${this.size}" viewBox="0 0 24 24"`;
      return `<svg ${svgAttrs}><path d="${path}" /></svg>`;
      
    } catch (error) {
      console.error(`Error rendering Material Design icon "${this.name}":`, error);
      return null;
    }
  }

 

  // Helper function to capitalize first letter
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}