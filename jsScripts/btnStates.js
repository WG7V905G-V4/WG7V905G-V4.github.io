import {genColor} from "./ballgeneration.js";


const button = document.querySelectorAll('button');
button.forEach(button => {
    let prevHue = null
    button.addEventListener("mouseover", ()=>{
        const [hue, saturation] = genColor(prevHue);
        prevHue = hue;
        if(!button.disabled) {
            button.style.backgroundColor = `hsl(${hue}, ${saturation-10}%, 50%)`;
            button.style.color = `#fff`;
        }
    });

    button.addEventListener("mouseout", ()=> {
        button.style.backgroundColor = "";
        button.style.color = "";
    });

})



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

