const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyQKdNQL7w2YBuFjZFqCgxCSukrWXj2t5B5J7dnwDV2bOxS_bMZrCh73cl6I4ornbg1/exec";

const form = document.getElementById("inventoryForm");
const submitBtn = document.getElementById("submitBtn");

let editingProductID = "";

loadInventory();


form.addEventListener("submit", function (e) {

    e.preventDefault();

    const formData = new FormData();

    if (editingProductID === "") {
        formData.append("action", "add");
    } else {
        formData.append("action", "update");
        formData.append("productID", editingProductID);
    }

    formData.append("productName", document.getElementById("productName").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("size", document.getElementById("size").value);
    formData.append("color", document.getElementById("color").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("supplier", document.getElementById("supplier").value);

    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(result => {

        alert(result);

        form.reset();

        editingProductID = "";

        submitBtn.textContent = "Add Product";

        loadInventory();

    })
    .catch(error => {

        console.error(error);

        alert("Error saving product.");

    });

});


function loadInventory() {

    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {

            const table = document.getElementById("inventoryTable");

            table.innerHTML = "";

            let totalStock = 0;
            let lowStock = 0;

            data.forEach(product => {

                totalStock += Number(product.stock);

                if (Number(product.stock) <= 10) {
                    lowStock++;
                }

                table.innerHTML += `
                    <tr>

                        <td>${product.productID}</td>
                        <td>${product.productName}</td>
                        <td>${product.category}</td>
                        <td>${product.size}</td>
                        <td>${product.color}</td>
                        <td>₱${product.price}</td>
                        <td>${product.stock}</td>
                        <td>${product.supplier}</td>

                        <td>
                            <button onclick="editProduct('${product.productID}')">Edit</button>
                            <button onclick="deleteProduct('${product.productID}')">Delete</button>
                        </td>

                    </tr>
                `;

            });

            document.getElementById("totalProducts").textContent = data.length;
            document.getElementById("totalStock").textContent = totalStock;
            document.getElementById("lowStock").textContent = lowStock;

            // Save inventory globally so editProduct() can access it
            window.inventoryData = data;

        })
        .catch(error => console.error(error));

}


function deleteProduct(productID) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    const formData = new FormData();

    formData.append("action", "delete");
    formData.append("productID", productID);

    fetch(SCRIPT_URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(result => {

        alert(result);

        loadInventory();

    })
    .catch(error => {

        console.error(error);

        alert("Error deleting product.");

    });

}


function editProduct(productID) {

    const product = window.inventoryData.find(p => p.productID === productID);

    if (!product) return;

    editingProductID = product.productID;

    document.getElementById("productName").value = product.productName;
    document.getElementById("category").value = product.category;
    document.getElementById("size").value = product.size;
    document.getElementById("color").value = product.color;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;
    document.getElementById("supplier").value = product.supplier;

    submitBtn.textContent = "Update Product";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
