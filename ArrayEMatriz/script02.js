// Operações Avançadas em Vetores (arrays)

// filtros

let numeros = [10, 20, 30, 40, 50];

let numMaior20 = numeros.filter(x => x > 20);
console.log(numMaior20);

//reduce
let soma = numeros.reduce((acumulador, valorAtual) => acumulador + valorAtual,0);
console.log(soma); //150