import mongoose from 'mongoose';

const connectDB = async () =>{
    try{
        mongoose.connection.on('connected', ()=> console.log('DateBase Connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/watchnchill`)
    }
    catch(error){
        console.log(error.message);
    }
}

export default connectDB;