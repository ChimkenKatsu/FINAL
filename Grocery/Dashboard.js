// Select elements
const categoryButtons = document.querySelectorAll('.category-btn');
const carouselWrapper = document.getElementById('carousel-wrapper');
const cartList = document.getElementById('cart-list');
const totalPriceSpan = document.getElementById('total-price');
const checkoutButton = document.getElementById('checkout-btn');
const addItemButton = document.getElementById('add-item-btn');
const cartSection = document.querySelector('.cart-section');
const popup = document.getElementById('popup-form');
const itemForm = document.getElementById('item-form');
const itemNameInput = document.getElementById('item-name');
const itemCategoryInput = document.getElementById('item-category');
const itemImageInput = document.getElementById('item-image');
const itemPriceInput = document.getElementById('item-price');
const closePopupButton = document.getElementById('close-popup-btn');
const searchBar = document.getElementById('search-bar');
const editPopup = document.getElementById('edit-popup-form');
const editItemForm = document.getElementById('edit-item-form');
const editItemNameInput = document.getElementById('edit-item-name');
const editItemCategoryInput = document.getElementById('edit-item-category');
const editItemImageInput = document.getElementById('edit-item-image-file');
const editItemPriceInput = document.getElementById('edit-item-price');
const closeEditPopupButton = document.getElementById('close-edit-popup-btn');

let menuItems = document.querySelectorAll('.menu-item');
let cart = []; // Initialize cart

// Function to show popup with transition
function openPopup() {
    popup.classList.add('show'); // Add the show class to trigger CSS transition
}

// Function to hide popup with transition
function closePopup() {
    popup.classList.remove('show'); // Remove the show class to hide the popup with transition
}

// Function to show edit popup with transition
function openEditPopup(itemId) {
    const item = document.querySelector(`.menu-item img[data-id="${itemId}"]`).closest('.menu-item');
    if (item) {
        // Populate form with current item details
        editItemNameInput.value = item.querySelector('h3').textContent;
        editItemCategoryInput.value = item.dataset.category;
        editItemImageInput.value = ''; // Clear the image input value as it won't display image URL
        editItemPriceInput.value = item.querySelector('.menu-item-details p:nth-of-type(2)').textContent.replace('Price: $', '');

        // Set the hidden input with item ID
        document.getElementById('edit-item-id').value = itemId;

        // Set a placeholder for the existing image
        const existingImage = item.querySelector('.item-img').src;
        editPopup.querySelector('.existing-image').src = existingImage;
        editPopup.querySelector('.existing-image').style.display = 'block'; // Show existing image

        editPopup.classList.add('show'); // Show edit popup with transition
    }
}

// Function to hide edit popup with transition
function closeEditPopup() {
    editPopup.classList.remove('show'); // Hide edit popup with transition
}

// Function to populate menu based on selected category
function populateMenu(category) {
    menuItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items
        }
    });
}

// Event listener for search bar
searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    menuItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items
        }
    });
});

// Function to add item to cart
function addToCart(itemID) {
    const item = document.querySelector(`.menu-item img[data-id="${itemID}"]`).closest('.menu-item');
    if (!item) {
        console.error('Item not found for ID:', itemID);
        return;
    }

    const productName = item.querySelector('h3').textContent;
    const priceText = item.querySelector('p:nth-of-type(2)').textContent;
    const quantityText = item.querySelector('p:nth-of-type(4)').textContent;

    // Extract price and quantity
    const price = parseFloat(priceText.replace('Price: $', '').trim());
    const quantity = parseInt(quantityText.replace('Quantity: ', '').trim());

    if (isNaN(price) || isNaN(quantity)) {
        console.error('Invalid price or quantity:', priceText, quantityText);
        return;
    }

    // Check if item already exists in the cart
    const existingItem = cart.find(cartItem => cartItem.ProductName === productName);
    if (existingItem) {
        // Update quantity if item already in cart
        existingItem.Quantity += quantity;
    } else {
        // Add new item to the cart
        const cartItem = {
            ProductName: productName,
            Price: price,
            Quantity: quantity
        };
        cart.push(cartItem);
    }

    // Update the cart display
    updateCart();
}

