import { Component } from '@angular/core';
import { PessoasService } from '../../services/pessoas.service';
import { Pessoa } from '../../Interfaces/pessoas';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddPessoaModalComponent } from '../add-pessoa-modal/add-pessoa-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, NgbModule, NgxPaginationModule, FormsModule ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  p: number = 1;
  total: number = 0;
  pessoas: Pessoa[] = [];

  filtro = {
    nome: '',
    sexo: '',
    estadoCivil: '',
    data: ''
  };

  pessoasFiltradas: Pessoa[] = [];

  constructor(
    private pessoasService: PessoasService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadPessoas();
  }

  loadPessoas(): void {
    this.pessoasService.getPessoas().subscribe(data => {
        this.pessoas = data;
        this.pessoasFiltradas = data;
        // Aplicar filtros quando dados são carregados
        this.aplicarFiltros();
      },
      (error) => {
        console.error('Erro ao carregar pessoas:', error);
      }
    );
  }

  isAniversario(dataNascimento: string, nome: string): boolean {
    const today = new Date();
    const birthDate = new Date(dataNascimento);

    birthDate.setHours(birthDate.getHours() + 3);
  
    const isSameMonthAndDay = today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
  
    return isSameMonthAndDay;
  }

  calcularIdade(dataNascimento: string): number {
    return this.pessoasService.calcularIdade(new Date(dataNascimento));
  }

  diasAteProximoAniversario(dataNascimento: string): number {
    return this.pessoasService.diasAteProximoAniversario(new Date(dataNascimento));
  }

  toggleAddress(pessoa: any): void {
    pessoa.showAddress = !pessoa.showAddress;
  }

  addPessoa(): void {
    this.openModal();
  }

  editPessoa(pessoa: Pessoa): void {
    const modalRef = this.modalService.open(AddPessoaModalComponent, { size: 'lg' });
    modalRef.componentInstance.pessoa = pessoa;
    modalRef.result.then((result: Pessoa) => {
      if (result) {
        this.pessoasService.updatePessoa(result).subscribe(() => {
          this.loadPessoas();
        }, (error) => {
          console.error('Erro ao adicionar pessoa:', error);
        });
      }
    });
  }

  deletePessoa(id: number): void {
    this.pessoasService.deletePessoa(id)
      .subscribe(() => {
        this.loadPessoas();
      });
  }

  openModal() {
    const modalRef = this.modalService.open(AddPessoaModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.pessoasService.addPessoa(result).subscribe(() => {
          this.loadPessoas();
        }, (error) => {
          console.error('Erro ao adicionar pessoa:', error);
        });
      }
    });
  }

  pageChangeEvent(event: number){
    this.p = event;
    // Recarregar a lista quando a página muda
    this.loadPessoas();
  }

  aplicarFiltros() {
    this.pessoasFiltradas = this.pessoas.filter((pessoa) => {
      return (
        pessoa.nome.toLowerCase().includes(this.filtro.nome.toLowerCase()) &&
        (this.filtro.sexo === '' || pessoa.sexo === this.filtro.sexo) &&
        (this.filtro.estadoCivil === '' || pessoa.estadoCivil === this.filtro.estadoCivil) &&
        (this.filtro.data === '' || this.compararDatas(pessoa.dtNascimento, this.filtro.data))
      );
    });
  }

  compararDatas(dataPessoa: string, dataFiltro: string): boolean {
    const dataPessoaObj = new Date(dataPessoa);
    const dataFiltroObj = new Date(dataFiltro);
    
    dataPessoaObj.setHours(0, 0, 0, 0);
    dataFiltroObj.setHours(0, 0, 0, 0);
    
    return dataPessoaObj.getTime() === dataFiltroObj.getTime();
  }
}
