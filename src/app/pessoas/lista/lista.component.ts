import { Component } from '@angular/core';
import { PessoasService } from '../../services/pessoas.service';
import { CommonModule } from '@angular/common';
import { Pessoa } from '../../Interfaces/pessoas';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddPessoaModalComponent } from '../add-pessoa-modal/add-pessoa-modal.component';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
  pessoas: Pessoa[] = [];

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
      },
      (error) => {
        console.error('Erro ao carregar pessoas:', error);
      }
    );
  }

  isAniversario(dataNascimento: string, nome: string): boolean {
    const today = new Date();
    const birthDate = new Date(dataNascimento);
  
    const birthDateUTC = new Date(
        Date.UTC(birthDate.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate())
    );
  
    birthDateUTC.setUTCHours(0, 0, 0, 0);
  
    const isSameMonthAndDay = today.getUTCMonth() === birthDateUTC.getUTCMonth() && today.getUTCDate() === birthDateUTC.getUTCDate();
  
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
}
