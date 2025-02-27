//Crie um formulário onde o usuário insira notas.
//Armazene essas notas em um array.
//Use o método reduce para calcular a média e exiba o resultado na tela.
const prompt = require("prompt-sync")();

let notas = []; //declarando o vetor de notas

function inserirNotas() {
    let nota = Number(prompt("Digite a Nota: "));
    notas.push(nota);
}

function Calcularmedia() {
    let media = notas.reduce((media,nota)=>media+nota)/notas.length;
    console.log("A Media é " + media);
}

function menu() {
    let continuar = true
    let operador;
    while(continuar){
        console.log("=== Sistemas de Notas ===");
        console.log("|1. Inserir Notas       |");
        console.log("|2. Calcular Média      |");
        console.log("|3. Sair                |");
        console.log("=========================");
        operador = prompt("Informe a opção");
        switch (operador) {
            case "1":
                inserirNotas();
                break;
            case "2":
                Calcularmedia();
                break
            case "3":
                continuar = false;
                console.log("Saindo...")
            default:
                console.log("Informe uma opção válida")
                break;
        } // fim do switch case
    }// fim do while
} //fim da function(Menu)

menu();