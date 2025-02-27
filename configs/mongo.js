'use strict';

import mongoose from "mongoose";

export const dbConnection = async () => {
    try{
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | No se pudo conectar a MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('Conectando', ()=>{
            console.log('MongoDB | Intenta conectarte');
        });
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | Conectado a MongoDB');
        });
        mongoose.connection.on('open', ()=>{
            console.log('MongoDB | Conectado a database');
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconectado a MongoDB');
        });
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | desconectado');
        });
        mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    }catch(error){
        console.log('La conexión a la base de datos falló', error);
    }
}