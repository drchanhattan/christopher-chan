import { Component, HostBinding } from '@angular/core';
import { GalleryComponent } from '../../components/gallery/gallery.component';

@Component({
  selector: 'app-south-america',
  standalone: true,
  templateUrl: './south-america.component.html',
  imports: [GalleryComponent],
})
export class SouthAmericaComponent {
  @HostBinding('class') hostClasses = '!size-full';

  photos: { header: string; urls: string[] }[] = [
    {
      header: 'Argentina and Chile',
      urls: [
        'argentina-chile-1.jpg',
        'argentina-chile-2.jpg',
        'argentina-chile-3.jpg',
        'argentina-chile-4.jpg',
        'argentina-chile-5.jpg',
        'argentina-chile-6.jpg',
        'argentina-chile-7.jpg',
        'argentina-chile-8.jpg',
        'argentina-chile-9.jpg',
        'argentina-chile-10.jpg',
      ],
    },
    {
      header: 'Bolivia',
      urls: [
        'bolivia-1.jpg',
        'bolivia-2.jpg',
        'bolivia-3.jpg',
        'bolivia-4.jpg',
        'bolivia-5.jpg',
        'bolivia-6.jpg',
        'bolivia-7.jpg',
        'bolivia-8.jpg',
        'bolivia-9.jpg',
        'bolivia-10.jpg',
        'bolivia-11.jpg',
        'bolivia-12.jpg',
      ],
    },
    {
      header: 'Brazil',
      urls: [
        'brazil-1.jpg',
        'brazil-2.jpg',
        'brazil-3.jpg',
        'brazil-4.jpg',
        'brazil-5.jpg',
        'brazil-6.jpg',
        'brazil-7.jpg',
        'brazil-8.jpg',
        'brazil-9.jpg',
      ],
    },
    {
      header: 'Peru',
      urls: [
        'peru-1.jpg',
        'peru-2.jpg',
        'peru-3.jpg',
        'peru-4.jpg',
        'peru-5.jpg',
        'peru-6.jpg',
        'peru-7.jpg',
        'peru-8.jpg',
        'peru-9.jpg',
        'peru-10.jpg',
        'peru-11.jpg',
        'peru-12.jpg',
        'peru-13.jpg',
        'peru-14.jpg',
        'peru-15.jpg',
        'peru-16.jpg',
        'peru-17.jpg',
        'peru-18.jpg',
      ],
    },
  ];
}