// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { IconButton, Icon, LinearProgress, Grid, Typography, Box, Paper, Button, TextField } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta"
import { controllerImoveis } from "../../shared/controllers/controllerImoveis";
import { useEth } from "../../shared/contexts/ethereum";
import axios from "axios";
import { validate } from "@babel/types";
// #endregion

export const ConsultaImovel: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    // #region HOOKS
    const { state: { contract, accounts } } = useEth();
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
    // const busca = useMemo(() => {
    //     return searchParams.get('busca')?.toUpperCase() || ''; 
    // }, [searchParams]);
    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');   
    }, [searchParams]);
    // #endregion

    // #region STATES
    const [rows, setRows] = useState<any[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogTransferOpen, setIsDialogTransferOpen] = useState(false);
    const [imovel, setImovel] = useState<any | null>(null);
    const [conta, setConta] = useState("");
    const [novaConta, setNovaConta] = useState("");
    // #endregion

    // #region ACTIONS

    const reloadDataTable = () => {
      
    }

    const toggleIsDialogTransferOpen = () => {
        setIsDialogTransferOpen(oldValue => !oldValue);
    }

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setImovel({
            ...imovel,
            [name]: typeof value == 'string' ? value.toUpperCase() : value
        })
    }

    useEffect(() => {
        var mLista: any[] = [];
        setIsLoading(true);
        debounce(() => {
            controllerImoveis.getAll(accounts[0], Number(pagina))
            .then( async (result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    toast.error(result.message);
                } else {
                    for (let i = 0; i < result.data.length; i++) {
                        const hash = result.data[i].hash;
                        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
                        mLista.push({
                            ...response.data,
                            hash: hash
                        });
                    }
                    console.log(mLista);
                    setRows(mLista);
                    setQtd(result.qtd);
                }
            })
        })
    }, [pagina]);

    const handleTransfer = async (dados: any) => {
        setIsLoading(true);
        if (window.confirm('Deseja transferir o imóvel? Esta ação não pode ser desfeita.')) {
            const responseDelete = await controllerImoveis.deleteToken(imovel.hash);
            if (responseDelete instanceof Error) {
                toast.error('Erro ao atualizar o token.');
            } else {
                const tokenURI = await controllerImoveis.createURI({
                    ...imovel,
                    conta: novaConta
                });
                if (tokenURI instanceof Error) {
                    toast.error('Erro ao atualizar o token.');
                } else {
                    const responseTranfer = await contract.methods.transferirToken(conta, novaConta, imovel.id, tokenURI).send({
                        from: conta
                    });
                    setIsLoading(false);
                    toast.success('Imóvel transferido com sucesso!');
                }
            }
        }
    }

    const handleDelete = (id: number) => {

    }

    // #endregion

    // #region CONTROLLERS
    // #endregion

    const headers: IHeaderProps[] = [
        {
            align: "center",
            label: "Matrícula",
            name: "nrmatricula",  
        },        
        {
            align: "left",
            label: "Endereço",
            name: "logradouro", 
            render: (row) => {
                return (
                    `${row.logradouro}, ${row.nrlogradouro}, ${row.bairro}`
                )
            } 
        },
        {
            label: "Cidade",
            name: "nmcidade",
            render: (row) => {
                return (
                    `${row.nmcidade} - ${row.uf} - ${row.nmpais}`
                )
            }  
        },
        {
            align: "center",
            label: "Valor",
            name: "valor",
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.valor)
                )
            } 
        },
        {
            label: "Ações",
            name: ' ',
            align: "right",
            render: (row) => {
                return (
                    <>
                        <IconButton color="primary" size="small" onClick={() => {
                            console.log(row);
                            setImovel({
                                ...row,
                                nmproprietario: "",
                                cpf: "",
                                rg: "",
                                email: "",
                                telefone: "",
                                celular: ""
                            });
                            setConta(row.conta);
                            toggleIsDialogTransferOpen();
                        }}>
                            <Icon>account_balance</Icon>
                            <Icon>forward</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ]

    return (
        <LayoutBase 
            titulo={!isDialog ? "Consultar Imóveis" : ""}
            barraDeFerramentas={
                <ListTools
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => navigate('/imoveis/cadastro/novo')}
                />
            }
        >

            {isLoading && (
                <LinearProgress variant="indeterminate"/>
            )}

            <DataTable
                headers={headers}
                rows={rows}
                rowId="id"
                selectable={isDialog}  
                //isLoading={isLoading}
                page={pagina}
                rowCount={qtd}
                onPageChange={(page) => setSearchParams({ pagina: page.toString() }, { replace : true })}      
            />

            <CustomDialog
                onClose={toggleIsDialogTransferOpen}
                handleClose={toggleIsDialogTransferOpen}
                open={isDialogTransferOpen}
                title="Transferir Imóvel"
                fullWidth
                maxWidth="xl"
            >
                <Button variant="contained" onClick={handleTransfer}>
                    TRANSFERIR
                </Button>

                    <Box margin={1} display="flex" flexDirection="column" component={Paper} alignItems="center">
                        <Grid item container xs={12} sm={10} md={10} lg={9} xl={8} direction="column" padding={2} spacing={2} alignItems="left">

                            {isLoading && (
                                <Grid item>
                                    <LinearProgress variant="indeterminate"/>
                                </Grid>
                            )}

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={5} md={4} lg={3} xl={3}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.nrmatricula}
                                        onChange={handleInputChange}
                                        name="nrmatricula"
                                        label="Matrícula"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Typography variant="h6">Dados do Novo Proprietário</Typography>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <TextField
                                        value={imovel && imovel.nmproprietario}
                                        onChange={handleInputChange}
                                        name="nmproprietario"
                                        label="Proprietário"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                    <TextField
                                        value={imovel && imovel.cpf}
                                        onChange={handleInputChange}
                                        name="cpf"
                                        label="CPF"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                    <TextField
                                        value={imovel && imovel.rg}
                                        onChange={handleInputChange}
                                        name="rg"
                                        label="RG"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={conta}
                                        name="conta"
                                        label="Conta Atual"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                                    <TextField
                                        value={novaConta}
                                        onChange={e => {
                                            setNovaConta(e.target.value);
                                        }}
                                        name="novaconta"
                                        label="Nova Conta"
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
                                    <TextField
                                        value={imovel && imovel.email}
                                        onChange={handleInputChange}
                                        name="email"
                                        label="Email"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                    <TextField
                                        value={imovel && imovel.telefone}
                                        onChange={handleInputChange}
                                        name="telefone"
                                        label="Telefone"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                                    <TextField
                                        value={imovel && imovel.celular}
                                        onChange={handleInputChange}
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
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}                                        
                                        value={imovel && imovel.cep}
                                        onChange={handleInputChange}
                                        name="cep"
                                        label="CEP"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={8} md={9} lg={4} xl={4}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.logradouro}
                                        onChange={handleInputChange}
                                        name="logradouro"
                                        label="Logradouro"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.nrlogradouro}
                                        onChange={handleInputChange}
                                        name="nrlogradouro"
                                        label="Número"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={8} md={9} lg={4} xl={4}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.bairro}
                                        onChange={handleInputChange}
                                        name="bairro"
                                        label="Bairro"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Grid container item direction="row" spacing={2}>
                                <Grid item xs={12} sm={10} md={5} lg={6} xl={6}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.nmcidade}
                                        onChange={handleInputChange}
                                        name="nmcidade"
                                        label="Cidade"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} sm={2} md={2} lg={1} xl={1}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.uf}
                                        onChange={handleInputChange}
                                        name="uf"
                                        label="UF"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.nmpais}
                                        onChange={handleInputChange}
                                        name="nmpais"
                                        label="País"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6} sm={5} md={4} lg={3} xl={2}>
                                    <TextField
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                        value={imovel && imovel.valor}
                                        onChange={handleInputChange}
                                        name="valor"
                                        label="Valor"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                        </Grid>

                    </Box>              
            </CustomDialog>
        </LayoutBase>
    );
};