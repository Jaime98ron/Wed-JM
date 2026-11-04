/* ==================================================
   ELEMENTOS
================================================== */

const startButton =
    document.getElementById("startButton");

const invitationContent =
    document.getElementById("invitationContent");

// Bloquea el desplazamiento hasta que se abra la invitación.
// document.documentElement.classList.add("scroll-locked"); (COMENTADO PARA PRUEBAS)

window.addEventListener("pageshow", () => {
    if (document.documentElement.classList.contains("scroll-locked")) {
        window.scrollTo(0, 0);
    }
});


/* ==================================================
   ABRIR INVITACIÓN
================================================== */

let invitacionAbierta = false;

startButton.addEventListener("click", () => {
    if (invitacionAbierta) return;
    invitacionAbierta = true;
    document.documentElement.classList.remove("scroll-locked");

    invitationContent.scrollIntoView({
        behavior: "smooth"
    });

    const ocultarPortada = () => {
        if (document.body.classList.contains("started")) return;

        const root = document.documentElement;
        const scrollBehaviorOriginal = root.style.scrollBehavior;

        root.style.scrollBehavior = "auto";
        document.body.classList.add("started");
        window.scrollTo(0, 0);

        requestAnimationFrame(() => {
            root.style.scrollBehavior = scrollBehaviorOriginal;
        });
    };

    document.addEventListener("scrollend", ocultarPortada, {
        once: true
    });

    // Respaldo para navegadores que no disparen "scrollend".
    setTimeout(ocultarPortada, 1800);
});
/* ==================================================
   ANIMACIONES
================================================== */

const revealElements =
    document.querySelectorAll(
        ".section-inner, .countdown-content, .rsvp-card, .closing-content, .hero-image, .countdown-image, .rsvp-image"
    );


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal");
                } else {
                    entry.target.classList.remove("reveal");
                }

            });

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach((element) => {

    observer.observe(element);

});


/* ==================================================
   CUENTA REGRESIVA
================================================== */

const weddingDate =
    new Date("2027-05-29T19:00:00-06:00");


function updateCountdown() {

    const now = new Date();

    const difference =
        weddingDate.getTime() -
        now.getTime();


    if (difference <= 0) {

        document.getElementById("days").textContent = "000";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;

    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference /
                (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (difference /
                (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (difference / 1000) % 60
        );


    document.getElementById("days").textContent =
        String(days).padStart(3, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* ==================================================
   ELEMENTOS RSVP
================================================== */

const rsvpForm =
    document.getElementById("rsvpForm");

const guestCode =
    document.getElementById("guestCode");

const guestInfo =
    document.getElementById("guestInfo");

const attendanceButtons =
    document.querySelectorAll(
        ".attendance-button"
    );

const attendanceInput =
    document.getElementById("attendance");

const companions =
    document.getElementById("companions");

const companionsInfo =
    document.getElementById("companionsInfo");

const companionsFields =
    document.getElementById("companionsFields");

const rsvpMessage =
    document.getElementById("rsvpMessage");

const confirmButton =
    document.querySelector(".confirm-button");


/* ==================================================
   SELECTOR PERSONALIZADO DE ACOMPAÑANTES
================================================== */

const companionsTrigger =
    document.getElementById("companionsTrigger");

const companionsSelected =
    document.getElementById("companionsSelected");

const companionsOptions =
    document.getElementById("companionsOptions");

const companionsCustomButtons =
    companionsOptions.querySelectorAll("[data-value]");


function actualizarSelectorPersonalizado() {

    const opcionSeleccionada =
        companions.options[companions.selectedIndex];

    companionsSelected.textContent =
        opcionSeleccionada.textContent.trim();

    companionsTrigger.disabled =
        companions.disabled;

    companionsCustomButtons.forEach((button) => {

        const opcionNativa =
            Array.from(companions.options).find(
                option => option.value === button.dataset.value
            );

        const estaSeleccionada =
            button.dataset.value === companions.value;

        button.disabled =
            !opcionNativa ||
            opcionNativa.hidden ||
            companions.disabled;

        button.setAttribute(
            "aria-selected",
            String(estaSeleccionada)
        );

    });

    if (companions.disabled) {
        cerrarSelectorPersonalizado();
    }

}


function abrirSelectorPersonalizado() {

    if (companions.disabled) return;

    actualizarSelectorPersonalizado();

    companionsOptions.hidden = false;

    companionsTrigger.setAttribute(
        "aria-expanded",
        "true"
    );

}


function cerrarSelectorPersonalizado() {

    companionsOptions.hidden = true;

    companionsTrigger.setAttribute(
        "aria-expanded",
        "false"
    );

}


companionsTrigger.addEventListener("click", () => {

    const estaAbierto =
        companionsTrigger.getAttribute("aria-expanded") === "true";

    if (estaAbierto) {
        cerrarSelectorPersonalizado();
    } else {
        abrirSelectorPersonalizado();
    }

});


companionsCustomButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if (button.disabled) return;

        companions.value = button.dataset.value;

        cerrarSelectorPersonalizado();

        companions.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        actualizarSelectorPersonalizado();

    });

});


document.addEventListener("click", (event) => {

    if (!document.getElementById("companionsCustom").contains(event.target)) {
        cerrarSelectorPersonalizado();
    }

});


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        cerrarSelectorPersonalizado();
    }

});


