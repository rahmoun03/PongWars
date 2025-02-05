
import {CheckAuth, CheckUserAuth, fetchUserData , getCookie ,logout,postImage,postMethode} from './readData.js';

import { navigateTo } from '../routing.js';

class settingPage extends HTMLElement {
    
    navar = `
    @media (min-width: 320px) and (max-width: 1024px) {
            .nav-bar{
                width: 100%;
                display: flex;
                height :8%;
                background-color: rgb(0 0 0 / 0.5);
                color: #293247;
                justify-content: space-evenly;
                align-items: center;
                flex-direction: row;
                border-radius :0px;
                position: fixed;
                padding-bottom: 5%;
                bottom :0;
                z-index :1000;
            }
            .nav-02{
                margin-top:30px;
            }
            .nav-02 .fa-right-from-bracket{
                display :none;
            }
            nav a{
                text-decoration: none;
            }
            .fafa{
                display :none;
            }
            .img-home{
                display :none;
            }
            body{
                flex-direction: column-reverse;
            }
            #content{
                width :100vw;
                height :100vh;
                border-radius :0px;
                display :flex;
            }
    }`
    constructor() {
        super();
    }

    settingOne = `
        <div class="settingOne" >
            <br>
            <div class="nav-setting" >
            <br>
                <div class="profSetting hoverSetting"  >
                <div class="iconSett" >
                    <br>
                    <i class="fa-regular fa-user"></i>
                    <h4>Profile Setting</h4>
                    </div>
                </div>
                <div class="passSetting hoverSetting" >
                <div class="iconSett" >
                <br>
                    <i class="fa-solid fa-lock"></i>
                    <h4>Password</h4>
                </div>
                </div>
                <div class="authSetting hoverSetting" >
                <div class="iconSett" >
                <br>
                     <i class="fa-solid fa-shield-halved"></i>
                    <h4>Auth</h4>
                </div>
                </div>
            </div>
        </div>
    `
    settingOneStyle = `
    <style>
    .nav-bar{
            display :flex;
        }
        #setting{ 
                    color: #fff; 
                }
    @media (min-width: 992px) and (max-width: 1024px) {
        .settingOne{
        width :20%;
        height :100%;
        display :flex;
    }
    }
    .settingPage{
        width :100%;
        height :100%;
        display :flex;
        align-items: center;
        justify-content: center;
        gap :30px;
        z-index :2000;
    }
    .settingOne{
        width :20%;
        height :100%;
        display :flex;
    }
    .nav-setting{
        width :100%;
        height :50%;
        background: var(--bluenes);
        border-radius :5px;
        display :flex;
        align-items: center;
        justify-content: start;
        flex-direction: column;
        gap :10px;
        z-index :2000;
    }
    .hoverSetting{
        width :100%;
        height :20%;
        display :flex;
        align-items: center;
        justify-content: start;
    }
    .hoverSetting:hover{
        background:rgba(56, 75, 112, 0.2);
        border-right :10px solid rgba(56, 75, 112, 1);
    }
    .iconSett{
        display :flex;
        align-items: center;
        justify-content: center;
        gap :10px;
    }
    .iconSett i, .iconSett h4 {
        margin: 0; /* Remove default margin */
        padding: 0; /* Remove default padding */
        font-size :18px;
    }
    .brr{ 
        width :100%;
        height :4%;
    }
    .infoSetting{
        width :100%;
        height :90%;
        background: var(--bluenes);
        border-radius :5px;
        
    }
    .settingTwo{
        width :80%;
        height :100%;
    }
    .btn-home{
            width :200px;
            height:50px;
            background : var(--red);
            border-radius:5px;
            border :none;
            font-size:100%;
            z-index :2000;
        }
    </style>
    `;
    settintransStyle = `
                <style>
            .formProf{
                width :100%;
                height :90%;
                display :flex;
                align-items: center;
                justify-content: center;
                
            }
            .formProf form{
                width :90%;
                height :90%;
                font-family: "Gill Sans", sans-serif;
            }
            .formProf input {
                background-color: rgb(0 0 0 / 0.5);
                border :none;
                border-radius :3px;
            }
            .formProf textarea{
                background-color: rgb(0 0 0 / 0.5);
        
            }
            .formProf label{
                font-size :18px;
                font-family: "Gill Sans", sans-serif;

            }
            textarea{
                height :40%;
                width :80%;
                background: rgba(34, 40, 52, 1) ;
                border-radius :15px;
                border :none;
                resize: none;
                padding: 12px 20px;
                font-size :18px;
            }
            .editUser{
                width :50%;
                height :15%;
            }
        </style>
    `;

