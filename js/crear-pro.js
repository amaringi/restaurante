// Variables del formulario
const d = document;
let nameInput = d.querySelector("#productos-select"); // Corregido el typo: nameImput a nameInput
let priceInput = d.querySelector("#precio-pro");
let stockInput = d.querySelector("#stock-pro");
let descripcionInput = d.querySelector("#des-Pro"); // Corregido el selector
let btnCreate = d.querySelector(".btn-create");
let imagen = d.querySelector("#imagen-pro");
let productUpDate;

let nameUser = d.querySelector("#nombreUsuario")
let btnLogout = d.querySelector("#btnLogout")

//funcion para poner el monbre del usuario

let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"))
    nameUser.textContent = user.nombre;
}

//evento par el boton de btnLogout
btnLogout.addEventListener("click", () =>{
    localStorage.removeItem("userLogin")
    location.href = "../login.html"
})
// Agregar evento al botón
btnCreate.addEventListener("click", () => {
    let dataProduct =  getDataProduct();
    sendDataProduct(dataProduct)
});

//evento al navegador para comprovar si recargo la pagina
d.addEventListener("DOMContentLoaded", () => {
    getUser()
    productUpDate = JSON.parse( localStorage.getItem("producEdit"));
    if (productUpDate!=null) {
        updateDataPoduct ()
        
    }
})


// Crear una función para validar el formulario y obtener los datos
let getDataProduct = () => {
    // Validar el formulario
    let product;
    if (nameInput.value && priceInput.value && stockInput.value && descripcionInput.value && imagen.src) {
        product = {
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: priceInput.value,
            stock: stockInput.value,
            imagen: imagen.src
        };
        // Limpiar los campos
        nameInput.value = "";
        priceInput.value = "";
        descripcionInput.value = "";
        stockInput.value = "";
        imagen.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";

        console.log(product);
        alert("Producto creado correctamente");
    } else {
        alert("Todos los campos son obligatorios");
    }

    console.log(product);
    return product;
};

//funcion para recivir los datos a y hace la peticion
let sendDataProduct =async(data) => {
    let url = "http://localhost/backend-apiCrud/productos"
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(respuesta.status === 406){
            alert("los datos enviados no son admitidos")
            return  // para detener la ejecución si hay error en la petición
        }else{
            let mensaje = await respuesta.json()
            alert(mensaje.message)
            location.href="../listado-pro.html"
        }

    } catch (error) {
        console.log(error);
    }

}

//función para actualizar el producto
let updateDataPoduct = () => {
    //agregar los datos que vamos a editar al formulario
    nameInput.value = productUpDate.nombre;
    priceInput.value = productUpDate.precio;
    stockInput.value = productUpDate.stock;
    descripcionInput.value = productUpDate.descripcion;
    imagen.src = productUpDate.imagen;
    let product;
    //alternar los botones editar y crear
    let btnEdit = d.querySelector('.btn-update');
    btnCreate.classList.toggle("d-none")
    btnEdit.classList.toggle("d-none")

    //agregando evento al boton editar
    btnEdit.addEventListener("click", () => {
        product = {
            id: productUpDate.id,
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: priceInput.value,
            stock: stockInput.value,
            imagen: imagen.src
        };
        //borrar info de localStorage
        localStorage.removeItem("producEdit");
        //pasar los datos del producto a la funcion
        sendUptaProduct(product)
    });

}

let sendUptaProduct = async (pro)=>{
    let url = "http://localhost/backend-apiCrud/productos"
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(pro)
        })
        if(respuesta.status === 406){
            alert("los datos enviados no son admitidos")
            return  // para detener la ejecución si hay error en la petición
        }else{
            let mensaje = await respuesta.json()
            alert(mensaje.message)
            location.href="../listado-pro.html"
        }

    } catch (error) {
        console.log(error);
    }
}