/* ==================================================
   GOOGLE APPS SCRIPT
================================================== */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbydG9QEwwtpctgDSS7hqz0PUfBLybL8VSFwSZwVTEKe1lnDG62RQbjpXQxx9qoE0Lch3g/exec";


/* ==================================================
   DATOS DEL INVITADO
================================================== */

let guestData = null;
let consultaInvitadoActual = 0;
let ultimoCodigoSolicitado = "";
let temporizadorConsultaCodigo = null;


/* ==================================================
   CREAR CAMPOS DE ACOMPAÑANTES
================================================== */

function crearCamposAcompanantes(
    cantidad,
    nombres = []
) {

    companionsFields.innerHTML = "";

    if (Number(cantidad) <=0) {
        return;
    }


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const numero =
            i + 1;


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "companion-field";


        const label =
            document.createElement("label");


        label.setAttribute(
            "for",
            `acompanante${numero}`
        );


        label.textContent =
            cantidad === 1
                ? "Nombre del acompañante"
                : `Nombre del acompañante ${numero}`;


        const input =
            document.createElement("input");


        input.type =
            "text";


        input.id =
            `acompanante${numero}`;


        input.name =
            `acompanante${numero}`;


        input.placeholder =
            "Nombre completo";


        input.autocomplete =
            "name";


        input.required =
            true;


        input.value =
            nombres[i] || "";


        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value.replace(
                        /^\s+/,
                        ""
                    );

            }
        );


        wrapper.appendChild(
            label
        );


        wrapper.appendChild(
            input
        );


        companionsFields.appendChild(
            wrapper
        );

    }

}


/* ==================================================
   OBTENER NOMBRES
================================================== */

function obtenerNombresAcompanantes() {

    const nombres = [];


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const input =
            document.getElementById(
                `acompanante${i}`
            );


        nombres.push(
            input
                ? input.value.trim()
                : ""
        );

    }


    return nombres;

}


/* ==================================================
   LIMPIAR RSVP
================================================== */

function resetRSVP() {

    guestData = null;

    attendanceInput.value = "";

    companions.value = "0";

    companions.disabled = false;


    attendanceButtons.forEach(
        (button) => {

            button.classList.remove(
                "selected"
            );

        }
    );


    companionsFields.innerHTML = "";


    Array.from(
        companions.options
    ).forEach(
        (option) => {

            option.hidden = false;

        }
    );


    guestInfo.textContent =
        "Ingresa tu código de invitación.";


    companionsInfo.textContent =
        "Primero ingresa tu código de invitación.";


    rsvpMessage.textContent = "";

    actualizarSelectorPersonalizado();


    if (confirmButton) {

        confirmButton.textContent =
            "Confirmar asistencia";

    }

}


