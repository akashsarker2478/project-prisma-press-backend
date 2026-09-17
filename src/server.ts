
import app from "./app"
import { prisma } from "./lib/prisma";
import config from "./config";


const port = config.port ;

async function main(){
    try {
        await prisma.$connect();
        console.log("connected to the database successfully")

        app.listen(port,()=>{
            console.log(`server is running on port ${port}`)
        })
    } catch (error) {
        console.log("error starting the server",error)
        await prisma.$disconnect();
        process.exit(1);
    }
}

main()