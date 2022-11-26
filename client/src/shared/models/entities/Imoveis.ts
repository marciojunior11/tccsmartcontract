class Imoveis {
    private nmproprietario: string;
    private cpf: string;
    private rg: string;
    private email: string;
    private telefone: string;
    private celular: string;
    private cep: string;
    private logradouro: string;
    private nrlogradouro: string;
    private bairro: string;
    private nmcidade: string;
    private uf: string;
    private nmpais: string;
    private valor: number;

    constructor(
        nmproprietario: string = "",
        cpf: string = "", 
        rg: string = "", 
        email: string = "", 
        telefone: string = "", 
        celular: string = "", 
        cep: string = "", 
        logradouro: string = "", 
        nrlogradouro: string = "",
        bairro: string = "",
        nmcidade: string = "", 
        uf: string = "", 
        nmpais: string,
        valor: number = 0
    ) {
        this.nmproprietario = nmproprietario;
        this.cpf = cpf;
        this.rg = rg;
        this.email = email;
        this.telefone = telefone;
        this.celular = celular;
        this.cep = cep;
        this.logradouro = logradouro;
        this.nrlogradouro = nrlogradouro;
        this.bairro = bairro;
        this.nmcidade = nmcidade;
        this.uf = uf;
        this.nmpais = nmpais;
        this.valor = valor;
    }
}

export default Imoveis;