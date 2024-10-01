const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Importa o multer

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer para salvar as imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, 'public', 'imagensVeiculos');
        fs.mkdirSync(dirPath, { recursive: true }); // Cria a pasta se não existir
        cb(null, dirPath); // Define o diretório de destino
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Salva a imagem com o nome original
    }
});

const upload = multer({ storage: storage });

// Middleware para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Para servir arquivos estáticos

// Função para validar os dados do veículo
function validateVehicleData(data) {
    if (!data.nome || !data.marca) {
        return 'Nome e Marca são obrigatórios.';
    }
    return null; // Retorna null se não houver erro
}

// Rota para o formulário, agora usando upload.single() para receber a imagem
app.post('/cadastro', upload.single('imagem'), (req, res) => {
    const vehicleData = req.body;

    // Validação dos dados do veículo
    const validationError = validateVehicleData(vehicleData);
    if (validationError) {
        return res.status(400).send(validationError);
    }

    // Caminho do arquivo de template
    const templatePath = path.join(__dirname, 'public', 'template.html');

    // Carrega o template HTML
    fs.readFile(templatePath, 'utf-8', (err, template) => {
        if (err) {
            console.error('Erro ao carregar o template:', err);
            return res.status(500).send('Erro ao carregar o template');
        }

        // Substitui os placeholders com os dados reais
        let pageContent = template
            .replace(/{{nome}}/g, vehicleData.nome)
            .replace(/{{marca}}/g, vehicleData.marca)
            .replace(/{{ano}}/g, vehicleData.ano)
            .replace(/{{quilometragem}}/g, vehicleData.quilometragem)
            .replace(/{{preco}}/g, vehicleData.preco)
            .replace(/{{combustivel}}/g, vehicleData.combustivel)
            .replace(/{{condicao}}/g, vehicleData.condicao)
            .replace(/{{cambio}}/g, vehicleData.cambio)
            .replace(/{{carroceria}}/g, vehicleData.carroceria)
            .replace(/{{finalPlaca}}/g, vehicleData.finalPlaca)
            .replace(/{{cor}}/g, vehicleData.cor)
            .replace(/{{aceitaTroca}}/g, vehicleData.aceitaTroca)
            .replace(/{{imagem}}/g, `/imagensVeiculos/${req.file.filename}`); // Salva a URL da imagem no HTML

        // Define o nome do arquivo a ser salvo
        const safeNome = vehicleData.nome.replace(/\s+/g, '_');
        const safeMarca = vehicleData.marca.replace(/\s+/g, '_');
        const dirPath = path.join(__dirname, 'public', 'veiculosCadastrados');
        const newFilePath = path.join(dirPath, `${safeNome}-${safeMarca}.html`);

        // Verifica se a pasta existe, se não, cria a pasta
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Erro ao criar a pasta:', err);
                return res.status(500).send('Erro ao criar a pasta de veículos cadastrados');
            }

            // Escreve o novo arquivo com os dados substituídos
            fs.writeFile(newFilePath, pageContent, (err) => {
                if (err) {
                    console.error('Erro ao criar a página do veículo:', err);
                    return res.status(500).send('Erro ao criar a página do veículo');
                }

                res.send(`Página criada com sucesso! <a href="/veiculosCadastrados/${safeNome}-${safeMarca}.html">Ver página do veículo</a>`);
            });
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
