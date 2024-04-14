import { Injectable } from '@angular/core';
import { Pessoa } from '../Interfaces/pessoas';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  private apiUrl = 'http://localhost:3000/pessoas';

  constructor(private http: HttpClient) {}

  getPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl);
  }

  addPessoa(pessoa: Pessoa): Observable<Pessoa> {
    if (!this.isValidPessoa(pessoa)) {
      throw new Error('Dados inválidos para pessoa.');
    }

    const enderecosValidos = pessoa.enderecos.filter(endereco => endereco.cep !== null && endereco.cep !== '');
    const pessoaComEnderecosValidos: Pessoa = {
      ...pessoa,
      enderecos: enderecosValidos
    };

    return this.http.post<Pessoa>(`${this.apiUrl}`, pessoa).pipe(
      catchError(this.handleError)
    );;
  }

  updatePessoa(pessoa: Pessoa): Observable<Pessoa> {
    if (!this.isValidPessoa(pessoa)) {
      throw new Error('Dados inválidos para pessoa.');
    }

    const url = `${this.apiUrl}/${pessoa.idpessoas}`;
    return this.http.patch<Pessoa>(url, pessoa);
  }

  deletePessoa(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }

  

  calcularIdade(dataNascimento: Date): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth() + 1;
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth() + 1;
    const diaNascimento = nascimento.getDate();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }
    
    return idade;
  }

  diasAteProximoAniversario(dataNascimento: Date): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    nascimento.setFullYear(hoje.getFullYear());

    if (nascimento.getTime() < hoje.getTime()) {
      nascimento.setFullYear(hoje.getFullYear() + 1);
    }

    const umDia = 1000 * 60 * 60 * 24;
    const diff = nascimento.getTime() - hoje.getTime();

    return Math.ceil(diff / umDia);
  }
  

  private isValidPessoa(pessoa: Pessoa): boolean {
    if (typeof pessoa.nome !== 'string' || pessoa.nome.trim() === '') {
      return false;
    }

    if (pessoa.sexo !== 'Masculino' && pessoa.sexo !== 'Feminino') {
      return false;
    }

    if (!this.isValidDate(pessoa.dtNascimento)) {
      return false;
    }

    if (!['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'].includes(pessoa.estadoCivil)) {
      return false;
    }

    return true;
  }

  private isValidDate(dateString: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;

    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false;

    return d.toISOString().slice(0, 10) === dateString;
  }

  private handleError(err: any): Observable<any> {
    console.error('Ocorreu um erro:', err);
    return throwError('Erro ao processar a requisição.');
  }
}
