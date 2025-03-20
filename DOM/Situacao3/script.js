
document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let Nome = document.getElementById("Nome").value.trim();
    let Email = document.getElementById("Email").value.trim();
    let Senha = document.getElementById("Senha").value.trim();
    let Telefone = document.getElementById("Telefone").value.trim();
    let Idade = document.getElementById("Idade").value.trim();
    let mensagem = document.getElementById("mensagem");


    if (Nome === "" || Email === "" || Senha === "" || Telefone ==="" || Idade ==="") {
        mensagem.innerText = "Todos os campos são obrigatórios!";
        mensagem.style.color = "red";
    } else {
        mensagem.innerText = "Cadastro realizado com sucesso!";
        mensagem.style.color = "green";
    }
});


