import { error } from "node:console";
import app from './app'
const start = async() => {
    try{
    app.listen({port: 8080})
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }
    console.log(`Server is listening`)
}

start()