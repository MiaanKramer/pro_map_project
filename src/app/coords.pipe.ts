import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'coords'
})
export class CoordinatesPipe implements PipeTransform {

  constructor(){}

  transform(value: number, type = 'lat') {
      if (typeof value != undefined && value != null){

          let dir = '-';

          if (type === 'lat'){
              dir = value >= 0 ? 'N' : 'S';
          }else{
              dir = value >= 0 ? 'W' : 'E';
          }
          value = Math.abs(value);
          let deg = Math.floor(value);
          let min = Math.floor((value - deg) * 60);
          let sec = 3600 * (value - deg) - (60 * min);

          return '' + deg + '&deg; ' + min + '&prime; ' + sec.toFixed(2) + '&Prime; ' + dir;
      }

      return 'Not Set';
  }
}