let addBtn = document.querySelector(".add-btn")
let modalCont = document.querySelector(".modal-cont")
let addFlag = false;
let mainCont = document.querySelector(".main-cont")
let textareaCont = document.querySelector(".textarea-cont")
let allPriorityColor = document.querySelectorAll(".priority-color")

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];

//  listener for modal priority coloring

allPriorityColor.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColor.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border")
        })
        colorElem.classList.add("border")
        modalPriorityColor = colorElem.classList[0];
    })
})

addBtn.addEventListener('click', (e) => {
    // display modal 

    // generate ticket
    //  addflag = true ->modal display: 
    addFlag = !addFlag
    if (addFlag) {
        modalCont.style.display = "flex"
    } else {
        modalCont.style.display = "none"
    }
    // addflag=false -> modal none 
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textareaCont.value, shortid());
        modalCont.style.display = "none";
        addFlag = false;
        textareaCont.value = "";
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class", "ticket-cont");
    ticketcont.innerHTML = `<div class="ticket-cont">
    <div class="${ticketColor} ticket-color"></div>
    <div class="ticket-id">#${ticketID}</div>
    <div class="task-area">${ticketTask}</div>
    </div>`;
    mainCont.appendChild(ticketcont)
}