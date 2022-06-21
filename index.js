
let produk = [];
let count = 0;
let cart = [];
class Produk {
    constructor(_sku, _preview, _nama, _category, _stok, _harga) {
        this.sku = _sku;
        this.preview = _preview;
        this.name = _nama;
        this.category = _category;
        this.stok = _stok;
        this.harga = _harga
    }
}
class FnB extends Produk {
    constructor(_sku, _preview, _nama, _category, _stok, _harga, _expired) {
        super(_sku, _preview, _nama, _category, _stok, _harga);
        this.expired = _expired
    }
}
const handleDate = () => {
    let form = document.getElementById("product-form");
    if (form.elements["category"].value == "FnB") {
        form.elements["expDate"].disabled = false;
    } else {
        form.elements["expDate"].disabled = true;
    }
}

const getProduct = () => {
    let form = document.getElementById("product-form");
    count++;
    let sku = `SKU-${count < 10 ? `0${count}` : count}-${Math.round(Math.random() * 1000000)}`;
    let gambar = form.elements["gambar"].value;
    let nama = form.elements["produk"].value;
    let kategori = form.elements["category"].value;
    let stok = parseInt(form.elements["stok"].value);
    let harga = parseInt(form.elements["harga"].value);
    let expDate = form.elements["expDate"].value;

    if (gambar == "" || nama == "" || kategori == "null" || stok == NaN || harga == NaN) {
        alert("Isi semua data dengan benar");
    } else {
        if (kategori == "General") {
            produk.push(new Produk(sku, gambar, nama, kategori, stok, harga))
        } else if (kategori == "FnB") {
            produk.push(new FnB(sku, gambar, nama, kategori, stok, harga, expDate))
        }
    }

    printData(produk);

    form.elements["produk"].value = null;
    form.elements["gambar"].value = null;
    form.elements["category"].value = null;
    form.elements["stok"].value = null;
    form.elements["harga"].value = null;
    form.elements["expDate"].value = null;
    form.elements["expDate"].disabled = true;
}

const printData = (data, sku) => {
    document.getElementById("list-produk").innerHTML = data.map((val, idx) => {
        if (val.sku == sku) {
            return `<tr>
        <td>${idx + 1}</td>
        <td> <input type="text" id="produkbaru" value="${val.name}"></td>
        <td>${val.sku}</td>
        <td><img src="${val.preview}" width=75px></td>
        <td>${val.category}</td>
        <td> <input type="number" id="stokbaru" value="${val.stok}"></td>
        <td><input type="number" id="hargabaru" value="${val.harga}"></td>
        <td>${val.expired ? val.expired : "-"}</td>
        <td><button type="button" onclick="handleSave('${val.sku}')">Save</button> <br> <button type="button" onclick="handleCancel()">Cancel</button></td>
        </tr > `
        } else {
            return `<tr>
        <td>${idx + 1}</td>
        <td>${val.name}</td>
        <td>${val.sku}</td>
        <td><img src="${val.preview}" width=75px></td>
        <td>${val.category}</td>
        <td>${val.stok}</td>
        <td>Rp. ${val.harga.toLocaleString('id')}</td>
        <td>${val.expired ? val.expired : "-"}</td>
        <td><button type="button" onclick="handleDelete('${val.sku}')">Hapus Data</button> <br> 
        <button type="button" onclick="handleEdit('${val.sku}')">Edit Data</button> <br>
        <button type="button" onclick="handleBuy('${val.sku}')">Beli</button> </td>
        </tr > `
        }
    }
    )
        .join("");
}

const handleFilter = () => {
    let filterform = document.getElementById("filter-form");
    let filter = [];
    let dataFilter = {
        name: filterform.elements["filterproduk"].value,
        sku: filterform.elements["filterSKU"].value,
        category: filterform.elements["filtercategory"].value,
        harga: filterform.elements["filterharga"].value
    }

    produk.forEach((val, idx) => {
        let dataProp = Object.keys(val); // Untuk mengambil properti dari value
        let filterProp = Object.keys(dataFilter);
        let filterCheck = [];
        dataProp.forEach((prop) => {
            if (filterProp.includes(prop)) {
                if (dataFilter[prop] && dataFilter[prop] != "null") {
                    if (val[prop] == dataFilter[prop]) {
                        filterCheck.push(true);
                    } else {
                        filterCheck.push(false);
                    }
                }
            }
        })
        console.log(filterCheck);
        if (!filterCheck.includes(false)) {
            filter.push(val);
        }
    })
    printData(filter);
}
const handleReset = () => {
    let form = document.getElementById('filter-form');
    form.elements["filterproduk"].value = null
    form.elements["filterSKU"].value = null
    form.elements["filtercategory"].value = null
    form.elements["filterharga"].value = null
    printData(produk);
}

