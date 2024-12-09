document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
       items: [
        { id: 1, name: 'Vanilla Bites', img: '1.jpg', price: 20000 },
        { id: 2, name: 'Choco Bites', img: '2.jpg', price: 25000 },
        { id: 3, name: 'Mix Bites', img: '3.jpg', price: 30000 },
        { id: 4, name: 'Strawberry Bites', img: '4.jpg', price: 35000 },
        { id: 5, name: 'Matcha Bites', img: '5.jpg', price: 40000 },
        { id: 6, name: 'Biscuit Bites', img: '6.jpg', price: 50000 },
        
       ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {

             const cartItem = this.items.find((item) => item.id === newItem.id);

             if(!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
             } else {
                this.items = this.items.map((item) => {
                    if (item.id !== newItem.id) {
                        return item;
             } else {
                item.quantity++;
                item.total = item.price * item.quantity;
                this.total += item.price;
                return item;
             }
        });
      }
    },
    remove(id) {
        const cartItem = this.items.find((item) => item.id === id);
    
        if (cartItem) {
            if (cartItem.quantity > 1) {
                // Kurangi kuantitas jika lebih dari 1
                cartItem.quantity--;
                cartItem.total = cartItem.price * cartItem.quantity;
                this.quantity--;
                this.total -= cartItem.price;
            } else {
                // Hapus item jika kuantitas tinggal 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
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

checkoutButton.addEventListener('click',  function (e) {
    e.preventDefault();
    console.log('Checkout button clicked');
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('http://wa.me/62895637695297?text=' + encodeURIComponent(message));
    // minta transaction token menggunakan ajax
    // try{
    //     const response = await fetch('php/PlaceOrder.php',{
    //         method: 'POST',
    //         body: data,
    //     }); 
    //     const token = await response.text();
    //     console.log(token);
    //     // window.snap.pay('TRANSACTION_TOKEN_HERE');
    //     // window.snap.pay('token');

    // }catch(err){
    //     console.log(err.message);
    // }

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