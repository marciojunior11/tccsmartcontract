// #region EXTERNAL IMPORTS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Collapse, Grid, Icon, IconButton, InputAdornment, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from 'yup';
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms"
import { useDebounce } from "../../shared/hooks";
import { ICadastroProps } from "../../shared/interfaces/views/Cadastro";
import { controllerImoveis } from "../../shared/controllers/controllerImoveis";
import { useEth } from "../../shared/contexts/ethereum";
import axios from "axios";
// #endregion

// #region INTERFACES
interface IFormData {
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
// #endregion

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
    nrmatricula: yup.number().required(),
    nmproprietario: yup.string().required(),
    cpf: yup.string().required(),
    rg: yup.string().required(),
    email: yup.string().required(),
    telefone: yup.string().required(),
    celular: yup.string().required(),
    cep: yup.string().required(),
    logradouro: yup.string().required(),
    nrlogradouro: yup.string().required(),
    bairro: yup.string().required(),
    nmcidade: yup.string().required(),
    uf: yup.string().required(),
    nmpais: yup.string().required(),
    valor: yup.number().required(),
})

export const CadastroImovel: React.FC<ICadastroProps> = ({isDialog = false, toggleOpen, selectedId, reloadDataTableIfDialog}) => {
    // #region CONTROLLERS
    // #endregion
   
    // #region HOOKS
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save, saveAndNew, saveAndClose, isSaveAndNew, isSaveAndClose } = useVForm();
    const { debounce } = useDebounce();
    // #endregion

    // #region STATES
    const [isLoading, setIsLoading] = useState(false);
    const { state: { contract, accounts } } = useEth();
    // #endregion

    // #region ACTIONS
    useEffect(() => {
    }, [id]);

    const validate = (filter: string) => {
    }

    const handleSave = async (dados: IFormData) => {

        formValidationSchema.validate(dados, { abortEarly: false })
        .then(async (dadosValidados) => {
            setIsLoading(true);
            const id = await contract.methods.getCurrentId().call();
            let conta = accounts[0];

            controllerImoveis.createURI({
                ...dadosValidados,
                conta: conta,
                id: id
            })
                .then((result) => {
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        var hash = result.hash;
                        contract.methods.criarToken(conta, result.uri).send({
                            from: conta
                        })
                            .then( async (response: any) => {
                                if (result instanceof Error) {
                                    const resDelete = controllerImoveis.deleteToken(hash);
                                    if (resDelete instanceof Error) {
                                        toast.error(resDelete.message);
                                    }
                                    toast.error(result.message);
                                } else {
                                    toast.success('Token criado com sucesso!');
                                    navigate('/imoveis');
                                } 
                            })
                    }
                })
        })

    };

    const handleDelete = (id: number) => {
    }
    // #endregion

    return (
        <LayoutBase 
            titulo={id === 'novo' ? 'Cadastrar Imóvel' : 'Editar Imóvel'}
            barraDeFerramentas={
                <DetailTools
                    mostrarBotaoSalvarFechar
                    mostrarBotaoSalvar={!isDialog}
                    mostrarBotaoSalvarNovo={id == 'novo' && !isDialog}
                    mostrarBotaoApagar={id !== 'novo' && !isDialog}
                    mostrarBotaoNovo={id !== 'novo' && !isDialog}

                    disableButtons={isLoading}

                    onClickSalvar={save}
                    onClickSalvarNovo={saveAndNew}
                    onClickSalvarFechar={saveAndClose}
                    onClickApagar={() => handleDelete(Number(id))}
                    onClickNovo={() => navigate('/paises/cadastro/novo') }
                    onClickVoltar={() => navigate('/paises') }
                />
            }
        >
            <VForm ref={formRef} onSubmit={handleSave}>
                <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                    <Grid item container xs={12} sm={10} md={8} lg={8} xl={7} direction="column" padding={2} spacing={2} alignItems="left">

                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant="indeterminate"/>
                            </Grid>
                        )}

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={5} md={4} lg={3} xl={3}>
                                <VTextField
                                    name="nrmatricula"
                                    label="Matrícula"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados do Proprietário</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <VTextField
                                    name="nmproprietario"
                                    label="Proprietário"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                <VTextField
                                    name="cpf"
                                    label="CPF"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                <VTextField
                                    name="rg"
                                    label="RG"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Informações Para Contato</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                <VTextField
                                    name="email"
                                    label="Email"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                <VTextField
                                    name="telefone"
                                    label="Telefone"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                <VTextField
                                    name="celular"
                                    label="Celular"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography variant="h6">Dados do Imóvel</Typography>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                                <VTextField
                                    name="cep"
                                    label="CEP"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={8} md={9} lg={4} xl={4}>
                                <VTextField
                                    name="logradouro"
                                    label="Logradouro"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                                <VTextField
                                    name="nrlogradouro"
                                    label="Número"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={8} md={9} lg={4} xl={4}>
                                <VTextField
                                    name="bairro"
                                    label="Bairro"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction="row" spacing={2}>
                            <Grid item xs={12} sm={10} md={5} lg={6} xl={6}>
                                <VTextField
                                    name="nmcidade"
                                    label="Cidade"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sm={2} md={2} lg={1} xl={1}>
                                <VTextField
                                    name="uf"
                                    label="UF"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                <VTextField
                                    name="nmpais"
                                    label="País"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={6} sm={5} md={4} lg={3} xl={2}>
                                <VTextField
                                    name="valor"
                                    label="Valor"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                    </Grid>

                </Box>
            </VForm>
        </LayoutBase>
    )

}