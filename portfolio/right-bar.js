class right_bar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode : "open"});
        this.shadowRoot.innerHTML = `
        <style>
            div {
                position: fixed;
                right: 10px;
                top: 15%;
                width: 8%;
                height: 70%;
                border: 2px solid silver;
                background: rgba(192, 192, 192, 0.19);
                border-radius: 10px;
            }
        </style>
        <div>
    
        </div>
        `;
    }
}
customElements.define("right-bar", right_bar);