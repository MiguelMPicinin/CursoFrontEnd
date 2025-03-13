//Exemplo de Script para manipulação DOM

function clickBtn() {
    //manipulação pelo ID -> Variável do tipo Simples
    let titulo = document.getElementById('titulo');
    console.log(titulo);
    titulo.innerText = "Meu Título Modificado";
    let li = document.createElement('li');
    let Texto ="Modificado Texto do Titulo"
    li.innerHTML = Texto+'<button onclick="btnConfere(this)">Confere</button>';
    //querySelector -> Variável Simples
    document.querySelector(".lista").appendChild(li);
    //getElementsByClassName -> vetor .descricao
    let descricao = document.querySelectorAll('.descricao');
    console.log(descricao);
    descricao.forEach(element => element.style.color = "red");
    Texto = "Modificado a Cor da Classe descricao Para Vermelho";
    li.innerHTML = Texto+'<button onclick="btnConfere(this)">Confere</button>';
    document.querySelector(".lista").appendChild(li);
}

