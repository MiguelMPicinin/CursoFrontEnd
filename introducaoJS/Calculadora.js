var prompt = require("prompt-sync")();

// Calculadora Simples

// Funções
//soma
function soma(a,b){
    return (a+b);
}
//subtração
function subtracao(a,b) {
    return (a-b);
}
//multiplicação
function multiplicacao(a,b) {
    return (a*b);
}
//Divisão
function Divisao(a,b) {
    return (a/b);
}

function menu() {
    console.log("Escolha a operação desejada");
    console.log("1.Soma");
    console.log("2.Subtração");
    console.log("3.multiplicação");
    console.log("4.Divisão");

    let operacao = Number(prompt());
    switch (operacao) {
        case 1:
            var a = Number(prompt("Informe o 1º Numero "));    
            var b = Number(prompt("Informe o 2º Numero "));
            console.log(soma(a,b));    
            break;
        case 2:
            var a = Number(prompt("Informe o 1º Numero "));    
            var b = Number(prompt("Informe o 2º Numero "));
            console.log(Sub(a,b));    
            break;
        case 3:
            var a = Number(prompt("Informe o 1º Numero "));    
            var b = Number(prompt("Informe o 2º Numero "));
            console.log(Multi(a,b));    
            break;
        case 4:
            var a = Number(prompt("Informe o 1º Numero "));    
            var b = Number(prompt("Informe o 2º Numero "));
            if (b===0) {
                console.log("Não Dividirás por Zero ");
            } else {
                console.log(div(a,b));
            }    
            break;
        default:
            console.log("Operação Invalida")
            break;
    } 


}    

menu();