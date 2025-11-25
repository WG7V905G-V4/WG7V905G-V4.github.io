export function btnState(names, able, text=null, options={}) {
    const disabledColor = "#333";
    const activeColor = "#dadada";

    const defaultTexts= {
        "main-btn":"start game",
        "increment":"+",
        "decrement":"-"
    };
    const nameArray = Array.isArray(names) ? names : [names];
    for (let name of nameArray){



        const defText = text || defaultTexts[name.id] || "default text";




        const defaults = {
            disabled: !able,
            bg: able ? activeColor : disabledColor,
            color: able ? disabledColor : activeColor,
            filter: "blur(0px)"
        };

        const {disabled, bg, color, filter} = {...defaults, ...options}

        name.textContent = defText;
        name.classList.toggle("disabled", disabled);
        name.style.pointerEvents = disabled ? "none" : "auto";
        name.style.background = bg;
        name.style.color = color;
        name.style.filter = filter;
    }
}

export function btnHandler(name, handler) {
    name.onclick = null;
    name.onclick = handler;
}