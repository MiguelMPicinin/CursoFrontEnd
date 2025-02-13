//Estruturas de Dados

// Condicionais(If Else; Switch Case)

var precoProduto = 150;

if (precoProduto>=100) {
    console.log("Valor a pagar: "+(precoProduto*0.9));
} else {
    console.log("Valor a pagar : "+(precoProduto));
}

// switch case
var mes = 2;

switch (mes) {
    case 1:
        console.log("Janeiro");
        break;
    case 2: console.log("Fevereiro");
    break;
    case 3: console.log("Março");
    break;
    case 4: console.log("Abril");
    break;
    case 5: console.log("Maio");
    break;
    case 6: console.log("Junho");
    break;
    case 7: console.log("Julho");
    break;
    case 8: console.log("Agosto");
    break;
    case 9: console.log("Setembro");
    break;
    case 10: console.log("Outubro");
    break;
    case 11: console.log("Novembro");
    break;
    case 12: console.log("Dezembro");
    break;
    default:
        console.log("Outro Mês");
        break;
}

// Estrutura de repetição (For ; While)
// For(Ponto de inicio; Ponto de parada; Incremento)
for (let i = 0; i < 10; i++) {
    console.log("Indice: "+i);
}

//while (condição de parada == false)
var continuar = true;
var numeroEscolhido = 3;
var tentaivas=0; 
while (continuar) {
    let numeroSorteado = Math.round(Math.random()*10);
    if (numeroEscolhido==numeroSorteado) {
        continuar = false
    }
    tentaivas++;
    console.log("Nº de tentativas : "+tentaivas)
}

//funções (Métodos)

function saudacao(nome) {
    return "Olá," + nome + "!!!";
}

console.log(saudacao("Miguel"));