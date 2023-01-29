import User from '../models/users.js';

export const save =(newUser) =>{
    const user = new User(newUser);

    return user.save();//returns promise
}

export const search = (query) => {
    const params = {...query};
    return User.find(params).exec();
}

export const get = (id) =>{
    const user = User.findById(id).exec();
    return user;
}

export const update = (updatedUser) =>{
    updatedUser.account_updated = new Date();
    const user = User.findAndUpdate(updatedUser.id, updatedUser, {new: true}).exec();
    return user;
}

export const remove = (id) =>{
    const user = User.findByIdAndDelete(id).exec();
    return user;
}