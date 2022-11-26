import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useDrawerContext } from "../shared/contexts";
import { 
    CadastroImovel,
    ConsultaImovel,
    Dashboard,
} from "../pages";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: 'home',
                path: '/home',
            },
            {
                label: 'Imóveis',
                icon: 'maps_home_work',
                path: '/imoveis',
            },
        ]);
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>

            <Route path="/imoveis" element={<ConsultaImovel/>}/>

            <Route path="/imoveis/cadastro/:id" element={<CadastroImovel/>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    );
}