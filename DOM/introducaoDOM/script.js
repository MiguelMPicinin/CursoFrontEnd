function alterarTexto() {
    document.getElementById("titulo").innerText = "Texto Alterado!!";
}

// getElementById - seleção do elemento pelo ID

let titulo = document.getElementById("titulo");
// variavel comum
titulo.style.color = "blue";

//getElementsByClassName
let descricao = document.getElementsByClassName("descricao");
//variavel vetor//array
descricao[1].style.fontWeight = "Bold"; // negrito
descricao[2].style.color = "green";

//getElementsByTagName - vetor
let todosParagrafos = document.getElementsByTagName("p");
console.log(todosParagrafos.length);

//querySelector -> Primeiro Elemento
let primeiroDescricao = document.querySelector(".descricao");
primeiroDescricao.style.color = "Red";

//querySelectorAll -> Todos os Elementos -> Vetor
let ps = document.querySelectorAll("p");
ps.forEach(p => p.style.fontSize= "18px");