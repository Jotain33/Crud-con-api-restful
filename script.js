const url = "http://localhost:8080/api/articulos/";
const contenedor = document.querySelector("tbody");
let resultados = "";

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'));
const formArticulo = document.querySelector("form");
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");
let opcion = "";

//CREAR
btnCrear.addEventListener("click", () =>{
    nombre.value = ""
    precio.value = ""
    stock.value = ""
    modalArticulo.show()
    opcion = "crear"
})

//funcion para mostrar los resultados
const mostrar = (productos) => {     //IMPORTANTE PONER EL NOMBRE DE LA TABLA DE LA BASE DE DATOS EN ESTA LINEA 
    productos.forEach(productos => { //IMPORTANTE PONER EL NOMBRE DE LA TABLA DE LA BASE DE DATOS EN ESTA LINEA 
        resultados += `
        <tr>
            <td class="text-center">${productos.id_producto}</td>
            <td class="text-center">${productos.nombre_producto}</td>
            <td class="text-center">$${productos.precio_producto}</td>
            <td class="text-center">${productos.stock_producto}</td>
            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
        </tr>
        `
    })
    contenedor.innerHTML = resultados

}  


//mostrar

fetch(url)
    .then( response => response.json())
    .then( data => mostrar(data))
    .catch( error => console.log(error))




const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}


//Procedimiento borrar
on(document, "click", ".btnBorrar", e =>{
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("El articulo sera eliminado",
    function(){
        fetch(url+id, {
            method: "DELETE"
        })
        .then( response => response.json())
        .then (()=> location.reload())

        alertify.success('Eliminado exitosamente');
    },
    function(){
        alertify.error('Cancelado');
    });
})


//Procedimiento editar
let idForm = 0

on(document, "click", ".btnEditar", e =>{
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const precioForm = fila.children[2].innerHTML
    const stockForm = fila.children[3].innerHTML
    nombre.value = nombreForm
    precio.value = precioForm
    stock.value = stockForm
    opcion = "editar"
    modalArticulo.show()
})


//Procedimiento para crear y editar
formArticulo.addEventListener("submit", (e)=>{
    e.preventDefault()
    if(opcion=="crear"){
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                nombre_producto:nombre.value,
                precio_producto:precio.value,
                stock_producto:stock.value
            })
        })
            .then( response => response.json())
            .then( data =>{
                const nuevoArticulo = []
                nuevoArticulo.push(data)
                mostrar(nuevoArticulo)
            })
    }
    if(opcion=="editar"){
        fetch(url+idForm, {
            method:"PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                nombre_producto:nombre.value,
                precio_producto:precio.value,
                stock_producto:stock.value
            })
        })
        .then( response => response.json())
        .then( response => location.reload())
    }
    modalArticulo.hide()
})