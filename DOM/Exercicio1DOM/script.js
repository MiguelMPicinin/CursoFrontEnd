//1.1 -- Selecionar um elemento
let titulo = document.querySelector("#titulo") // Select by id
console.log(titulo)
let paragrafo = document.querySelector(".paragrafo") // Select by Class
console.log(paragrafo)
let botao = document.querySelector("button"); // Select by Tag
console.log(botao)

//1.2 -- Alterar Texto
function alterarTexto() {
    titulo.innerText = "Titulo Alterado!!";
    paragrafo.innerText = "Paragrafo Alterado!!";
}

// 1.3 -- Alterar cor de fundo
function alterarCorFundo() {
    let body = document.querySelector("body")
    body.style.backgroundColor = "blue"
}

//1.4 Adicionar classe
function adicionarClasse() {
    titulo.classList.add("descricao");
    let descricao = document.querySelector(".descricao");
    descricao.style.color = "red";
}