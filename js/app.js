const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "USD",
    criptomoneda: "",
};

//Crear el Promise
const obtenerCriptomonedas = (criptomonedas) =>
    new Promise((resolve) => {
        resolve(criptomonedas);
    });

document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario);

    criptomonedasSelect.addEventListener("change", leerValor);
    monedaSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas() {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD";
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        ImprimirCriptomonedasSelect(criptomonedas);
    } catch (error) {
        console.log(error);
    }

}

function ImprimirCriptomonedasSelect(criptomonedas) {
    criptomonedas.forEach((criptomoneda) => {
        const {
            CoinInfo: { FullName, Name },
        } = criptomoneda;

        const criptoOption = document.createElement("option");
        criptoOption.textContent = FullName;
        criptoOption.value = Name;

        criptomonedasSelect.appendChild(criptoOption);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === "" || criptomoneda === "") {
        mostrarMensaje("Ambos campos son obligatorios");
        return;
    }

    setInterval(() => {
        cotizar();
    }, 2000);
}

function mostrarMensaje(mensaje) {
    const existe = document.querySelector(".error");
    if (!existe) {
        const alerta = document.createElement("div");
        alerta.classList.add("error");
        alerta.textContent = mensaje;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function cotizar() {
    try {
        const { criptomoneda, moneda } = objBusqueda;
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        imprimirCotizacion(resultado.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}

function imprimirCotizacion(cotizado) {
    limpiarHTML();

    const { PRICE, LASTUPDATE, CHANGEPCT24HOUR, LOWDAY, HIGHDAY } = cotizado;

    const cotizacionDiv = document.createElement("div");
    cotizacionDiv.innerHTML = `
    <p class="precio" >Precio Actual: <span>${PRICE}</span></p>
    <p>Precio mas alto en 24H: <span>${HIGHDAY}</span></p>
    <p>Precio mas bajo en 24H: <span>${LOWDAY}</span></p>
    <p>Variacion porcentual en 24H: <span>${CHANGEPCT24HOUR}%</span></p>
    <p>Ultima Actualizacion: <span>${LASTUPDATE}</span></p>
    `;

    resultado.appendChild(cotizacionDiv);
    console.log(cotizado);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
