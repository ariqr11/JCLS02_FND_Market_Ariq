class Produk {
    constructor(_nama, _sku, _preview, _category, _stok, _harga) {
        this.name = _nama;
        this.sku = _sku;
        this.preview = _preview;
        this.category = _category;
        this.stok = _stok;
        this.harga = _harga
    }
}

class FnB extends Produk {
    constructor(_nama, _sku, _preview, _category, _stok, _harga, _expired) {
        super(_nama, _sku, _preview, _category, _stok, _harga);
        this.expired = _expired
    }
}

let produk = [
    new Produk("Topi", "SKU-01-123456", "https://cdn1-production-images-kly.akamaized.net/wRIF7UgcnVNjJOh-vVZwOtxTgdk=/1200x900/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/2754021/original/029823500_1552891993-foto_HL_topi.jpg", "General", 20, 35000),
    new FnB("Telur", "SKU-02-654321", "https://asset.kompas.com/crops/WYVtX9H9wYlXZDwLmMqHiw2ZJc4=/0x7:740x500/750x500/data/photo/2020/11/13/5fae4aae98da3.jpg", "FnB", 20, 35000, "2022-06-20"),
    new FnB("Kentang", "SKU-03-321456", "https://image-cdn.medkomtek.com/AqKL90eISrf_GbhYtRAuAi9Simc=/640x640/smart/klikdokter-media-buckets/medias/2302888/original/079980300_1547360960-Makan-Kentang-Mentah-ini-Bahayanya-By-success863-Shutterstock.jpg", "FnB", 20, 35000, "2022-07-20"),
    new Produk("Jacket", "SKU-04-135642", "https://media.gq.com/photos/616f1e50af7badb1a03350cd/master/w_2000,h_1333,c_limit/Landing-Leathers-A-2-bomber-jacket.jpg", "General", 20, 35000)
];
let count = 4;
let cart = [];
let checkoutCart = [];
let user = [];
let reportTrans = [];

const handleDate = () => {
    let form = document.getElementById("product-form");
    if (form.elements["category"].value == "FnB") {
        form.elements["expDate"].disabled = false;
    } else {
        form.elements["expDate"].disabled = true;
    }
}

const login = () => {
    user.push(document.getElementById("user").value)
    document.getElementById("user").value = null;
}

const getProduct = () => {
    let form = document.getElementById("product-form");
    count++;
    let nama = form.elements["produk"].value;
    let sku = `SKU-${count < 10 ? `0${count}` : count}-${Math.round(Math.random() * 1000000)}`;
    let gambar = form.elements["gambar"].value;
    let kategori = form.elements["category"].value;
    let stok = parseInt(form.elements["stok"].value);
    let harga = parseInt(form.elements["harga"].value);
    let expDate = form.elements["expDate"].value;

    if (gambar == "" || nama == "" || kategori == "null" || stok == NaN || harga == NaN) {
        alert("Isi semua data dengan benar");
    } else {
        if (kategori == "General") {
            produk.push(new Produk(nama, sku, gambar, kategori, stok, harga))
        } else if (kategori == "FnB") {
            produk.push(new FnB(nama, sku, gambar, kategori, stok, harga, expDate))
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
        <button type="button" id="buy" onclick="handleBuy('${val.sku}')">Beli</button> </td>
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
        <td><input type="checkbox" id="${val.sku}"></td>
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
    if (user.length > 0) {
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
    else {
        alert(`Isi user terlebih dahulu`);
    }
}

const deleteSomeCart = () => {
    let deleteCart = [];
    cart.forEach((val) => {
        if (document.getElementById(val.sku).checked) {
            deleteCart.push(val);
        }
    })
    if (deleteCart.length == 0) {
        alert(`Silahkan pilih item terlebih dahulu`);
    }
    else {
        let konfirmasi = confirm(`Apakah yakin ingin menghapus barang belanja?`);
        if (konfirmasi == true) {
            for (let i = 0; i < deleteCart.length; i++) {
                for (let j = 0; j < cart.length; j++) {
                    if (deleteCart[i].sku == cart[j].sku) {
                        let index = produk.findIndex((val) => val.sku == cart[j].sku);
                        produk[index].stok += cart[j].qty;
                        cart.splice(j, 1);
                    }
                }
            }
        }
    }
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

const checkOutCart = () => {
    cart.forEach((val) => {
        if (document.getElementById(val.sku).checked) {
            checkoutCart.push(val);
        }
    })
    document.getElementById("list-checkout").innerHTML = checkoutCart.map((val, idx) => {
        return `<tr>
        <td>${val.sku}</td>
        <td>Rp. ${(val.qty * val.harga).toLocaleString('id')}</td >
        </tr>`
    })
        .join("");

    let total = 0;
    for (let i = 0; i < checkoutCart.length; i++) {
        total += checkoutCart[i].qty * checkoutCart[i].harga;
    }

    document.getElementById("total-checkout").innerHTML = `
        <tr>
        <th>Total Pembayaran</th>
        <th> Rp. ${total.toLocaleString('id')} </th>
        </tr>
        <tr>
        <th>Uang Pembayaran</th>
        <th><input type="number" id="uang-bayar"><button type="button" onclick="payment()">Payment</button></th>
        </tr>`

    for (let i = 0; i < checkoutCart.length; i++) {
        for (let j = 0; j < cart.length; j++) {
            if (checkoutCart[i].sku == cart[j].sku) {
                cart.splice(j, 1);
            }
        }
    }
    printCart();
}

let totalUang = 0;
const payment = () => {
    let total = 0;
    for (let i = 0; i < checkoutCart.length; i++) {
        total += checkoutCart[i].qty * checkoutCart[i].harga;
    }
    totalUang = total;
    let uang = parseInt(document.getElementById("uang-bayar").value);
    if (uang >= total) {
        document.getElementById("display").innerHTML = "";
        alert(`Pembayaran berhasil, kembalian anda Rp. ${(uang - total).toLocaleString('id')}`)
        checkoutCart = [];
        checkOutCart();
        report();
    }
    else {
        document.getElementById("display").innerHTML = "Uang anda kurang";
        setTimeout(() => document.getElementById("display").innerHTML = "", 4000)
    }

}

const report = () => {
    reportTrans.push({
        name: user[user.length - 1],
        total: totalUang
    })
    document.getElementById("report").innerHTML = reportTrans.map((val, idx) => {
        return `<tr>
        <td>${idx + 1}</td>
        <td>${Date()}</td>
        <td>${val.name}</td>
        <td>Rp. ${(val.total).toLocaleString('id')}</td >
        </tr>`
    })
        .join("");

    let omset = 0;

    for (let i = 0; i < reportTrans.length; i++) {
        omset += reportTrans[i].total;
    }
    document.getElementById("omset").innerHTML = `Omset : ${omset.toLocaleString('id')}`
    user = [];
}

