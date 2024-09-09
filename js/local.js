//variable globales 
const d= document;
let nameUser = d.querySelector("#nombreUsuario")
let btnLogout = d.querySelector("#btnLogout")

//funcion para poner el monbre del usuario
d.addEventListener("DOMContentLoaded", () => {
    getUser();
})
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"))
    nameUser.textContent = user.nombre;
}

//evento par el boton de btnLogout
btnLogout.addEventListener("click", () =>{
    localStorage.removeItem("userLogin")
    location.href = "../login.html"
})