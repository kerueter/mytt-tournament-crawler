import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'freeSpotsColor'
})
export class FreeSpotsColorPipe implements PipeTransform {
  /**
   *
   * @param value
   *
   * @returns
   */
  transform(value: string): string {
    let color = '#2dd36f';

    const freeSpotsParts = value.split('/');
    const freeSpots = Number(freeSpotsParts[0]);
    const totalSpots = Number(freeSpotsParts[1]);

    if (freeSpots === 0 || totalSpots === 0) {
      color = '#eb445a';
    } else if ((freeSpots / totalSpots) < 0.25) {
      color = '#ffc409';
    }

    return color;
  }
}
