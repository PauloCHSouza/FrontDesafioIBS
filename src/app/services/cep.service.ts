import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  getAddressByCep(cep: string): Observable<any> {
    const url = `${this.viaCepUrl}/${cep}/json/`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (!response.erro) {
          return {
            success: true,
            address: {
              cep: response.cep,
              endereco: response.logradouro,
              complemento: response.complemento,
              bairro: response.bairro,
              cidade: response.localidade,
              estado: response.uf
            }
          };
        } else {
          return { success: false, message: 'CEP não encontrado' };
        }
      }),
      catchError((error: any) => {
        console.error('Erro ao buscar o CEP:', error);
        return of({ success: false, message: 'Erro ao buscar o CEP' });
      })
    );
  }
}
