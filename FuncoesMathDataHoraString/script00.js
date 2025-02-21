// funções matematicas

//Sqrt //Pow
//raiz quadrada de 25 
console.log(Math.sqrt(25));  //5

//potência
console.log(Math.pow(3,2)); //3² = 9
console.log(Math.pow(4,3)); //4³ = 64
console.log(Math.pow(27,1/3)); //27^(1/3) = 3

// Arredondamento 
//Math.round = irá arredondar para o mais proximo
console.log(Math.round(4.4)); // 4
console.log(Math.round(4.7)); // 5
//Math.floor (para baixo)
console.log(Math.floor(4.9)); // 4
//Math.ceil (para cima)
console.log(Math.ceil(4.1)) // 5

//Números Aleatórios
console.log(Math.random()); // Sorteio numeros de 0 -> 1

console.log(Math.ceil(Math.random()*100)); //Sorteio entre 0 -> 100 ->inteiros

console.log(Math.floor(Math.random()*100)) //sorteio de 0 -> 99

// 1 -> 10000
console.log(Math.ceil(Math.random()*10000));
// 1 ->99990
console.log(Math.floor(Math.random()*10000));
//0 -> 50
console.log(Math.round(Math.random()*50));
//50 -> 100
console.log(Math.round(Math.random()*50+50));

//Valor Maximo, Minimo e Absoluto 
var numeros = [0,1,2,3,4,5,6,7,8,9]; //array

console.log(Math.max(numeros)); // retorna o  maior numero da sequencia (9)
console.log(Math.min(numeros)); //menor numero da sequencia (0)
var absoluto = -10;
console.log(Math.abs(absoluto)); //ira converter os numeros negativos em positivos e se positivo mantem (retorna-ra 10) ou modulo do numero

