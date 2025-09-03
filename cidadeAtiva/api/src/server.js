import app from "./app.js";

const PORT = 3000;
const HOST = "0.0.0.0"; //Para ouvir todas as portas

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
});