/* ==================================================
   CÓDIGO DE INVITACIÓN
================================================== */

guestCode.addEventListener("input", () => {
    guestCode.value = guestCode.value
        .toUpperCase()
        .replace(/\s/g, "");

    consultaInvitadoActual += 1;
    ultimoCodigoSolicitado = "";
    clearTimeout(temporizadorConsultaCodigo);
    guestData = null;
    attendanceInput.value = "";
    companions.value = "0";
    companions.disabled = false;
    companionsFields.innerHTML = "";

    attendanceButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    actualizarSelectorPersonalizado();

    if (confirmButton) {
        confirmButton.textContent = "Confirmar asistencia";
    }

    rsvpMessage.textContent = "";

    if (guestCode.value.length === 7) {
        temporizadorConsultaCodigo = setTimeout(
            consultarInvitado,
            350
        );
    } else if (guestCode.value.length > 0) {
        guestInfo.textContent = "La búsqueda se activa al completar el código o al salir del campo.";
    } else {
        guestInfo.textContent = "Ingresa tu código de invitación.";
        companionsInfo.textContent =
            "Primero ingresa tu código de invitación.";
    }
});

/* ==================================================
   SELECCIÓN DE ASISTENCIA
================================================== */

attendanceButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                attendanceButtons.forEach(
                    (item) => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                attendanceInput.value =
                    button.dataset.response;


                if (
                    attendanceInput.value ===
                    "No podré asistir"
                ) {

                    companions.value =
                        "0";


                    companions.disabled =
                        true;


                    companionsFields.innerHTML =
                        "";


                    companionsInfo.textContent =
                        "No se registrarán acompañantes.";

                } else {

                    companions.disabled =
                        false;


                    updateCompanionLimit();

                }

            }
        );

    }
);


/* ==================================================
   ACTUALIZAR LÍMITE
================================================== */

function updateCompanionLimit() {

    if (!guestData) {

        companionsInfo.textContent =
            "Primero ingresa tu código de invitación.";

        return;

    }


    const lugares =
        Number(
            guestData.lugares
        );


    const maxAcompanantes =
        Math.max(
            lugares - 1,
            0
        );


    Array.from(
        companions.options
    ).forEach(
        (option) => {

            const value =
                Number(option.value);


            option.hidden =
                value > maxAcompanantes;

        }
    );


    if (
        Number(companions.value) >
        maxAcompanantes
    ) {

        companions.value =
            String(maxAcompanantes);

    }


    companionsInfo.textContent =
        `Esta invitación tiene ${lugares} ${
            lugares === 1 ? "lugar disponible" : "lugares disponibles"
        }.`;


    crearCamposAcompanantes(
        Number(companions.value),
        obtenerNombresAcompanantes()
    );

}

actualizarSelectorPersonalizado();


/* ==================================================
   CAMBIO DE CANTIDAD DE ACOMPAÑANTES
================================================== */

companions.addEventListener(
    "change",
    () => {

        const cantidad =
            Number(
                companions.value
            );


        crearCamposAcompanantes(
            cantidad
        );

        actualizarSelectorPersonalizado();

    }
);


/* ==================================================
   MOSTRAR RESPUESTA EXISTENTE
================================================== */

