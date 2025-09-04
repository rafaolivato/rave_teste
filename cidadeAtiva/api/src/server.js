import app from "./app.js";
import process from 'process';

const HOST = process.env.SERVER_HOST; //3000;
const PORT = process.env.SERVER_PORT; //"0.0.0.0"; //Para ouvir todas as portas
const HORA = new Date();

app.get('/', (req, res) => {
    res.send(`🚀 Servidor rodando em ${HOST}:${PORT} - ${HORA.toLocaleString()}`)
})


app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em ${HOST}:${PORT}`);
});