    settingTwo = `
    <div class="settingTwo" >
    <div class="humbergr-bar" type="click">
        <input type="checkbox"  role="button" aria-label="Display the menu" class="menu">
    </div>
    <div class="infoSetting" >
                <div class="avatar" >
                    <div class="editAvatar" >
                        <div class="imgInfo" >
                            <img id="imgSetting" src="" >
                        </div>
                        <div class="btnInfo" >
                            <button type="click" id="openPopupBtn" class="btn-home fiter btn btn-secondary " >Upload New</button>
                            <button type="click" id="deleteimg" class="btn-home fiter btn btn-secondary " >Delete Avatar</button>
                        </div>

                        <!-- Popup Overlay -->
                        <div id="popupOverlay" class="popup-overlay"></div>

                        <!-- Popup Container -->
                        <div id="popup" class="popup">
                            <span id="popupClose" class="popup-close">&times;</span>
                            <h2>Upload</h2>
                            
                            <!-- File Input -->
                            <input type="file" id="imageUpload" accept="image/*" class="file-input">
                            <label for="imageUpload" class="file-input-label">Choose Image</label>
                            
                            <!-- Image Preview -->
                            <img id="imagePreview" alt="Image Preview">
                            
                            <div>
                                <button class="btn-home " id="uploadBtn" style="display:none;">Upload</button><br>
                                <button style="background:gray; margin-top :5px;" class="btn-home " id="closePopupBtn">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info" >
                    <div class="editInfo" >

                    </div>
                </div>

    </div>
        </div>
        <style>
        .popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--dark);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 4000;
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        /* Overlay background */
        .popup-overlay {
            display: none; /* Initially hidden */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
            backdrop-filter: blur(8px); /* Blur everything behind the overlay */
            z-index: 999; /* Ensure overlay is on top */
        }
        /* Popup close button */
        .popup-close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 20px;
        }
        /* Button styling */

        /* Image preview */
        #imagePreview {
            max-width: 100%;
            max-height: 300px;
            margin: 20px 0;
            display: none;
        }
        /* File input styling */
        .file-input {
            display: none;
        }
        .file-input-label {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2196F3;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            margin: 10px 0;
        }
        </style>
    `   
    hiddeHover(name){
        const hoverProf = document.querySelector(name);
        hoverProf.style.background = 'none';
        hoverProf.style.borderRight = 'none';
    }
    profEdit(){
        return `
        <div class="formProf d-flex flex-column">
                 <form class="clean" >
                    <label for="fname">Username</label><br><br>
                    <input type="text" class="editUser" name="username" required><br><br>
                    <label for="lname">Bio</label><br>
                    <textarea rows="10" class="baio" name="blog" ></textarea><br><br>
                    <span id="status" style="color :gray; text-aling:center;font-size:16px; font-family: sans-serif;" ></span>
                    <input type="submit" value="Submit" id="postData" class="btn-home filter btn btn-secondary" style="background: var(--red);">
                <form>
            </div>
            <br>"
        `;
    }
    passEdit(){
        return `
        <div class="formProf d-flex flex-column" >
            <form class="clean" >
                <label for="fname">Old Password</label><br><br>
                <input type="password"  class="pass1" name="crrent_password1" required><br>
                <label for="fname">New Password</label><br><br>
                <input type="password"  class="pass2" name="new_password1" required ><br>
                <label for="fname">New Password</label><br><br>
                <input type="password"  class="pass3" name="new_password" required><br><br>
                <span id="error" style="color :gray; display:none; text-aling:center;font-size:16px; font-family: sans-serif;" >change password fail</span>
                <br>
                <input style="background : var(--red);" type="submit" value="Submit" id="postData" class="btn-home fiter btn btn-secondary" >
            </form>
            </div>
        
        `;
    }
    authEdit(){
        return `
        <style>
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
                }

                /* Hide default HTML checkbox */
                .switch input {
                opacity: 0;
                width: 0;
                height: 0;
                }

                /* The slider */
                .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
                }

                .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
                }

                input:checked + .slider {
                background-color: #2196F3;
                }

                input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
                }

                input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
                }

                /* Rounded sliders */
                .slider.round {
                border-radius: 34px;
                }

                .slider.round:before {
                border-radius: 50%;
                }
        </style>
            <div style="display :flex; flex-direction :column; gap :10px; margin :10px;" class="formProf" >
            <label class="switch">
                <input type="checkbox" id="toggle-switch" >
                <span class="slider round"></span>
            </label>
            </div>

        `;
    }
    displayNav(){
        console.log('inside navigation')
        const checkbox = document.querySelector('.menu').getAttribute('name');
            const navnav = document.querySelector(".menu");
            navnav.addEventListener('change' , (e) =>{
                if (navnav.checked){
                    document.querySelector('.menu').setAttribute("name", "noflag")
                    document.querySelector('.settingOne').style.display = "flex";
                }
                else{                    
                    document.querySelector('.settingOne').style.display = "none";
                }
            });
    }

