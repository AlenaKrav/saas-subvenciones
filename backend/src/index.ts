import { prisma } from './bd/prisma';

import app from './app'
const start = async() => {
    try{
    // Se supone que no es necesario ya que prisma se conecta con la 1º query que lancemos, pero asi nos aseguramos de que la BD esté lista
    await prisma.$connect();
    console.log("Prisma is running")
    const port = parseInt(process.env.PORT || '8080', 10);
    app.listen({ port, host: '0.0.0.0' })
    }
    catch (error){
        console.log(error);
        process.exit(1);
    }
    console.log('Server is listening')
};

// Desconexión mas graceful
process.on('SIGINT', async() => { //se desconecta cuando hacemos uun ctrl + c
    console.log("Disconnecting Prisma...");
    await prisma.$disconnect();
    process.exit(1);
});

start()