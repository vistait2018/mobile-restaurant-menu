import { menuArray } from "./data.js";
let orderArray = [];
const htmlContainer = document.getElementById("content");
const orderContainer = document.querySelector(".your-order");
document.addEventListener("click", function (e) {
  if (e.target.id) {
    if (e.target.id === "send-order") {
      document.getElementById("payment-card").style.display = "block";
    }
    if (e.target.id === "pay") {
          const form = document.getElementById("my-order-form");
      if (!form.checkValidity()) {
        return;
      }
      e.preventDefault();

    
      const formData = new FormData(form);
      orderContainer.innerHTML = "";
      orderContainer.innerHTML += `<p class="result">Thanks ${formData.get(
        "name"
      )}! Your order is on the way.</p>`;
      console.log(orderContainer.innerHTML)
      document.getElementById("payment-card").style.display = "none";
      return;
    }
    const menuId = e.target.id;
    const exists = checkifOrderExistInOrders(menuId);

    console.log(`orderArray:`, orderArray);
    console.log(`exists: ${exists}`);

    if (!exists) {
      addToOrder(menuId);
    } else {
      removeFromOrder(menuId);
    }

    document.getElementById(menuId).classList.toggle("orange");
    updateOrderDisplay();
  }
});
function checkifOrderExistInOrders(menuId) {
  const id = Number(menuId);
  return orderArray.some((order) => order.id === id);
}

function addToOrder(menuId) {
  const id = Number(menuId);
  const menuItem = menuArray.find((item) => item.id === id);
  if (menuItem) {
    orderArray.push(menuItem);
  }
}

function removeFromOrder(menuId) {
  const id = Number(menuId);
  const index = orderArray.findIndex((order) => order.id === id);
  if (index !== -1) {
    orderArray.splice(index, 1);
  }
}

function generateString(menus) {
  return menus
    .map((menu) => {
      return render(menu);
    })
    .join("");
}

function render(menu) {
  let { id, name, ingredients, price, emoji } = menu;
  let imageLocation = getImage(emoji);
  return ` <div class="container container-content">
                <div class="description">
                   <div class="description-content">
                    <img class="menu-icon" src="${imageLocation}" alt="cup of beer">
                     <div class="food" >
                       <h1>${name}</h1>
                        <h2>${ingredients.join(",")}</h2>
                        <h3>$${price}</h3>
                     </div>
                      
                    </div>

                </div>
                    <i id="${id}" class="fa fa-plus-circle plus-icon" aria-hidden="true"></i>
                
                
            </div>
    `;
}

function getImage(icon) {
  let imgLocation = "";
  if (icon === "🍕") {
    imgLocation = "images/piza.png";
  } else if (icon === "🍔") {
    imgLocation = "images/burger.png";
  } else if (icon === "🍺") {
    imgLocation = "images/beer.png";
  }
  return imgLocation;
}

function renderMyOrder(order) {
  if (!order || order.length === 0) return "";
  const total = order.reduce((sum, item) => sum + item.price, 0);
  return `
 
    ${generateOrderString(order)}
    
    <hr>
    
    <div class="order-info">
      <p class="order-item">Total price</p>
      <p class="order-amount">$${total}</p>
    </div>
    <button id="send-order" class="order-btn">Complete Order</button>
      `;
}

function generateOrderString(order) {
  return order
    .map((o) => {
      return `
    <div class="wrapper">
      <div class="order-info-item">
        <p class="order-item">${o.name}</p>
        <p class="remove" data-id="${o.id}">remove</p>
      </div>
      <p class="order-amount">$${o.price}</p>
      </div>
    `;
    })
    .join("");
}

function updateOrderDisplay() {
  if (orderArray.length === 0) {
    orderContainer.innerHTML = ""; // Clear if no items
    return;
  }

  orderContainer.innerHTML = `
    <h1 class="order-title">Your order</h1>
    ${renderMyOrder(orderArray)}
  `;
}

htmlContainer.innerHTML += generateString(menuArray);
