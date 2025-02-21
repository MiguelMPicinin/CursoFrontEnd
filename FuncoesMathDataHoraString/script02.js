// Funções de String (Texto)

var texto = "Aula de JavaScript";
console.log(texto.length); // Contar o nº de caracteres

console.log(texto.toUpperCase());  //Deixara as letras maiusculas
console.log(texto.toLowerCase()); //Tudo em letras minusculas

//manipulação de texto
console.log(texto.substring(0,4)); //Aula
console.log(texto.slice(-10)); //JavaScript
console.log(texto.replace("JavaScript" , "TypeScript"));

// Split ( usra um caracter em comum para separar em 1 vetor )

let linguagens = "JavaScript,C++,Python,Java,PHP"
let arrayLinguagens = linguagens.split(", ");
console.log(arrayLinguagens);

// Trim(tesoura)
let tesoura = "  JavaScript  "
console.log(tesoura);
console.log(tesoura.trim());