import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1';
  
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]>{
    const url: string= `${this._baseUrl}/region/${region}?fields=cca3,name`
    return this.http.get<PaisSmall[]>(url)
  }

  getPaisesPorCodigo(codigo: string): Observable<Pais[] | null>{
    if(!codigo){
      return of(null)
    }
    const url: string= `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais[]>(url)
  }

  getPaisesPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    const url: string= `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<PaisSmall>(url)
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]>  {
    if(!borders){
      return of([])
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);

    });

    return combineLatest(peticiones);
  }


}
