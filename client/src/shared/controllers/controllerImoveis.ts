import axios from 'axios';
import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IImoveis } from '../interfaces/entities/IImoveis';



const getAll = async (conta: string, page?: number): Promise<any | Error> => {
    try {
        const { data } = await Api.get(`/api/imoveis/?page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&_conta=${conta}`);
        if (data) {
            return data;
        }
    } catch(error) {
        return new Error((error as {message: string}).message || 'Erro ao buscar registros');
    }
}

// const getOne = async (id: number): Promise<any | Error> => {

// }



const createURI = async (dados: any): Promise<any | Error> => {
    try {
        console.log(dados);
        const { data } = await Api.post('/api/imoveis', dados);
        return data;
    } catch(error) {
        return new Error((error as {message: string}).message || 'Erro ao criar o token');
    }
}

const updateToken = async (dados: any, hash: string): Promise<void | Error> => {
    try {

    } catch(error) {
        return new Error((error as {message: string}).message || 'Erro ao atualizar o token');
    }

}

const deleteToken = async (hash: any): Promise<void | Error> => {
    try {
        await Api.delete(`/api/imoveis/${hash}`)
    } catch(error) {
        return new Error((error as {message: string}).message || 'Erro ao atualizar o token');
    }
}

// const validate = async (filter: string): Promise<boolean | Error> => {
//     return true;
// }

export const controllerImoveis = {
    getAll,
    createURI,
    updateToken,
    deleteToken
}