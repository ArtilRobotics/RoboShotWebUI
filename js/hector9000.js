
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

var displays = [];
var displaystate = 0;
var mqtt;

var nombre;
var long;

const host = "localhost";
const port = 9001;


const TopicDrinkList = "Hector9000/get_drinks";
const IngredientsList= "Hector9000/get_ingredientsList";
const TopicIngredients = "Hector9000/get_ingredientsForDrink";
const TopicDose = "Hector9000/doseDrink";
const TopicClean = "Hector9000/cleanMe";
const TopicDry = "Hector9000/dryMe";
const TopicOpenAllValves = "Hector9000/openAllValves";
const TopicCloseAllValves = "Hector9000/closeAllValves";

//--------- Testing start ---------------

const testing = false;

var drinkjson = '{ "id": "123", "name": "Getränk","color": "#999999",' +
    '"description": "Ein Getränk",' +
    '"ingredients": [' +
    '{"name": "Cola", "ammount": 150},' +
    '{"name": "Club-Mate", "ammount": 100},' +
    '{"name": "Rum", "ammount": 50},' +
    '{"name": "Wasser", "ammount": 200},' +
    '{"name": "Moscow-Mule", "ammount": 10}' +
    ']' +
    '}';


var jsont = '{"drinks": [{"name": "Piña colada","id": 123, "alcohol": true, "image":"https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DJNTLM5KOJFCTB4VGVDENLJUSA.jpg"},{"name": "Margarita frozen de fresa","id": 123, "alcohol": false,"image":"https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DJNTLM5KOJFCTB4VGVDENLJUSA.jpg"},{"name": "Margarita frozen de limón","id": 123, "alcohol": false,"image":"https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DJNTLM5KOJFCTB4VGVDENLJUSA.jpg"},{"name": "Pisco Sunrise","id": 123, "alcohol": false,"image":"https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DJNTLM5KOJFCTB4VGVDENLJUSA.jpg"},{"name": "Cosmopolitan","id": 123, "alcohol": true,"image":"https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DJNTLM5KOJFCTB4VGVDENLJUSA.jpg"},{"name": "Mojito","id": 123, "alcohol": true,"image":"https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DJNTLM5KOJFCTB4VGVDENLJUSA.jpg"}]}';

//--------- Testing end ---------------

// function generateButton(name, id) {
//     html = '<div onclick="openDrinkModal(this)" class="button" ';
//     html += '" d_id="' + id + '" d_name="' + name + '"><div class="name">' + name + "</div></div>";
// }
function generateButton(name, id, image) {
    html = '<div onclick="openDrinkModal(this)" class="button" ';
    html += '" d_id="' + id + '" d_name="' + name + '"d_image="' + image + '">';
    html += '<div class="image"><img src="' + image + '" alt="' + name + '" width="85" height="100"></div><br><div class="name">' + name + '</div></div>';
    return html;
}


function generateButtons(drinksjson) {
    started = true;
    var json = JSON.parse(drinksjson);
    jl = json.drinks.length;
    cont = document.getElementById("content");
    count = 0;
    teiler = parseInt(jl / 6);
    for (i = 0; i < parseInt(jl / 6); i++) {
        count++;
        html = '<div class="buttons" id="id' + (i + 1) + '">';
        html += '<div class="row r1">';
        for (j = 0; j < 3; j++) {
            html += generateButton(json.drinks[(6 * i + j)].name, json.drinks[(6 * i + j)].id, json.drinks[(6 * i + j)].image);
        }
        html += '</div><div class="row r2">';
        for (j = 0; j < 3; j++) {
            html += generateButton(json.drinks[(6 * i + 3 + j)].name, json.drinks[(6 * i + 3 + j)].id, json.drinks[(6 * i + 3 + j)].image);
        }
        html += '</div></div>';
        cont.innerHTML += html;
        displays.push("id" + (i + 1));
    }
    rest = json.drinks.length % 6;
    ammont = (teiler * 6);
    if (rest > 0) {
        ct = 0;
        html = '<div class="buttons" id="id' + (count + 1) + '"><div class="row r1">';
        if (rest >= 4) {
            for (i = 0; i < 3; i++) {
                html += generateButton(json.drinks[(ammont + i)].name, json.drinks[(ammont + i)].id, json.drinks[(ammont + i)].image);
                console.log(json.drinks[(ammont + i)].name, json.drinks[(ammont + i)].id, json.drinks[(ammont + i)].image);
            }
            html += '</div><div class="row r2">';
            ct = 3;
        }
        do {
            html += generateButton(json.drinks[(ammont + ct)].name, json.drinks[(ammont + ct)].id, json.drinks[(ammont + ct)].image);
            ct++;
        } while (ct < rest);
        html += '</div></div>';
        cont.innerHTML += html;
        displays.push("id" + (count + 1));
    }
    for (i = 0; i < displays.length; i++) {
        document.getElementById(displays[i]).style.right = "" + (-i * 100 + 10) + "%";
    }
    document.addEventListener('keydown', keydown);
    document.getElementById("loading").className = "inv";
}


