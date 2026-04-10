// Image Switcher
function changeImage(thumb) {
    document.getElementById('mainImg').src = thumb.src;
    document.querySelectorAll('.thumbnails img').forEach(i => i.classList.remove('active'));
    thumb.classList.add('active');
}

// Update Quantity
function updateQty(btn, change) {
    let input = btn.parentElement.querySelector('.qty-input');
    let newVal = parseInt(input.value) + change;
    if (newVal < 0) newVal = 0;
    input.value = newVal;
    updateTotal();
}

// Calculate Totals and Fill Hidden Inputs
function updateTotal() {
    let productTotal = 0;
    let itemsList = [];

    // Loop through all products
    document.querySelectorAll('.product-card').forEach(card => {
        let name = card.dataset.name;
        let price = parseInt(card.dataset.price);
        let qty = parseInt(card.querySelector('.qty-input').value);
        let size = card.querySelector('.size-input').value;

        if (qty > 0) {
            productTotal += (price * qty);
            itemsList.push(`${name} (Size: ${size}) x ${qty}`);
        }
    });

    // Get Delivery Charge
    let deliveryPrice = parseInt(document.querySelector('input[name="delivery_charge"]:checked').value);
    let grandTotal = productTotal + deliveryPrice;

    // 1. Update Visual Summary
    document.getElementById('display-items').innerHTML = itemsList.length > 0 ? itemsList.join('<br>') : 'কোনো পণ্য সিলেক্ট করা হয়নি';
    document.getElementById('display-total').innerText = grandTotal + " ৳";

    // 2. Update Hidden Inputs for Netlify
    document.getElementById('orderedProducts').value = itemsList.join(' | ');
    document.getElementById('totalPriceInput').value = grandTotal;
}

// Handle Form Submission
const form = document.getElementById('checkoutForm');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop standard reload

    // Validation
    if (document.getElementById('orderedProducts').value === "") {
        alert("দয়া করে অন্তত একটি পণ্য সিলেক্ট করুন।");
        return;
    }

    // Prepare Data for Netlify
    const myFormData = new FormData(e.target);
    const urlEncodedData = new URLSearchParams(myFormData).toString();

    // Send Data
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: urlEncodedData
    })
    .then(() => {
        document.getElementById('successModal').style.display = 'flex';
        form.reset();
        document.querySelectorAll('.qty-input').forEach(i => i.value = 0);
        updateTotal();
    })
    .catch((error) => {
        alert("Submission Failed. Please try again.");
    });
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}