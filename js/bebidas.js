const DM_State = {
    'CLOSED': 0,
    'OPENING': 1,
    'LOADING': 2,
    'RUNNING': 3,
    'REQUESTING': 4,
    'DOSING': 5,
    'CLOSING': 6
};

const MM_State = {
    'CLOSED': 0,
    'OPENING': 1,
    'RUNNING': 2,
    'FIXED': 3,
    'CLOSING': 4,
};

var started = false;
var DM_status = DM_State.CLOSED;
var MM_status = MM_State.CLOSED;

// Mainmodal
function openModal() {
    if (MM_status === MM_State.CLOSED) {
        let main_modal = document.getElementById("mainModal");
        main_modal.className = "modal open";
        MM_status = MM_State.OPENING;
        setTimeout(function () {
            openModalBack();
            MM_status = MM_State.RUNNING;
        }, 100);
    }
}

function closeModal(id) {
    if (MM_status === MM_State.RUNNING) {
        let main_modal = document.getElementById("mainModal");
        main_modal.className = "modal trans";
        setTimeout(function () {
            document.getElementById("mod-bebida"+id).className = "inv";
        }, 1000);
        setTimeout(function () {
            main_modal.className = "modal";
            closeModalBack();
            MM_status = MM_State.CLOSED;
        }, 300);
        MM_status = MM_State.CLOSING;
    }
}

function closeEitherModal() {
    if (MM_status === MM_State.RUNNING) {
        if (DM_status !== DM_State.CLOSED) {
            closeDrinkModal();
        } else {
            closeConfigModal();
        }
    }
}


function closeConfigModal(id) {
    if (MM_status === MM_State.RUNNING && DM_status === DM_State.CLOSED) {
        closeModal(id);
        setTimeout(function () {
            //resetCM();
        }, 6000)
    }
}

//Bebidas general
function openBebidaModal(id) {
    if (MM_status === MM_State.CLOSED) {
        openModal();
        setTimeout(function () {
            document.getElementById("mod-bebida"+id).className = "";
        }, 700);
    }
}
////////////////////////////////////////////////////////////////
// Modalback
function openModalBack() {
    document.getElementById("modalclose").className = "";
}

function closeModalBack() {
    document.getElementById("modalclose").className = "MC_cls";
}

//Retorno menu principal
function back(){
    location.href = "/home/pi/Hector9000WebUI/Main.html";
}

//Funciones para almacenar 
function beb1(){
    var beb1= document.getElementById("Beb1").value;
    localStorage.setItem("Vol. Beb1",beb1);
    localStorage.setItem("Vol_I. Beb1",beb1);
}
function beb2(){
    var beb2= document.getElementById("Beb2").value;
    localStorage.setItem("Vol. Beb2",beb2);
    localStorage.setItem("Vol_I. Beb2",beb2);
}
function beb3(){
    var beb3= document.getElementById("Beb3").value;
    localStorage.setItem("Vol. Beb3",beb3);
    localStorage.setItem("Vol_I. Beb3",beb3);
}
function beb4(){
    var beb4= document.getElementById("Beb4").value;
    localStorage.setItem("Vol. Beb4",beb4);
    localStorage.setItem("Vol_I. Beb4",beb4);
}
function beb5(){
    var beb5= document.getElementById("Beb5").value;
    localStorage.setItem("Vol. Beb5",beb5);
    localStorage.setItem("Vol_I. Beb5",beb5);
}
function beb6(){
    var beb6= document.getElementById("Beb6").value;
    localStorage.setItem("Vol. Beb6",beb6);
    localStorage.setItem("Vol_I. Beb6",beb6);
}
function beb7(){
    var beb7= document.getElementById("Beb7").value;
    localStorage.setItem("Vol. Beb7",beb7);
    localStorage.setItem("Vol_I. Beb7",beb7);
}
function beb8(){
    var beb8= document.getElementById("Beb8").value;
    localStorage.setItem("Vol. Beb8",beb8);
    localStorage.setItem("Vol_I. Beb8",beb8);
}
function beb9(){
    var beb9= document.getElementById("Beb9").value;
    localStorage.setItem("Vol. Beb9",beb9);
    localStorage.setItem("Vol_I. Beb9",beb9);
}
function beb10(){
    var beb10= document.getElementById("Beb10").value;
    localStorage.setItem("Vol. Beb10",beb10);
    localStorage.setItem("Vol_I. Beb10",beb10);
}
function beb11(){
    var beb11= document.getElementById("Beb11").value;
    localStorage.setItem("Vol. Beb11",beb11);
    localStorage.setItem("Vol_I. Beb11",beb11);
}
function beb12(){
    var beb12= document.getElementById("Beb12").value;
    localStorage.setItem("Vol. Beb12",beb12);
    localStorage.setItem("Vol_I. Beb12",beb12);
}

////////////////////////////////////////////////////////////
