// Função de Data e Hora

let agora = new Date(); //formar um OBJETO da classe Date
console.log(agora); 
console.log(agora.toLocaleString());

// definição de um objeto da classe Date()
//para a variável agora

//Calculo com datas

let date1 = new Date("2025-01-23");
let date2 = new Date("2025-06-18");

let diferença = date2 - date1

console.log((diferença/(1000*60*60*24)));