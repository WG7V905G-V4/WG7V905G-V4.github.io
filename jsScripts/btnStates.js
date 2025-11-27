


const mainBtn = document.getElementById("main-btn");


export function btnState(names, able, state) {
    const nameArray = Array.isArray(names) ? names : [names];

    for (let name of nameArray){
        if (name===mainBtn) name.textContent = state;
        name.disabled = !able;
    }
}

export function btnHandler(name, handler) {
    name.onclick = null;
    name.onclick = handler;
}