function mostrarRespuestaExistente() {

    if (!guestData) {
        return;
    }


    const asistencia =
        guestData.asistencia;


    if (
        asistencia ===
            "Sí, estaré ahí" ||
        asistencia ===
            "No podré asistir"
    ) {

        const acompanantesRegistrados =
            Number(
                guestData.acompanantes || 0
            );


        const nombres = [

            guestData.acompanante1 || "",

            guestData.acompanante2 || "",

            guestData.acompanante3 || "",

            guestData.acompanante4 || ""

        ];


        const personasRegistradas =
            asistencia ===
                "Sí, estaré ahí"

                ? 1 + acompanantesRegistrados

                : 0;


        guestInfo.innerHTML =
            `<strong>${guestData.nombre}</strong><br>
             <span class="already-registered">
             ✓ Ya registraste tu asistencia.
             </span><br>
             Tu respuesta:
             <strong>${asistencia}</strong>`;


        if (
            asistencia ===
            "Sí, estaré ahí"
        ) {

            companions.disabled =
                false;


            companions.value =
                String(
                    acompanantesRegistrados
                );


            updateCompanionLimit();


            crearCamposAcompanantes(
                acompanantesRegistrados,
                nombres
            );


            companionsInfo.textContent =
                `Personas registradas: ${personasRegistradas}. Puedes actualizar tu respuesta si lo necesitas.`;

        } else {

            companions.value =
                "0";


            companions.disabled =
                true;


            companionsFields.innerHTML =
                "";


            companionsInfo.textContent =
                "Actualmente indicaste que no podrás asistir. Puedes actualizar tu respuesta si cambias de opinión.";

        }


        attendanceButtons.forEach(
            (button) => {

                if (
                    button.dataset.response ===
                    asistencia
                ) {

                    button.classList.add(
                        "selected"
                    );

                }

            }
        );


        if (confirmButton) {

            confirmButton.textContent =
                "Actualizar respuesta";

        }


        return;

    }


    const lugares =
        Number(guestData.lugares);

    guestInfo.innerHTML =
        `<strong>${guestData.nombre}</strong><br>
        Tienes <strong>${lugares}</strong>
        ${lugares === 1 ? "lugar disponible" : "lugares disponibles"}.`;


    companions.value =
        "0";


    companions.disabled =
        false;


    companionsFields.innerHTML =
        "";


    updateCompanionLimit();


    if (confirmButton) {

        confirmButton.textContent =
            "Confirmar asistencia";

    }

}


/* ==================================================
   CONSULTAR INVITADO
================================================== */

function consultarInvitado() {
    const codigo = guestCode.value.trim();

    if (!codigo) {
        consultaInvitadoActual += 1;
        ultimoCodigoSolicitado = "";
        resetRSVP();
        actualizarSelectorPersonalizado();
        return;
    }

    if (codigo === ultimoCodigoSolicitado) return;

    ultimoCodigoSolicitado = codigo;
    const consultaId = ++consultaInvitadoActual;

    guestInfo.textContent = "Verificando invitación...";
    companionsInfo.textContent = "Consultando lugares disponibles...";

    const callbackName =
        "respuestaInvitado_" + Date.now() + "_" + consultaId;
    const script = document.createElement("script");
    let timeoutId;

    const limpiarConsulta = () => {
        clearTimeout(timeoutId);
        delete window[callbackName];

        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };

    const consultaSigueVigente = () =>
        consultaId === consultaInvitadoActual &&
        guestCode.value.trim() === codigo;

    window[callbackName] = function(data) {
        limpiarConsulta();
        if (!consultaSigueVigente()) return;

        if (data && data.success) {
            guestData = data;
            mostrarRespuestaExistente();
            return;
        }

        guestData = null;
        ultimoCodigoSolicitado = "";
        guestInfo.textContent =
            (data && data.error) || "No encontramos ese código.";
        companions.value = "0";
        companions.disabled = true;
        companionsFields.innerHTML = "";
        companionsInfo.textContent = "Verifica que el código sea correcto.";
        actualizarSelectorPersonalizado();
    };

    script.src =
        GOOGLE_SCRIPT_URL +
        "?action=buscar" +
        "&id=" + encodeURIComponent(codigo) +
        "&prefix=" + callbackName;

    script.onerror = function() {
        limpiarConsulta();
        if (!consultaSigueVigente()) return;

        guestData = null;
        ultimoCodigoSolicitado = "";
        guestInfo.textContent =
            "No pudimos verificar el código. Intenta nuevamente.";
        companions.value = "0";
        companions.disabled = true;
        companionsFields.innerHTML = "";
        companionsInfo.textContent = "Verifica que el código sea correcto.";
        actualizarSelectorPersonalizado();
    };

    timeoutId = setTimeout(() => {
        limpiarConsulta();
        if (!consultaSigueVigente()) return;

        guestData = null;
        ultimoCodigoSolicitado = "";
        guestInfo.textContent =
            "La consulta tardó demasiado. Intenta nuevamente.";
        companions.value = "0";
        companions.disabled = true;
        companionsFields.innerHTML = "";
        companionsInfo.textContent = "No se pudo consultar la invitación.";
        actualizarSelectorPersonalizado();
    }, 10000);

    document.body.appendChild(script);
}

