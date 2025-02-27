//1.1
let titulo = document.querySelector(".titulo")
console.log(titulo)
let paragrafo = document.querySelector(".paragrafo")
console.log(paragrafo)
let botao = document.querySelector("button");
console.log(botao)

//1.2
function alterarTexto() {
    document.getElementsByClassName("titulo").innerText = "Titulo Alterado!!";
    document.getElementsByClassName("paragrafo").innerText = "Paragrafo Alterado!!";
}

// 1.3
function alterarFundo() {
    let fundo = document.querySelector("body")
    fundo.style.backgroundColor = "blue"
}