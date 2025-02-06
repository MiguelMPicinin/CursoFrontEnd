//Tipos de Operações em Java Script

let a = 10;
let b = 3;

console.log("Soma");
console.log(a+b); //13
console.log("Subtração");
console.log(a-b); //7
console.log("Multiplicação");
console.log(a*b); //30
console.log("Divisão");
console.log(a/b); //3.33
console.log("Resto da divisão");
console.log(a%b); //1 

// Operadores Relacionais
// ( >, >= ,< ,<= ,== ,=== )
console.log("Operadores Relacionais")
console.log(5>10); //false
console.log(10 == "10"); //true
console.log(10 === "10"); //false

// Operadores Lógicos

let nota1 = 5;
let nota2 = 8;

console.log("Operadores Lógicos");

// our (||)
console.log(nota1 >= 7 || nota2 >= 7); // verdadeiro(true)

// and (&&)
console.log(nota1 >= 7 && nota2 >= 7); //falso(false)

//not (!)
console.log(!true); //False(falso)
