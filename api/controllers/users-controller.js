import { response } from 'express';
import req from 'express/lib/request.js';
import * as userService from '../services/users-service.js'

const setErrorResponse = (error, response) => {
    response.status(500);
    response.json(error);
}

const setSuccessResponse = (obj, response) => {
    response.status(200);
    response.json(obj);
}

export const post = async (request,response) =>{
    try{
        const payload = request.body;

        const user = await userService.save(payload);  
        
        setSuccessResponse(user,response);

    }catch(error){
        setErrorResponse(error, response);
    }
    

}

export const index = async(request, response) =>{
    try{

        const firstName = request.query.firstName;
        const lastName = request.query.lastName;
        const query = {};

        if(firstName){
            query.firstName = firstName;
        }

        if(lastName){
            query.lastName = lastName;
        }

        const users = await userService.search(query);
        setSuccessResponse(user,response);

    }catch(error){
        setErrorResponse(error, response);
    }
}

export const get = async (request,response) =>{
    try{
        const id = request.params.id;
        const user = await userService.get(id);
        setSuccessResponse(user, response);
    }catch(error){
        setSuccessResponse(error, response);
    }
}

export const update = async (request,response) =>{
    try{
        const id = request.params.id;
        const updated = {...request.body}
        updated.id = id;
        const user = await userService.update(updated);
        setSuccessResponse(user, response);
    }catch(error){
        setSuccessResponse(error, response);
    } 
}

export const remove = async (request,response) =>{
    try{
        const id = request.params.id;
        const user = await userService.remove(id);
        setSuccessResponse({message: `successfully removed ${id}`}, response);
    }catch(error){
        setSuccessResponse(error, response);
    }
}