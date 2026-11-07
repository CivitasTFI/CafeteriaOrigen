import {Request, Response, NextFunction} from "express";
import { reiniciarPedidos } from "../data/pedidos";

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
}