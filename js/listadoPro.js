//variable globales
let tablePro = document.querySelector("#tablePro > tbody")
let searchInput = document.querySelector("#searchInput")
let nameUser = document.querySelector("#nombreUsuario")
let btnLogout = document.querySelector("#btnLogout")

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
//evento para probae el campo buscar
searchInput.addEventListener("keyup", () =>{
    searchProductTable()
})

//evento para el navegador
document.addEventListener("DOMContentLoaded", () =>{
    getTableData()
    getUser();
})

//funcion para cargar los datos de la API BD a la tabla
let getTableData = async() =>{
    let url = "http://localhost/backend-apiCrud/productos"
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        })
        if(respuesta.status === 204){
            alert("no hay datos en la BD")
        }else{
            let tableData = await respuesta.json()
            console.log(tableData)

            //agregar los daros a localStorage para
            localStorage.setItem("datosTabla", JSON.stringify(tableData))

            //agregar los datos a la tabla
            tableData.forEach((dato, i) => {
                let row = document.createElement("tr");
            
                // Crear el contenido de la fila
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${dato.nombre}</td>
                    <td>${dato.descripcion}</td>
                    <td>${dato.precio}</td>
                    <td>${dato.stock}</td>
                    <td><img src="${dato.imagen}" width="100" /></td>
                    <td>
                        <button id="btnEdit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                            </svg>
                        </button>
                        ${nameUser.textContent == "vendedor" ? '' : `
                        <button id="btnDelete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>`}
                    </td>
                `;
            
                // Agregar la fila a la tabla
                tablePro.appendChild(row);
            });
            
        }



    } catch (error) {
        console.log(error);
    }
}

//funcio para editar productos de la tabla
let editDataTable = (pos ) => {
    let products = []
    let productsSave = JSON.parse(localStorage.getItem("datosTabla")) 
    if(productsSave !=null){
        products = productsSave
    }
    let singleProduct = products [pos]
    // console.log(singleProduct)
    localStorage.setItem("producEdit", JSON.stringify(singleProduct))
    localStorage.removeItem("datosTabla")
    location.href = "../crear-pro.html"
}

//funcio para eliminar productos de la tabla
let deleteDataTable = (pos) => {
    let products = []
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"))
    if (productsSave != null) {
        products = productsSave
    }
    let singleProduct = products[pos]
    let idProduct = {
        id: singleProduct.id
    }

    // Usar window.confirm() para mostrar un diálogo de confirmación
    let confirmar = window.confirm(`¿Deseas eliminar el producto ${singleProduct.nombre}?`)
    if (confirmar) {
        sendDeleteProduct(idProduct)
    }
}

//funcion para reaizar la peticion de eliminar un profucto
let sendDeleteProduct = async(id) => {
    let url = "http://localhost/backend-apiCrud/productos"
    try {
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(id)
        })
        if(respuesta.status === 406){
            alert("el ID en viado no es admitido")
            return  // para detener la ejecución si hay error en la petición
        }else{
            let mensaje = await respuesta.json()
            alert(mensaje.message)
            location.reload()
        }

    } catch (error) {
        console.log(error);
    }
}
//funcion par quitar productos de la taba en el buscador
let clearDataTable = () => {
    let rowTable = document.querySelectorAll("#tablePro > tbody > tr")
    //console.log(rowTable)
    rowTable.forEach(row => {
        row.remove()
    })
}
//funcion para buscar productos en la tabla
let searchProductTable = () => {
    let products = []
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"))
    if (productsSave != null) {
        products = productsSave
    }

    //obtener lo que se escrive en el buscador
    clearDataTable()
    let i = 0
    let textSearch = searchInput.value.toLowerCase()
    for (let pro of products) {
        //comprobar las conincidencias en el buscador
        if (pro.nombre.toLowerCase().indexOf(textSearch ) != -1) {

            //crear una nueva fila y agregarla a la tabla
             let row = document.createElement("tr");
            
                // Crear el contenido de la fila
                row.innerHTML = `
                    <td>${i++}</td>
                    <td>${pro.nombre}</td>
                    <td>${pro.descripcion}</td>
                    <td>${pro.precio}</td>
                    <td>${pro.stock}</td>
                    <td><img src="${pro.imagen}" width="100" /></td>
                    <td>
                        <button id="btnEdit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                            </svg>
                        </button>
                        ${nameUser.textContent == "vendedor" ? '' : `
                        <button id="btnDelete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>`}
                    </td>
                `;
            
                // Agregar la fila a la tabla
                tablePro.appendChild(row);


        }else{
            console.log("no hay nada")
        }
    }
}