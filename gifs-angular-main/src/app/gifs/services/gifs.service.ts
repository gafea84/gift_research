import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apikey     : string = '1Oav4jHjqGx8JGnmTMMCAlAnXqwclk6P';
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  // Gif o data
  public resultados: Gif[] = [];

  get historial(): string[] {
    return [...this._historial];
  }

  // Constructor del servicio es un lugar para inicializar DATA
  // el operador ! acepta que la variable sea null
  constructor( private http: HttpClient ){
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || [];

    /*******************************
     * if (localStorage.getItem('historial')){
     * this._historial = JSON.parse( localStorage.getItem('historial')! ) ;
     * }
     */
  }

  buscarGifs( query: string ) {

    query = query.trim().toLocaleLowerCase();
    
    // verify repeats values
    if( !this._historial.includes(query) ){
      
      // Insert
      this._historial.unshift( query );

      // Cut and get only 10 items
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial) );

    }

    const params = new HttpParams()
          .set('api_key', this.apikey)
          .set('limit', '10')
          .set('q', query);

      // console.log(params.toString());

    this.http.get<SearchGifsResponse>(`${ this.servicioURL }/search`, { params })
      .subscribe( ( resp ) => {
        // console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados) );
      })

    // console.log(this._historial);
  }

  borrarGifs( query: string ) {

    let indice = this._historial.indexOf(query);
    
    if (indice >= 0){
      this._historial.splice(indice, 1);
      localStorage.setItem('historial', JSON.stringify(this._historial) );
      
      this.resultados = [];
      localStorage.removeItem('resultados');
    }
    else{
      return;
    }
    
  }
}
