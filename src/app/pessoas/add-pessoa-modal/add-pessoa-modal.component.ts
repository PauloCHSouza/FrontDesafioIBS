import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pessoa } from '../../Interfaces/pessoas';
import { CommonModule, formatDate } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EnderecosService } from '../../services/enderecos.service';
import { CepService } from '../../services/cep.service';
@Component({
  selector: 'app-add-pessoa-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './add-pessoa-modal.component.html',
  styleUrl: './add-pessoa-modal.component.css'
})
export class AddPessoaModalComponent {
  @Input() pessoa?: Pessoa;
  pessoaForm: FormGroup;
  showPopup = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal, 
    private fb: FormBuilder,
    private enderecosService: EnderecosService,
    private cepService: CepService,
  ) {
    this.pessoaForm = this.fb.group({
      idpessoas: [null],
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dtNascimento: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      enderecos: this.fb.array([this.createEnderecoGroup()])
    });
  }

  ngOnInit(): void {
    if (this.pessoa) {
      this.editPessoa(this.pessoa);
    }
  }

  editPessoa(pessoa: Pessoa): void {
    this.pessoaForm.patchValue({
      idpessoas: pessoa.idpessoas,
      nome: pessoa.nome,
      sexo: pessoa.sexo,
      dtNascimento: this.formatarData(pessoa.dtNascimento),
      estadoCivil: pessoa.estadoCivil
    });

    this.clearEnderecos();
    pessoa.enderecos.forEach(endereco => {
      this.addEndereco(endereco);
    });
  }

  createEnderecoGroup(endereco?: any): FormGroup {
    if (endereco) {
      return this.fb.group(endereco);
    } else {
      return this.fb.group({
        cep: [null],
        endereco: [null],
        numero: [null],
        complemento: [null],
        bairro: [null],
        cidade: [null],
        estado: [null]
      });
    }
  }

  addEndereco(endereco?: any): void {
    if (endereco) {
      this.enderecos.push(this.createEnderecoGroup(endereco));
    } else {
      this.enderecos.push(this.createEnderecoGroup());
    }
  }

  removeEndereco(index: number): void {
    const enderecosArray = this.pessoaForm.get('enderecos') as FormArray;
    const enderecoId = enderecosArray.at(index)?.value.idenderecos;

    if (enderecoId) {
      this.enderecosService.deleteEndereco(enderecoId).subscribe(
        () => {
          enderecosArray.removeAt(index);
        },
        error => {
          console.error('Erro ao deletar endereço:', error);
        }
      );
    } else {
      enderecosArray.removeAt(index);
    }
  }

  get enderecos(): FormArray {
    return this.pessoaForm.get('enderecos') as FormArray;
  }

  addPessoa(): void {
    this.markFormGroupTouched(this.pessoaForm);
    
    if (this.pessoaForm.valid) {
      const pessoaData: Pessoa = this.pessoaForm.value;
      this.activeModal.close(pessoaData);
    }
  }

  close(): void {
    this.activeModal.close();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  clearEnderecos() {
    while (this.enderecos.length !== 0) {
      this.enderecos.removeAt(0);
    }
  }

  formatarData(data: string): string {
    const dateObject = new Date(data);
    if (isNaN(dateObject.getTime())) {
      return data;
    }
    return formatDate(dateObject, 'yyyy-MM-dd', 'en-US', 'UTC');
  }

  buscarEndereco(index: number) {
    const cep = this.pessoaForm.get('enderecos')!.value[index].cep;
  
    if (cep && cep.length === 8) {
      this.cepService.getAddressByCep(cep).subscribe((result: any) => {
        if (result.success) {
          const address = result.address;
  
          this.enderecos.controls[index].patchValue({
            endereco: address.endereco,
            complemento: address.complemento,
            bairro: address.bairro,
            cidade: address.cidade,
            estado: address.estado
          });
        } else {
          this.handleAddressError('CEP não encontrado.', index);
        }
      }, error => {
        this.handleAddressError('Erro ao buscar endereço.', index);
      });
    } else {
      this.handleAddressError('O CEP informado não é valido.', index);
    }
  }

  handleAddressError(error: string, index: number) {
    this.errorMessage = `Erro ao buscar endereço para o endereço ${index + 1}: ${error}`;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.errorMessage = '';
  }
}