// Function to update cart
function updateCart() {
    cartList.innerHTML = ''; // Clear the current cart list
    let totalPrice = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.ProductName} - $${(item.Price * item.Quantity).toFixed(2)} (x${item.Quantity})`;
        cartList.appendChild(li);

        totalPrice += item.Price * item.Quantity;
    });

    totalPriceSpan.textContent = totalPrice.toFixed(2);
}

// Function to show cart section
function showCart() {
    cartSection.style.display = 'block'; // Show cart section
}

// Function to show menu
function showMenu() {
    cartSection.style.display = 'none'; // Hide cart section
}

// Function to handle adding a new item
function handleAddItem(event) {
    event.preventDefault();
    
    const productName = itemNameInput.value.trim();
    const category = itemCategoryInput.value;
    const price = parseFloat(itemPriceInput.value.trim()); // Read price input
    const file = itemImageInput.files[0];

    if (!productName || !category || isNaN(price) || !file) {
        Swal.fire('Please fill in all fields and upload an image.', '', 'warning');
        return;
    }

    // Create an image URL from the file object
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        const newItemID = Date.now(); // Use current timestamp as a unique ID

        // Add the new item to the carousel
        const newItemHTML = `
            <div class="menu-item" data-category="${category}">
                <div class="menu-item-content">
                    <button class="edit-btn" data-id="${newItemID}">Edit</button>
                    <button class="remove-btn" data-id="${newItemID}">X</button> 
                    <img src="${imageUrl}" alt="${productName}" class="item-img" data-id="${newItemID}">
                    <h3>${productName}</h3>
                </div>
                <div class="menu-item-details">
                    <p>Brand: New Brand</p>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Weight/Volume: 1 lb</p>
                    <p>Quantity: 1</p>
                </div>
            </div>
        `;
        carouselWrapper.insertAdjacentHTML('beforeend', newItemHTML);

        // Reset the form and close the popup
        itemForm.reset();
        closePopup();

        // Re-query menu items and refresh menu display
        menuItems = document.querySelectorAll('.menu-item'); // Re-query items
        populateMenu(category); // Show newly added item based on the selected category
    };
    reader.readAsDataURL(file); // Read the image file as a Data URL
}

// Function to handle editing item details
function handleEditItem(event) {
    event.preventDefault();

    const itemId = document.getElementById('edit-item-id').value;
    const name = editItemNameInput.value.trim();
    const category = editItemCategoryInput.value;
    const price = parseFloat(editItemPriceInput.value.trim());
    const file = editItemImageInput.files[0]; // Updated to match file input

    if (!name || !category || isNaN(price)) {
        Swal.fire('Please fill in all fields.', '', 'warning');
        return;
    }

    const item = document.querySelector(`.menu-item img[data-id="${itemId}"]`).closest('.menu-item');
    if (item) {
        if (file) {
            // If a new image is uploaded, create a new URL
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                item.querySelector('.item-img').src = imageUrl;
            };
            reader.readAsDataURL(file);
        }

        item.querySelector('h3').textContent = name;
        item.querySelector('.menu-item-details p:nth-of-type(2)').textContent = `Price: $${price.toFixed(2)}`;
        item.dataset.category = category;

        closeEditPopup(); // Close the edit popup
    }
}

// Event listener for category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        populateMenu(category);

        // Highlight active category button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Event listener for clicking on item images to add to cart
carouselWrapper.addEventListener('click', event => {
    if (event.target.classList.contains('item-img')) {
        const itemID = event.target.getAttribute('data-id');
        addToCart(itemID);
    } else if (event.target.classList.contains('edit-btn')) {
        const itemID = event.target.getAttribute('data-id');
        openEditPopup(itemID);
    } else if (event.target.classList.contains('remove-btn')) {
        const itemID = event.target.getAttribute('data-id');
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, keep it'
        }).then(result => {
            if (result.isConfirmed) {
                removeItem(itemID);
                Swal.fire('Removed!', 'The item has been removed.', 'success');
            }
        });
    }
});

// Function to remove an item from the menu
function removeItem(itemID) {
    const item = document.querySelector(`.menu-item img[data-id="${itemID}"]`).closest('.menu-item');
    if (item) {
        item.remove(); // Remove the item from the DOM
        // Optionally: remove item from cart as well if needed
        cart = cart.filter(cartItem => cartItem.ProductName !== item.querySelector('h3').textContent);
        updateCart(); // Update the cart display
    } else {
        console.error('Item not found for ID:', itemID);
    }
}

// Event listener for checkout button
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        Swal.fire('Your cart is empty!', '', 'warning');
        return;
    }

    Swal.fire({
        title: 'Checkout Complete',
        text: `Total price: $${totalPriceSpan.textContent}`,
        icon: 'success'
    }).then(() => {
        // Clear the cart and update the display
        cart = [];
        updateCart(); // Clear the cart list and reset total price

        // Optionally, you can hide the cart section or reset its content
        showMenu(); // Show menu section after checkout
    });
});

// Event listener for add new item button
addItemButton.addEventListener('click', () => {
    openPopup(); // Show popup form with transition
});

// Event listener for form submission
itemForm.addEventListener('submit', handleAddItem);

// Event listener for close popup button
closePopupButton.addEventListener('click', () => {
    closePopup(); // Hide the popup with transition
});

// Event listener for form submission in the edit popup
editItemForm.addEventListener('submit', handleEditItem);

// Event listener for close edit popup button
closeEditPopupButton.addEventListener('click', () => {
    closeEditPopup(); // Hide the edit popup with transition
});

// Hide edit popup if user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === editPopup) {
        closeEditPopup(); // Hide the edit popup with transition
    }
});

// Event listener for image input change in edit popup
editItemImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const preview = editPopup.querySelector('.existing-image');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});
