var prompt = require("prompt-sync")();
// Exercicio 1 - Imapar ou Par
var numero = Number(prompt("Informe um Número:"));

if ((numero%2)==0) {
    console.log("O nº é par");
} else {
    console.log("O nº é impar");
}

// Exercicio 2 - Laço For

for (let i = 1; i <= 100; i++){
    console.log(i);    
}
