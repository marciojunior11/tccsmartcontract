export interface IImoveis {
    conta: any;
    nrmatricula: number;
    nmproprietario: string;
    cpf: string;
    rg: string;
    email: string;
    telefone: string;
    celular: string;
    cep: string;
    logradouro: string;
    nrlogradouro: string;
    bairro: string;
    nmcidade: string;
    uf: string;
    nmpais: string;
    valor: number;    
}

export interface IDetalhesImoveis {
    nrmatricula: number;
    nmproprietario: string;
    cpf: string;
    rg: string;
    email: string;
    telefone: string;
    celular: string;
    cep: string;
    logradouro: string;
    nrlogradouro: string;
    bairro: string;
    nmcidade: string;
    uf: string;
    nmpais: string;
    valor: number;  
}

export type TListaImoveis = {
    data: IImoveis[];
    qtd: number;
}