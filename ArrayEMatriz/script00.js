// Arrays e Matrizes 

//Declaração de um Array  ' sempre usar virgula para separar numeros e palavras'
let dados = []; // uso de colchetes permite a declaração de uma Array

let numeros = [1,2,3,4,5,6,7,8,9];
let palavras = ["Bola", "Sapato", "Caixa"];
let mista = [1, "texto", true];

console.log(numeros.length); //medir quantidade de elementos do Array

// índices do array

//imprimir o 5º elemento de um array
console.log(numeros[4]); //sempre colocar -1 no indice de um array pois sempre começa a contar pelo 0

//adicionar elementos em um array

palavras.push("Cachorro"); // adiciona no final do array
console.log(palavras);

palavras.unshift("Prédio"); //adiciona no começo do array
console.log(palavras);

// remover elementos

palavras.pop()  //remove o ultimo elemento
palavras.shift() //remove o primeiro elemento

// forEach - repetição em um  vetor
palavras.forEach(palavra => {
    console.log(palavra);
});

// Splice

palavras.splice(1,1); //remove pelo indice remveu "sabato"
console.log(palavras)

let numerosDobro = numeros.map(x => x*10);
console.log(numerosDobro)