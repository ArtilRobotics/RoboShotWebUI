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

var Beb= new Array();
var Ingredients = new Array();


//Funciones para almacenar 
function beb(id){
    for (let i=1; i<=12; i++){
        Ingredients[i]= localStorage.getItem("Nombres"+i);
    }
    Beb[id]= document.getElementById("Beb"+id).value;
    localStorage.setItem("Vol. Beb_"+ id + "_"+Ingredients[id]+":", Beb[id]);
    localStorage.setItem("Vol_I. Beb" + id + Ingredients[id] + ":", Beb[id]);

}

////////////////////////////////////////////////////////////