    async imgEffect(){
        const openPopupBtn = document.getElementById('openPopupBtn');
        const popup = document.getElementById('popup');
        const popupOverlay = document.getElementById('popupOverlay');
        const popupClose = document.getElementById('popupClose');
        const closePopupBtn = document.getElementById('closePopupBtn');
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const uploadBtn = document.getElementById('uploadBtn');

        // Function to open the popup
        function openPopup() {
            popup.style.display = 'block';
            popupOverlay.style.display = 'block';
            // Reset form
            imageUpload.value = '';
            imagePreview.style.display = 'none';
            imagePreview.src = '';
            uploadBtn.style.display = 'none';
                const elements = document.querySelectorAll('.fiter');
                elements.forEach((el) => {
                    el.style.filter = 'blur(8px)';
                });
            }
        // Function to close the popup
        function closePopup() {
            popup.style.display = 'none';
            popupOverlay.style.display = 'none';
            const elements = document.querySelectorAll('.fiter');
            elements.forEach((el) => {
                el.style.filter = 'none';
            });

        }

        // Image upload event listener
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Create a file reader
                const reader = new FileReader();
                
                // Read the image file
                reader.readAsDataURL(file);
                
                // When file is loaded
                reader.onload = function(e) {
                    // Show image preview
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    
                    // Show upload button
                    uploadBtn.style.display = 'inline-block';
                }
            }
        });

        // Upload button event listener (you would typically send this to a server)
        uploadBtn.addEventListener('click', async function() {
            // Simulate upload (replace with actual upload logic)
            // alert('Image ready to upload! (In a real app, this would send to a server)');
            const file = imageUpload.files[0];
            

            const formData = new FormData();
            formData.append('image', file);
            await postImage(formData , 'change_image','POST');
            navigateTo('/setting')
            showAlert("image changed succesfully", "success")
        });

        // Event listeners to open and close the popup
        openPopupBtn.addEventListener('click', openPopup);
        popupClose.addEventListener('click', closePopup);
        closePopupBtn.addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', closePopup);
    }
    deleteImage(){
        const img = document.getElementById('deleteimg')
        console.log(img);
        img.addEventListener('click' , async (e) => {
            await postImage(null,'change_image','DELETE');
            showAlert("image deleted succesfully", "success")
        });
    }
    infoPost(url){
            // console.log('HERE HERE DELETE IMAGE');
            document.querySelector('#postData').addEventListener('click', async function (event) {
                event.preventDefault(); // Prevent form submission and page reload
                console.log("HERE HERE");
                const username = document.querySelector('.editUser').value;
                const bio = document.querySelector('.baio').value;
                // const formData = new FormData();
                // formData.append('username', name);
                // formData.append('bio', bio);
                const data = {
                    username: username,
                    bio: bio,
                };
                if (bio && !username){
                    showAlert("username required", "error")
                    document.getElementById('status').textContent = 'username required';
                }
                else{

                    document.querySelector('.clean').reset();
                    await postMethode(data , 'bio');
                    showAlert("username changed successefully", "success")
                }
        });
    }
    passPost(){
        document.querySelector('#postData').addEventListener('click', async function (event) {
            event.preventDefault(); // Prevent form submission and page reload
            const pass1 = document.querySelector('.pass1').value;
            const pass2 = document.querySelector('.pass2').value;
            const pass3 = document.querySelector('.pass3').value;
            if (pass2 != pass3){
                document.getElementById('error').style.display = "block"
                showAlert("password not correct", "error")

            }else{
                const formData = {
                    crrent_password : pass1,
                    new_password1 : pass2,
                    new_password2 : pass3,
                }
                await postMethode(formData , 'change_password');
                document.querySelector('.clean').reset();
                showAlert("111122", "success")
            }
        });
    }
    async passAuth(){

        const toggleSwitch = document.getElementById('toggle-switch');
        const status = await CheckUserAuth('' , 'GET' , "otp_activate");
        toggleSwitch.checked = status;
        toggleSwitch.addEventListener('change', (e) => {
                e.preventDefault(); // Prevent form submission and page reload
                if (e.target.checked) {

                    console.log('Switch turned ON');
                    const data = {
                        isactivate : true
                    }
                    CheckAuth(data,'POST','otp_activate')
                    showAlert("OTP ON", "success")
                } else {
                    const data = {
                        isactivate : false
                    }
                    CheckAuth(data,'POST','otp_activate')
                    showAlert("OTP OFF", "success")

                }
                console.log("HERE IS THE AUTH PART");    
            });
    }
    render() {
        this.innerHTML = `
            <style>
                .avatar{
                    width :100%;
                    height :30%;
                }
                .info{
                    width :100%;
                    height :55%;
                }
                .saveInfo{
                    width :95%;
                    height :15%;
                    display: flex;
                    justify-content: right;
                    align-items: center;
                    margin-top :8px;
                    gap :0px;
                    z-index :-1;
                }
                .savebtn{
                    width :18%;
                    height :55%; 
                    background: rgba(56, 75, 112, 1);
                    font-size :23px;
                    border :none;
                    border-radius :15px;
                }
                .editAvatar{
                    width :80%;
                    height :100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap:5px;
                }
                .btnInfo{
                    width :80%;
                    height :80%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap :10px;
                   
                }
                .imgInfo img{
               max-width: 130px;
                height: 130px;
                object-fit: cover;
                border-radius:50%;
                }
                .imgInfo{
                    width :40%;
                    height :80%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .editImg{
                    width :50%;
                    height :30%; 
                    background: rgba(56, 75, 112, 1);
                    font-size :23px;
                    border :none;
                    border-radius :15px;
                }
                .deleteImg{
                    width :50%;
                    height :30%; 
                    background: rgba(34, 40, 52, 1);
                    font-size :23px;
                    border :none;
                    border-radius :15px;
                }
                .editInfo{
                    width :50%;
                    height :100%;

                }
                .formProf textarea{
                     width :100%;
                }
                .formProf input{
                     width :100%;
                     height :12%;
                     padding :5px;
                    background:rgb(0 0 0 / 0.5);               
                }
                .humbergr-bar{
                    display :none;
                }
            </style>
            <div class="settingPage" >
                ${this.settingOne}
                ${this.settingTwo}
                ${this.settingOneStyle}
                ${this.settintransStyle}
                <style>
                ${this.navar}
                @media (min-width: 320px) and (max-width: 1024px){
                  .settingPage{
                        gap :0;
                        border-radius :0px;
                  }    
                .settingOne{
                        Display :none;
                        width :100%;
                        height :100%;
                        z-index :1000;
                        gap :0;
                        position :absolute;
                        left :0;
                    }
                    .nav-setting{
                        border-radius :0px;
                        background-color: #000;
                        color: #293247;
                        z-index :3000;
                    }
                    .settingTwo{
                        width :100vw;
                    }
                    .NotKnow{
                        display :none;
                    }
                    .infoSetting{
                        border-radius :0px;
                        height :100vh;    
                    }
                .editAvatar{
                    width :100%;
                    height :80%;
                }
                .btnInfo{
                    width :100%;
                    height :60%;
                    flex-direction: column;
                    z-index :0;
                }
                .editInfo {
                    width :100%;                
                }
                .formProf textarea{
                     width :100%;
                }
                .formProf input{
                     width :100%;
                     height :12%;               
                }
                .imgInfo{
                    width :60%;
                }
                .saveInfo{
                    margin-top :0px;
                   
                }
                .humbergr-bar{
                    display :flex;
                    position :absolute;
                    top :1%;
                    right :0;
                }
                    .hoverSetting:hover{
        background:rgba(56, 75, 112, 0.2);
        border-right :10px solid rgba(56, 75, 112, 1);
    }
                .menu {
                    --s: 20px; /* control the size */
                    --c: #fafafa; /* the color */
                    z-index :1001;
                    height: var(--s);
                    aspect-ratio: 1;
                    border: none;
                    padding: 0;
                    border-inline: calc(var(--s)/1.2) solid #0000; 
                    box-sizing: content-box;
                    --_g1: linear-gradient(var(--c) 20%,#0000 0 80%,var(--c) 0) 
                            no-repeat content-box border-box;
                    --_g2: radial-gradient(circle closest-side at 50% 12.5%,var(--c) 95%,#0000) 
                            repeat-y content-box border-box;
                    background: 
                    var(--_g2) left  var(--_p,0px) top,
                    var(--_g1) left  calc(var(--s)/10 + var(--_p,0px)) top,
                    var(--_g2) right var(--_p,0px) top,
                    var(--_g1) right calc(var(--s)/10 + var(--_p,0px)) top;
                    background-size: 
                    20% 80%,
                    40% 100%;
                    position: relative;
                    clip-path: inset(0 25%);
                    -webkit-mask: linear-gradient(90deg,#0000,#000 25% 75%,#0000);
                    cursor: pointer;
                    transition: 
                    background-position .3s var(--_s,.3s), 
                    clip-path 0s var(--_s,.6s);
                    -webkit-appearance:none;
                    -moz-appearance:none;
                    appearance:none;
                    }
                    .menu:before,
                    .menu:after {
                    content:"";
                    position: absolute;
                    border-radius: var(--s);
                    inset: 40% 0;
                    background: var(--c);
                    transition: transform .3s calc(.3s - var(--_s,.3s));
                    }

                    .menu:checked {
                    clip-path: inset(0);
                    --_p: calc(-1*var(--s));
                    --_s: 0s;
                    }
                    .menu:checked:before {
                    transform: rotate(45deg);
                    }
                    .menu:checked:after {
                    transform: rotate(-45deg);
                    }
                    .menu:focus-visible {
                    clip-path: none;
                    -webkit-mask: none;
                    border: none;
                    outline: 2px solid var(--c);
                    outline-offset: 5px;
                    }

            }
                </style>
            </div>
            

            `;
            const hoverProf = document.querySelector('.profSetting');
            hoverProf.style.background = "rgba(56, 75, 112, 0.2)";
            hoverProf.style.borderRight = ' 10px solid rgba(56, 75, 112, 1)';
            const editInfo = document.querySelector('.editInfo');
            editInfo.innerHTML = this.profEdit();
            this.infoPost('bio_image');
            // const hoverProf = document.querySelector('.profSetting');
            hoverProf.addEventListener('click' , (e) => {
                e.preventDefault();
                const hoverProf = document.querySelector('.profSetting');
                hoverProf.style.background = "rgba(56, 75, 112, 0.2)";
                hoverProf.style.borderRight = ' 10px solid rgba(56, 75, 112, 1)';
                this.hiddeHover('.passSetting');
                this.hiddeHover('.authSetting');
                const editInfo = document.querySelector('.editInfo');
                editInfo.innerHTML = this.profEdit();
                this.infoPost('bio_image');
            });
            const passEdit = document.querySelector('.passSetting');
            passEdit.addEventListener('click' , (e) => {
                e.preventDefault()
                passEdit.style.background = "rgba(56, 75, 112, 0.2)";
                passEdit.style.borderRight = ' 10px solid rgba(56, 75, 112, 1)';
                this.hiddeHover('.profSetting');
                this.hiddeHover('.authSetting');
                const editInfo = document.querySelector('.editInfo');
                editInfo.innerHTML = this.passEdit();
                this.passPost('change_password');
            });
            const authEdit = document.querySelector('.authSetting');
            authEdit.addEventListener('click' , async (e) => {
                e.preventDefault()
                authEdit.style.background = "rgba(56, 75, 112, 0.2)";
                authEdit.style.borderRight = ' 10px solid rgba(56, 75, 112, 1)';
                this.hiddeHover('.profSetting');
                this.hiddeHover('.passSetting');
                const editInfo = document.querySelector('.editInfo');
                editInfo.innerHTML = this.authEdit();
                this.passAuth();
            });
            this.displayNav();
            const uuss = async () => {
                this.info = await fetchUserData();
                console.table(this.info)
                document.getElementById('imgSetting').src = this.info.image
            }
            uuss();
            this.imgEffect();
            this.deleteImage();
            // this.infoPost(1);
    }

    connectedCallback() {
        // console.log('HERE IS THE SETTING PAGE')
        if (!getCookie('access')){
            navigateTo('/login');
        }
        this.render();
        logout()
    }
}

customElements.define('setting-page', settingPage);