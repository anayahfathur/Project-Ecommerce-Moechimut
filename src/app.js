document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
       items: [
        { id: 1, name: 'Vanilla Bites', img: '1.jpg', price: 17000 },
        { id: 2, name: 'Choco Bites', img: '2.jpg', price: 17000 },
        { id: 3, name: 'Mix Bites', img: '3.jpg', price: 17000 },
        { id: 4, name: 'Strawberry Bites', img: '4.jpg', price: 17000 },
        { id: 5, name: 'Matcha Bites', img: '5.jpg', price: 17000 },
        { id: 6, name: 'Biscuit Bites', img: '6.jpg', price: 17000 },
        
       ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            // Cek apakah item sudah ada di keranjang
            const cartItem = this.items.find((item) => item.id === newItem.id);
    
            if (!cartItem) {
                // Jika item belum ada, tambahkan item baru
                this.items = [{ ...newItem, quantity: 1, total: newItem.price }];
                this.quantity = 1;
                this.total = newItem.price;
            } else {
                // Jika item sudah ada, perbarui jumlah dan total (tetap 1 item)
                this.items = [{ ...cartItem, quantity: 1, total: cartItem.price }];
                this.quantity = 1;
                this.total = cartItem.price;
            }
        },
        remove(id) {
            // Hapus item jika ada dalam keranjang
            const cartItem = this.items.find((item) => item.id === id);
    
            if (cartItem) {
                this.items = []; // Hapus semua item
                this.quantity = 0;
                this.total = 0;
            }
        }
    });
    
    });
    
    

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true; 

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled'); 
        } else {
            return false; 
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');

});
//kirim data ketika tombol checkout di klick
checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Checkout button clicked');
    
    // Ambil data dari form
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);

    // Ambil informasi pesanan yang relevan dari objData
    const orderId = objData.orderId;  // Misalnya, jika ada field 'orderId' di form
    const totalAmount = objData.totalAmount;  // Misalnya, jika ada field 'totalAmount' di form

    // Tentukan URL pembayaran berdasarkan informasi pesanan
    let paymentUrl = '';

    if (orderId && totalAmount) {
        // Jika ada orderId dan totalAmount, sesuaikan link pembayaran
        paymentUrl = `https://app.sandbox.midtrans.com/payment-links/${orderId}`;
    } else {
        // Jika tidak ada informasi, gunakan URL default
        paymentUrl = 'https://app.sandbox.midtrans.com/payment-links/1733834364844';
    }

    // Buka link yang sesuai
    window.open(paymentUrl);
});

// format pesan wa
const formatMessage = (obj) => {
    return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No Hp: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    TOTAL: ${rupiah(obj.total)}
    Terima kasih.`;

};

const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};