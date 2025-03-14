// Usar o DOM para Adicionar Um evento no HTML
document.getElementById("btnAdicionar").addEventListener("click", adicionarTarefa);

function adicionarTarefa(){
    let input = document.getElementById("tarefa");
    let texto = input.value.trim(); //pega o valor e recorta os espços em branco antes e depois

    if(texto===""){
        return ; //interrompe a Function
    }

    // continuar o código - se texto não for ""(vazio)
    let li = document.createElement("li"); //criando um elemento de lista 
    li.innerHTML = texto+'<button onclick="removerTarefa(this)">Remover</button>'; // criei o conteudo do item da lista(LI)

    let ul = document.getElementById("lista");
    ul.appendChild(li);// adicionra o item a lista
    
    input.value = "";

}

function removerTarefa(botao){ // fução do botão para remover o elemento pai(parent) (li)
    botao.parentElement.remove();
}

document.getElementById("mudarCor").addEventListener("click", function() {
    let cores = ["red", "blue", "green", "purple", "orange"];
    document.body.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
});

