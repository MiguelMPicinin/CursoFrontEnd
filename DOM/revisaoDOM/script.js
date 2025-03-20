// manipulação DOM
// criar um header -> DOM
let header = document.createElement("header");
//style do header
header.style.backgroundColor = "black";
header.style.height = "8vh";
//adicionar o header no body
document.body.appendChild(header);
document.body.style.margin = 0;
//criar uma navBar
let navBar = document.createElement("div");
navBar.classList.add("navBar");
//adicionar a navBar -> header
header.appendChild(navBar);
//preencher a navBar
let menuItens = ["Home", "About", "Products", "Contact"];
menuItens.forEach(element => {
    let a = document.createElement("a");
    a.innerText = element;
    a.classList.add("menuItens");
    navBar.appendChild(a);
});


//criar um footer
let footer = document.createElement("footer");
//style do footer
footer.style.backgroundColor = "black";
footer.style.height = "5vh";
footer.style.width = "100%";
footer.style.position = "absolute";
footer.style.bottom = 0;
//adicionar o footer no body
document.body.appendChild(footer);
//adicionar elementos no footer
let bottomNavBar = document.createElement("div");
bottomNavBar.classList.add("bottomNavBar");
//bottomNavBar -> footer
footer.appendChild(bottomNavBar);
// itens do footer
let footerItens = ["Redes Sociais", "copyRight", "Endereço"];
footerItens.forEach(element => {
    let b = document.createElement("b");
    b.innerText = element;
    b.classList.add("footerItens");
    bottomNavBar.appendChild(b);
});