/* ==================================================
   CONSULTAR AL SALIR DEL CAMPO
================================================== */

guestCode.addEventListener("blur", () => {
    clearTimeout(temporizadorConsultaCodigo);
    consultarInvitado();
});

guestCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        clearTimeout(temporizadorConsultaCodigo);
        consultarInvitado();
    }
});

/* ==================================================
   ENVIAR FORMULARIO
================================================== */

rsvpForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!guestData) {

            rsvpMessage.textContent =
                "Primero ingresa un código de invitación válido.";

            guestCode.focus();

            return;

        }


        if (!attendanceInput.value) {

            rsvpMessage.textContent =
                "Por favor selecciona si nos acompañarás.";

            return;

        }


        const numeroAcompanantes =
            Number(
                companions.value
            );


        const lugaresPermitidos =
            Number(
                guestData.lugares
            );


        const totalPersonas =
            attendanceInput.value ===
            "Sí, estaré ahí"

                ? 1 + numeroAcompanantes

                : 0;


        if (
            totalPersonas >
            lugaresPermitidos
        ) {

            rsvpMessage.textContent =
                `Esta invitación tiene solamente ${lugaresPermitidos} ${
        lugaresPermitidos === 1 ? "lugar disponible" : "lugares disponibles"}.`;

            return;

        }


        const nombres =
            obtenerNombresAcompanantes();


        /* ------------------------------------------
           VALIDAR NOMBRES
        ------------------------------------------ */

        if (
            attendanceInput.value ===
            "Sí, estaré ahí"
        ) {

            for (
                let i = 0;
                i < numeroAcompanantes;
                i++
            ) {

                if (
                    !nombres[i]
                ) {

                    rsvpMessage.textContent =
                        `Escribe el nombre del acompañante ${i + 1}.`;

                    const input =
                        document.getElementById(
                            `acompanante${i + 1}`
                        );


                    if (input) {

                        input.focus();

                    }

                    return;

                }

            }

        }


        /* ------------------------------------------
           PREPARAR DATOS
        ------------------------------------------ */

        const datos =
            new URLSearchParams();


        datos.append(
            "id",
            guestCode.value.trim()
        );


        datos.append(
            "asistencia",
            attendanceInput.value
        );


        datos.append(
            "acompanantes",
            numeroAcompanantes
        );


        datos.append(
            "acompanante1",
            nombres[0]
        );


        datos.append(
            "acompanante2",
            nombres[1]
        );


        datos.append(
            "acompanante3",
            nombres[2]
        );


        datos.append(
            "acompanante4",
            nombres[3]
        );


        rsvpMessage.textContent =
            "Registrando tu respuesta...";


        if (confirmButton) {

            confirmButton.disabled =
                true;

        }


        /* ------------------------------------------
           ENVIAR
        ------------------------------------------ */

        try {

            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

                    mode: "no-cors",

                    body: datos

                }
            );


            const personas =
                attendanceInput.value === "Sí, estaré ahí"
                    ? 1 + numeroAcompanantes
                    : 0;

            rsvpMessage.textContent =
                `¡Gracias, ${guestData.nombre}! Tu respuesta fue enviada para ${personas} ${
                    personas === 1 ? "persona" : "personas"
                }.`;

            if (confirmButton) {
                confirmButton.textContent = "Volver a enviar";
            }


        } catch (error) {

            console.error(error);


            rsvpMessage.textContent =
                "No se pudo enviar la respuesta. Intenta nuevamente.";

        } finally {

            if (confirmButton) {

                confirmButton.disabled =
                    false;

            }

        }

    }
);



