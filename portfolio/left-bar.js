class left_bar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode : "open"});
        this.shadowRoot.innerHTML = `
        <style>
            div {
                position: fixed;
                left: 10px;
                top: 15%;
                width: 8%;
                height: 70%;
                padding: 2px ;
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
customElements.define("left-bar", left_bar);