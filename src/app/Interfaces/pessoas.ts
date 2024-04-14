import { Endereco } from "./enderecos";

export interface Pessoa {
    idpessoas: number;
    nome: string;
    sexo: string;
    dtNascimento: string;
    estadoCivil: string;
    enderecos: Endereco[];
    showAddress: boolean
}