const handleDelete = (sku) => {
    // Cara pertama
    // for (let i = 0; i < produk.length; i++) {
    //     if (produk[i].sku == sku) {
    //         produk.splice(i, 1);
    //     }
    // }


    // Cara kedua
    let index = produk.findIndex((val) => val.sku == sku);
    produk.splice(index, 1);
    printData(produk);
}

const handleEdit = (sku) => {
    printData(produk, sku);
}

const handleSave = (sku) => {
    let index = produk.findIndex((val) => val.sku == sku);
    produk[index].name = document.getElementById("produkbaru").value
    produk[index].stok = parseInt(document.getElementById("stokbaru").value)
    produk[index].harga = parseInt(document.getElementById("hargabaru").value)
    printData(produk);
}

const handleCancel = () => {
    printData(produk);
}

class Cart {
    constructor(_name, _sku, _preview, _qty, _harga) {
        this.name = _name;
        this.sku = _sku;
        this.preview = _preview;
        this.qty = _qty;
        this.harga = _harga;
    }
}
const printCart = () => {
    document.getElementById("list-cart").innerHTML = cart.map((val, idx) => {
        return `<tr>
        <td>${idx + 1}</td>
        <td>${val.name}</td>
        <td>${val.sku}</td>
        <td><img src="${val.preview}" width=75px></td>
        <td>
            <button type="button" onclick="handleDec('${val.sku}')">-</button>
            ${val.qty}
            <button type="button" onclick="handleInc('${val.sku}')">+</button>
        </td>
        <td>Rp. ${val.harga.toLocaleString('id')}</td>
        <td>Rp. ${(val.qty * val.harga).toLocaleString('id')}</td>
        <td><button type="button" onclick="handleDeleteCart('${val.sku}')">Hapus Data</button> <br> 
        </tr > `
    })
        .join("");
}
const handleBuy = (sku) => {
    let index = produk.findIndex((val) => val.sku == sku)
    let indexcart = cart.findIndex((val) => val.sku == sku)
    if (produk[index].stok > 0) {
        if (cart[indexcart]) {
            cart[indexcart].qty = cart[indexcart].qty + 1;
        }
        else {
            cart.push(new Cart(produk[index].name, produk[index].sku, produk[index].preview, 1, produk[index].harga));
        }
        produk[index].stok = produk[index].stok - 1;
        printData(produk);
        printCart();
    } else {
        alert(`Stock Habis`);
    }
}

const clearCart = () => {
    for (let i = 0; i < produk.length; i++) {
        for (let j = 0; j < cart.length; j++) {
            if (cart[j].sku == produk[i].sku) {
                produk[i].stok = produk[i].stok + cart[j].qty;
            }
        }
    }
    cart = [];
    printData(produk);
    printCart();
}

const handleDec = (sku) => {
    let index = produk.findIndex((val) => val.sku == sku)
    let indexcart = cart.findIndex((val) => val.sku == sku)
    produk[index].stok += 1;
    cart[indexcart].qty -= 1;
    printData(produk);
    printCart();
    if (cart[indexcart].qty == 0) {
        cart.splice(indexcart, 1);
        printCart();
    }
}

const handleInc = (sku) => {
    let index = produk.findIndex((val) => val.sku == sku)
    let indexcart = cart.findIndex((val) => val.sku == sku)
    if (produk[index].stok > 0) {
        produk[index].stok -= 1;
        cart[indexcart].qty += 1;
        printData(produk);
        printCart();
    }
    else {
        alert(`Stock Habis`);
    }
}

const handleDeleteCart = (sku) => {
    let index = produk.findIndex((val) => val.sku == sku)
    let indexcart = cart.findIndex((val) => val.sku == sku);
    produk[index].stok = produk[index].stok + cart[indexcart].qty
    cart.splice(indexcart, 1);
    printData(produk);
    printCart();
}