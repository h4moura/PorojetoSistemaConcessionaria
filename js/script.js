document.getElementById('vehicleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        nome: document.getElementById('nomeVeiculo').value,
        marca: document.getElementById('marcaVeiculo').value,
        ano: document.getElementById('anoVeiculo').value,
        quilometragem: document.getElementById('quilometragemVeiculo').value,
        preco: document.getElementById('precoVeiculo').value,
        combustivel: document.getElementById('combustivelVeiculo').value,
        condicao: document.getElementById('condicaoVeiculo').value,
        cambio: document.getElementById('cambioVeiculo').value,
        carroceria: document.getElementById('carroceriaVeiculo').value,
        finalPlaca: document.getElementById('finalPlaca').value,
        cor: document.getElementById('corVeiculo').value,
        aceitaTroca: document.getElementById('aceitaTroca').value,
    };

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
