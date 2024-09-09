//variables glovaales 
const d = document;
userInput = d.querySelector('#usuarioForm');
passInput = d.querySelector('#contaForm');
btnLogin = d.querySelector(".btnLogin")

//evento al boton del formulario
btnLogin.addEventListener('click',() => {
    //alert("escrivio: "+userInput.value);
    let dataForm = getData();
    sendData(dataForm)
})

//fubcion para validar el formulario y obtener datos del formulario
let getData = () => {

    //validar el formulario
    let user;
    if (userInput.value && passInput.value){
        user = {
            usuario: userInput.value,
            contrasena: passInput.value,
        }
        userInput.value = ""
        passInput.value = ""
    }else{
        alert("usuario y contraseña obligatoria")
    }
    console.log(user)
    return user
}

//funcion para recivir los datos a y hace la peticion
let sendData =async(data) => {
    let url = "http://localhost/backend-apiCrud/login"
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(respuesta.status === 401){
            alert("Usuario y contraseña incorrectos")
            return  // para detener la ejecución si hay error en la petición
        }else{
            let userLogin = await respuesta.json()
            alert(`Bienvenido: ${userLogin.nombre}`)
            //guardar datos en localStorage
            localStorage.setItem("userLogin", JSON.stringify(userLogin))
            location.href = "../index.html"
        }

    } catch (error) {
        console.log(error);
    }

}

