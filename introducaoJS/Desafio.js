var prompt = require("prompt-sync")();
// Idade
var idade = Number(prompt("Digite a sua idade: "))

// if encadeado
if (idade<=17) {
    console.log("Você é menor de idade");
} else if (idade>=18 && idade<60) {
    console.log("Você é Adulto(a)");
} else{
    console.log("Você é Idoso")
}


// Tabuada do 5

for (let i = 1; i <= 10; i++) {
    console.log("5 X" + i + "=" + (i*5));
}

// Numeros Pares

for (let i = 1; i <= 20; i++) {
    if ((i%2)==0) {
        console.log(i +" é par")
    }    
}