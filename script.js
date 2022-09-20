const productBtns = document.querySelectorAll(".card-btns");
const cartDiv = document.getElementById("cart-details");
const totalDiv = document.getElementById("totalValue");

// Check out Button
const checkOutBtn = document.getElementById("checkOutBtn");

// Shopping Cart Array
let cartData = [];

productBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = btn.parentElement.parentElement;

    // Cart Data
    const data = {
      id: Number(parent.id),
      img: parent.querySelector("img").src,
      name: parent.querySelector(".card-name").textContent,
      price: Number(parent.querySelector(".card-price").textContent),
      qty: 1,
    };

    const existItem = cartData.find((item) => item.id === data.id);
    if (existItem) {
      return alert("Already in cart");
    }

    cartData.unshift(data);
    HTML_RESETER();
    showCartData();
    showTotal();
    // Add to localstorage
    addToLocalStorage();
  });
});

const showTotal = () => {
  const total = cartData
    .reduce((acc, curr) => acc + curr.price * curr.qty, 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  totalDiv.innerHTML += `₱${total}`;
};

const showCartData = () => {
  let item = cartData
    .map((cartItem) => {
      return `
      <div id="${cartItem.id}" class="cart-items">
        <div>
          <img
            height="100px"
            width="150px"
            src="${cartItem.img}"
          />
        </div>
        <div class="cart-item-details">
          <p>Name: <span class="cart-name"> ${cartItem.name} </span></p>
          <p>Price:<span class="cart-price"> ${cartItem.price}  </span></p>
          <p>Quantity: <span class="cart-qty"> ${cartItem.qty} </span></p>
          <div>
            <button class="btn btnAddQty">+</button>
            <button class="btn btnSubtractQty">-</button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  cartDiv.innerHTML += item;
  btnAddQtyFunc();
  btnSubtractQtyFunc();
};

const btnAddQtyFunc = () => {
  const btns = document.querySelectorAll(".btnAddQty");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      HTML_RESETER();

      const parent = btn.parentNode.parentElement.parentElement;
      const id = parseInt(parent.id);
      const updatedCart = cartData.map((cart) => {
        if (cart.id === id) {
          return {
            ...cart,
            qty: cart.qty + 1,
          };
        } else {
          return {
            ...cart,
          };
        }
      });
      cartData = updatedCart;

      showCartData();
      showTotal();
      addToLocalStorage();
    });
  });
};

const btnSubtractQtyFunc = () => {
  const btns = document.querySelectorAll(".btnSubtractQty");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      HTML_RESETER();

      const parent = btn.parentNode.parentElement.parentElement;
      const id = parseInt(parent.id);
      const cartItem = cartData.find((cart) => cart.id === id);

      if (!cartItem) {
        return alert("No cart found");
      }

      let updatedCart = [];
      if (cartItem.qty <= 1) {
        updatedCart = cartData.filter((cart) => cart.id !== id);
      } else {
        updatedCart = cartData.map((cart) => {
          if (cart.id === id) {
            return {
              ...cart,
              qty: cart.qty - 1,
            };
          } else {
            return {
              ...cart,
            };
          }
        });
      }
      cartData = updatedCart;

      showCartData();
      showTotal();
      addToLocalStorage();
    });
  });
};

checkOutBtn.addEventListener("click", () => {
  if (cartData.length <= 0) {
    return alert("Error cant procced, your cart is empty!");
  }
  alert(JSON.stringify(cartData));
  cartData = [];
  HTML_RESETER();
  addToLocalStorage();
});

const HTML_RESETER = () => {
  totalDiv.innerHTML = "";

  const cartItems = cartDiv.querySelectorAll(".cart-items");
  cartItems.forEach((item) => {
    item.remove();
  });
};

const addToLocalStorage = () => {
  // let cart = JSON.parse(localStorage.getItem("cartData"));
  localStorage.setItem("cartData", JSON.stringify(cartData));
};

// Localstorage Checker
const localStorageChecker = () => {
  let localStorageCartItems = JSON.parse(localStorage.getItem("cartData"))
    ? JSON.parse(localStorage.getItem("cartData"))
    : [];
  cartData = localStorageCartItems;
};

window.addEventListener("load", () => {
  localStorageChecker();
  showCartData();
  showTotal();
});
