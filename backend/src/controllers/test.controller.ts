import {Request, Response, NextFunction} from "express";
import { reiniciarPedidos } from "../data/pedidos";
import { crearPedido } from "../services/pedidos.service";
import { cargarDatosIniciales } from "../services/test.service";

//POST
export const postTest = (req: Request, res: Response, next:NextFunction) => {
    try{
        reiniciarPedidos();

        return res.status(200).json({
            mensaje: "Los tests fueron reiniciados correctamente"
        })
    }catch (error){
        return next(error);
    }
};

export const postSeed = (req: Request, res: Response, next:NextFunction) => {
    try{
       
        cargarDatosIniciales();

        return res.status(201).json({
            mensaje: "Los datos fueron cargados correctamente"
        });
    }catch(error){
        return next(error);
    }
};