function generateIngredients(ingredientsJSON){
    var json=JSON.parse(ingredientsJSON);
    var longs=json.ingredients.length;
    var nombres=json.ingredients;
    nombre=nombres;
    long=longs;
}



console.log(nombres);

function startup() {
    if (testing) {
        started = true;
        generateButtons(jsont);
        generateIngredients(drinkjson);
    } else {
        setUpMQTT();
    }
}

// Mainmodal
function openModal() {
    if (MM_status === MM_State.CLOSED) {
        let main_modal = document.getElementById("mainModal");
        main_modal.className = "modal open";
        MM_status = MM_State.OPENING;
        setTimeout(function () {
            openModalBack();
            MM_status = MM_State.RUNNING;
        }, 1100);
    }
}

function closeModal() {
    if (MM_status === MM_State.RUNNING) {
        let main_modal = document.getElementById("mainModal");
        main_modal.className = "modal trans";
        setTimeout(function () {
            document.getElementById("mod-config").className = "inv";
            document.getElementById("mod-drink").className = "inv";
        }, 300);
        setTimeout(function () {
            main_modal.className = "modal";
            closeModalBack();
            MM_status = MM_State.CLOSED;
        }, 1000);
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

// Drinkmodal
function resetDM() {
    document.getElementById("DM_name").innerHTML = "";
    document.getElementById("DM_image").innerHTML = "";
    document.getElementById("DM_List").innerHTML = "<div id=\"DM_ing_loader\"><div><div class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>";
    document.getElementById("DM_zubereiten").onclick = function () {
    };
    document.getElementById("DM_zubereiten").disabled = true;
    document.getElementById("mod-drink").setAttribute("d_id", "");
}

function closeDrinkModal() {
    if (DM_status === DM_State.RUNNING || DM_status === DM_State.LOADING) {
        DM_status = DM_State.CLOSING;
        closeModal();
        setTimeout(function () {
            document.getElementById("DM_ing_loader").className = "";
            resetDM();
            DM_status = DM_State.CLOSED;
        }, 1000)
    }
}
//Para ver el nombre al momento de abrir para servirse
function openDrinkModal(drinkinfo) {
    if (MM_status === MM_State.CLOSED) {
        openModal();
        DM_status = DM_State.OPENING;
        setTimeout(function () {
            document.getElementById("mod-drink").className = "";
        }, 700);
        let d_name = drinkinfo.getAttribute("d_name");
        document.getElementById("DM_name").innerHTML = d_name;
        let d_image = drinkinfo.getAttribute("d_image");
        document.getElementById("DM_name").innerHTML = '<div>' + d_name + '</div>';
        document.getElementById("DM_image").innerHTML = '<div class="image"><img src="' + d_image + '" alt="' + d_name + '" width="85" height="100"></div>';
        document.getElementById("mod-drink").setAttribute("d_id", drinkinfo.getAttribute("d_id"));
        if (testing) {
            DM_status = DM_State.LOADING;
            setTimeout(showIngredientsAndButton(drinkjson), 800);
        } else {
            DM_status = DM_State.LOADING;
            publish(TopicIngredients, drinkinfo.getAttribute("d_id"));
        }
    }
}

//Funcion para obtener los elementos
function getFields(input, field) {
    var output = [];
    for (var i = 0; i < input.length; ++i)
        output.push(input[i][field]);
    return output;
}

//Indica los ingredientes 
function showIngredientsAndButton(json) {
    let drinkinfo = JSON.parse(json);
    console.log(document.getElementById("mod-drink"));
    if (drinkinfo.id != document.getElementById("mod-drink").getAttribute("d_id")) {
        console.log("not doing stuff");
        return;
    }
    if (DM_status === DM_State.LOADING) {
        console.log("doing stuff");
        document.getElementById("DM_ing_loader").className = "inv";
        document.getElementById("DM_zubereiten").disabled = false;
        document.getElementById("DM_zubereiten").addEventListener("click", function () {
            doseDrink(drinkinfo);
        });
        for (let i = 0; i < drinkinfo.ingredients.length; i++) {
            document.getElementById("DM_List").innerHTML += '<div class="DM_ing"><div class="DM_ing_amm">' + drinkinfo.ingredients[i].ammount + 'ml</div><div class="DM_ing_name">' + drinkinfo.ingredients[i].name + '</div></div>';
        }
        DM_status = DM_State.RUNNING;
    }
    console.log(DM_status);
}



//Funcion para registrar el consumo de las bebidas
function sabor(a,c) {
    var nombres=getFields(a,"name");
    var b=getFields(a,"ammount");
    var beb1, init1, b1, beb2, init2, b2, beb3, init3, b3, beb4, init4, b4, beb5, init5, b5;
    for (i = 0; i < c; i++) {
        switch (nombres[i]) {
            case nombres[0]:
                beb1 = b[i];
                if (localStorage.getItem("Vol. Beb1") == localStorage.getItem("Vol_I. Beb1")) {
                    b1 = beb1;
                } else {
                    b1 = localStorage.getItem("ConsumoBeb1");
                    b1 = parseFloat(b1) + parseFloat(beb1);
                }
                init1 = localStorage.getItem("Vol. Beb1");
                init1 = init1 - beb1;
                localStorage.setItem("Vol. Beb1", init1);
                localStorage.setItem("ConsumoBeb1", b1);
                break;
            case nombres[1]:
                beb2 = b[i];
                console.log(beb2);
                if (localStorage.getItem("Vol. Beb2") == localStorage.getItem("Vol_I. Beb2")) {
                    b2 = beb2;
                } else {
                    b2 = localStorage.getItem("ConsumoBeb2");
                    b2 = parseFloat(b2) + parseFloat(beb2);
                }
                init2 = localStorage.getItem("Vol. Beb2");
                init2 = init2 - beb2;
                localStorage.setItem("Vol. Beb2", init2);
                localStorage.setItem("ConsumoBeb2", b2);
                break;
            case nombres[2]:
                beb3 = b[i];
                if (localStorage.getItem("Vol. Beb3") == localStorage.getItem("Vol_I. Beb3")) {
                    b3 = beb3;
                } else {
                    b3 = localStorage.getItem("ConsumoBeb3");
                    b3 = parseFloat(b3) + parseFloat(beb3);
                }
                init3 = localStorage.getItem("Vol. Beb3");
                init3 = init3 - beb3;
                localStorage.setItem("Vol. Beb3", init3);
                localStorage.setItem("ConsumoBeb3", b3);
                break;
            case nombres[3]:
                beb4 = b[i];
                if (localStorage.getItem("Vol. Beb4") == localStorage.getItem("Vol_I. Beb4")) {
                    b4 = beb4;
                } else {
                    b4 = localStorage.getItem("ConsumoBeb4");
                    b4 = parseFloat(b4) + parseFloat(beb4);
                }
                init4 = localStorage.getItem("Vol. Beb4");
                init4 = init4 - beb4;
                localStorage.setItem("Vol. Beb4", init4);
                localStorage.setItem("ConsumoBeb4", b4);
                break;
            case nombres[4]:
                beb5 = b[i];
                if (localStorage.getItem("Vol. Beb5") == localStorage.getItem("Vol_I. Beb5")) {
                    b5 = beb5;
                } else {
                    b5 = localStorage.getItem("ConsumoBeb5");
                    b5 = parseFloat(b5) + parseFloat(beb5);
                }
                init5 = localStorage.getItem("Vol. Beb5");
                init5 = init5 - beb5;
                localStorage.setItem("Vol. Beb5", init5);
                localStorage.setItem("ConsumoBeb5", b5);
                break;
            default:
                break;
        }
    }
}

//Bebidas
function bebidas() {
    location.href = "/home/pi/Hector9000WebUI/drinks.html";
}

// Configmodal
function resetCM() {
    //Nothing to reset yet
}

function closeConfigModal() {
    if (MM_status === MM_State.RUNNING && DM_status === DM_State.CLOSED) {
        closeModal();
        setTimeout(function () {
            resetCM();
        }, 1000)
    }
}

function openConfigModal() {
    if (MM_status === MM_State.CLOSED) {
        openModal();
        setTimeout(function () {
            document.getElementById("mod-config").className = "";
        }, 700);
    }
}


// Modalback
function openModalBack() {
    document.getElementById("modalclose").className = "";
}

function closeModalBack() {
    document.getElementById("modalclose").className = "MC_cls";
}

function doseDrink(info) {
    let id=info.id;
    // let control = info.ingredients;
    // var long = control.length;
    // var nombres = getFields(control, "name");
    // var cantidad = getFields(control, "ammount");
    if (DM_status === DM_State.RUNNING) {
        if (testing) {
            MM_status = MM_State.FIXED;
            DM_status = DM_State.DOSING;
            //alert("TESTING - DOSING DRINK");
            document.getElementById("DM_zubereiten_loading").className = "";
            document.getElementById("DM_zubereiten").className = "DM_button loader_active";
            setTimeout(function () {
                document.getElementById("DM_abbruch").className = "DM_button dis";
                document.getElementById("DM_zubereiten").className = "DM_button dis";
                setTimeout(function () {
                    document.getElementById("DM_abbruch").className = "DM_button inv";
                    document.getElementById("DM_zubereiten").className = "DM_button inv";
                    document.getElementById("DM_dose_bar").className = "";
                    updateDosingState(id, 5);
                }, 500);
            }, 3000);
            setTimeout(function () {
                document.getElementById("DM_zubereiten_loading").className = "inv";
                document.getElementById("DM_zubereiten").className = "DM_button";
                doseEnded()
            }, 30000);
        } else {
            DM_status = DM_State.REQUESTING;
            publish(TopicDose, id.toString());
            document.getElementById("DM_zubereiten_loading").className = "";
            document.getElementById("DM_zubereiten").className = "DM_button loader_active";
            setTimeout(function () {  }, 1000);
        }
    }
    sabor(nombre,long);
 
}

function doseStart(id) {
    if (DM_status === DM_State.REQUESTING) {
        DM_status = DM_State.DOSING;
        document.getElementById("DM_buttons").className = "dis";
        console.log("start");
        setTimeout(function () {
            document.getElementById("DM_zubereiten").className = "DM_button inv";
            document.getElementById("DM_abbruch").className = "DM_button inv";
            document.getElementById("DM_dose_bar").className = "";
            document.getElementById("DM_zubereiten_loading").className = "inv";
        }, 500)
    }
    // setTimeout(function(){doseEnded();}, 45000);
}

function limpiar(){
    publish(TopicClean, 'true');
}
function abrir() {
    publish(TopicOpenAllValves, 'true');
}

function cerrar() {
    publish(TopicCloseAllValves, 'true');
}

function updateDosingState(update) {
    console.log("update " + update);
    if (DM_status === DM_State.DOSING) {
        let inner = document.getElementById("inner_bar");
        update = update.split(".")[0];
        inner.style.width = update + "%";
        inner.getElementsByTagName("div")[0].innerText = update + "%";
    }
}

function doseEnded() {
    if (DM_status === DM_State.DOSING) {
        DM_status = DM_State.RUNNING;
        MM_status = MM_State.RUNNING;
        closeDrinkModal();
        setTimeout(function () {
            document.getElementById("DM_zubereiten").className = "DM_button";
            document.getElementById("DM_abbruch").className = "DM_button";
            document.getElementById("DM_dose_bar").className = "dis inv";
            location.reload();
        }, 600);
    }
}

//Keyevents
function keydown(e) {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
        right();
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        left();
    }
}

//Funcion para abir la nueva pagina de bebidas
function bebidas() {
    location.href = "/home/pi/Hector9000WebUI/drinks.html";
}
//////////////////////////////

//Funcion para abrir la nueva pagina de informacion de bebidas
function information(){
    location.href = "/home/pi/Hector9000WebUI/info.html";
}

//Funcion para retornar a la pagina principal
function home(){
    location.href = "/home/pi/Hector9000WebUI/Main.html";
}

//Funcion para ingresar a la pagina principal y setear las variables en cero
function home1(){
    location.href = "/home/pi/Hector9000WebUI/Main.html";
    localStorage.setItem("ConsumoBeb1",0);
    localStorage.setItem("ConsumoBeb2",0);
    localStorage.setItem("ConsumoBeb3",0);
    localStorage.setItem("ConsumoBeb4",0);
    localStorage.setItem("ConsumoBeb5",0);
    localStorage.setItem("ConsumoBeb6",0);
    localStorage.setItem("ConsumoBeb7",0);
    localStorage.setItem("ConsumoBeb8",0);
    localStorage.setItem("ConsumoBeb9",0);
    localStorage.setItem("ConsumoBeb10",0);
    localStorage.setItem("ConsumoBeb11",0);
    localStorage.setItem("ConsumoBeb12",0);
}

function right() {
    if (MM_status === MM_State.RUNNING) {
        closeEitherModal();
    } else if (MM_status !== MM_State.CLOSED) {
    } else if (displaystate < displays.length - 1) {
        displaystate++;
        for (i = 0; i < displays.length; i++) {
            rg = "" + ((-i + displaystate) * 100 + 10) + "%";
            document.getElementById(displays[i]).style.right = rg;
        }
    } else if (displaystate === displays.length - 1) {
        displaystate = 0;
        for (i = 0; i < displays.length; i++) {
            rg = "" + ((-i + displaystate) * 100 + 10) + "%";
            document.getElementById(displays[i]).style.right = rg;
        }
    }
}

function left() {
    if (MM_status === MM_State.RUNNING) {
        closeEitherModal();
    } else if (MM_status !== MM_State.CLOSED) {
    } else if (displaystate > 0) {
        displaystate--;
        for (i = 0; i < displays.length; i++) {
            rg = "" + ((-i + displaystate) * 100 + 10) + "%";
            document.getElementById(displays[i]).style.right = rg;
        }
    } else if (displaystate === 0) {
        displaystate = displays.length - 1;
        for (i = 0; i < displays.length; i++) {
            rg = "" + ((-i + displaystate) * 100 + 10) + "%";
            document.getElementById(displays[i]).style.right = rg;
        }
    }
}

//MQTT

//Funcion para obtener los ingredientes de cada una de las bebidas
function IngredientSubscriber(payload) {
    console.log("ingredientsub");
    if (DM_status === DM_State.LOADING) {
        showIngredientsAndButton(payload);
    }
}

//Funcion para obtener mis bebidas
function DrinkSubscriber(payload) {
    if (!started) {
        generateButtons(payload);
    }
}

//Funcion para obtener la lista de bebidas en mi HTML
function IngredientsListSubscriber(payload){
    if (!started) {
        generateIngredients(payload);
    }
}

function DoseStartSubscriber(payload) {
    if (DM_status === DM_State.REQUESTING && payload == document.getElementById("mod-drink").getAttribute("d_id")) {
        doseStart(payload);
        console.log("id was equal in startsubscriber");
    }
}

function publish(topic, payload) {
    console.log("publish-t: " + topic);
    console.log("publish-m: " + payload);
    message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    mqtt.send(message);
}

function DrinkProcessSubscriber(payload) {
    if (DM_status === DM_State.DOSING) {
        if (payload == "end") {
            doseEnded();
        } else {
            updateDosingState(payload);
        }
    }
}

function messageArrived(msg) {
    publish("logging", msg.destinationName + " - " + msg.payloadString);
    console.log("topic: " + msg.destinationName);
    console.log("payload: " + msg.payloadString);
    let topic = msg.destinationName;
    if (topic === TopicDrinkList + "/return") {
        DrinkSubscriber(msg.payloadString);
    } else if (topic === TopicIngredients + "/return") {
        IngredientSubscriber(msg.payloadString);
    } else if (topic === TopicDose + "/return") {
        DoseStartSubscriber(msg.payloadString);
    } else if (topic === TopicDose + "/progress") {
        DrinkProcessSubscriber(msg.payloadString);
    } else if (topic === IngredientsList + "return/"){
        IngredientsListSubscriber(msg.payloadString);
    }
}

function onConnect() {
    mqtt.subscribe(TopicDrinkList + "/return");
    mqtt.subscribe(TopicIngredients + "/return");
    mqtt.subscribe(IngredientsList + "/return");
    mqtt.subscribe(TopicDose + "/progress");
    mqtt.subscribe(TopicDose + "/return");
    publishatstart();
}

function publishatstart() {
    if (!started) {
        publish(TopicDrinkList, "true");
        publish(IngredientsList, "true");
        setTimeout(function e() { publishatstart(); }, 5000);
    }
}

function setUpMQTT() {
    mqtt = new Paho.MQTT.Client(host, port, "HectorFrontend");
    var options = { timeout: 3, onSuccess: onConnect, };
    mqtt.onMessageArrived = messageArrived;
    mqtt.connect(options);
}



