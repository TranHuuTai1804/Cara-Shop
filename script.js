// Lấy các phần tử từ DOM
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

// Thêm sự kiện click cho biểu tượng 'bar' để hiển thị menu
if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

// Thêm sự kiện click cho biểu tượng 'close' để ẩn menu
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Thêm sự kiện click trên toàn bộ tài liệu để ẩn menu khi click bên ngoài
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && e.target !== bar && !bar.contains(e.target)) {
        nav.classList.remove('active');
    }
});

// Chạy khi tài liệu đã tải xong
document.addEventListener('DOMContentLoaded', function() {

    // Hiển thị giỏ hàng từ localStorage
    function displayCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const tbody = document.querySelector('#cart tbody');
        tbody.innerHTML = '';

        // Duyệt qua các mục trong giỏ hàng và thêm chúng vào bảng
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><i class="fa-solid fa-times-circle" style="cursor: pointer;"></i></td>
                <td><img src="${item.image}" width="100" alt="Product Image"></td>
                <td>${item.name}</td>
                <td class="price">$${item.price.toFixed(2)}</td>
                <td><input type="number" class="quantity" value="${item.quantity}" min="1"></td>
                <td class="subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
            `;
            tbody.appendChild(row);

            // Thêm sự kiện click để xóa sản phẩm khỏi giỏ hàng
            const removeIcon = row.querySelector('.fa-times-circle');
            removeIcon.addEventListener('click', function() {
                // Xóa sản phẩm khỏi localStorage
                const productName = item.name;
                let updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
                updatedCart = updatedCart.filter(cartItem => cartItem.name !== productName);
                localStorage.setItem('cart', JSON.stringify(updatedCart));

                // Xóa hàng khỏi bảng
                row.remove();

                // Cập nhật tổng giá trị giỏ hàng
                updateCartTotals();
            });

            // Thêm sự kiện thay đổi số lượng
            const quantityInput = row.querySelector('.quantity');
            quantityInput.addEventListener('change', function() {
                item.quantity = parseInt(quantityInput.value);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartTotals();
            });
        });

        // Cập nhật tổng giá trị giỏ hàng
        updateCartTotals();
    }

    // Hàm cập nhật tổng giá trị giỏ hàng
    function updateCartTotals() {
        const rows = document.querySelectorAll('#cart tbody tr');
        let cartSubtotal = 0;

        rows.forEach(row => {
            const price = parseFloat(row.querySelector('.price').textContent.replace('$', ''));
            const quantity = parseInt(row.querySelector('.quantity').value);
            const subtotal = price * quantity;

            // Cập nhật tổng phụ cho hàng này
            row.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;

            // Tính tổng giá trị
            cartSubtotal += subtotal;
        });

        // Cập nhật tổng phụ và tổng cộng
        document.getElementById('cart-subtotal').textContent = `$${cartSubtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${cartSubtotal.toFixed(2)}`;
    }


     // Xử lý khi nhấn nút "Proceed to checkout" và reset giỏ hàng
     document.querySelector('#checkoutBtn').addEventListener('click', function() {
        // Xóa giỏ hàng trong localStorage
        localStorage.removeItem('cart');
        
        // Reset lại hiển thị của giỏ hàng
        displayCart();
        
        // Có thể chuyển hướng đến trang xác nhận
        // window.location.href = 'confirmation.html';
    });

    // Hiển thị giỏ hàng khi trang được tải
    displayCart();
});


// Toast - Hiển thị thông báo
function toast({ title = '', message = '', type = '', duration = 1000 }) {
    const wrapper = document.querySelector('#toast');
    const toast = document.createElement('div');
    const durationDelays = (duration / 1000).toFixed(); // Công thức tính toán duration

    if (wrapper) {
        toast.classList.add('toast', `toast--${type}`);
        wrapper.appendChild(toast);

        // Xử lý thêm animation cho toast
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${durationDelays}s forwards`;

        // Tự động xoá toast khỏi DOM sau số giây chỉ định
        const stopTimeOut = setTimeout(() => {
            wrapper.removeChild(toast);
        }, duration + 1000); // 1000 ms là thời gian cho fadeOut animation

        // Khi bấm vào close xoá toast khỏi DOM
        toast.onclick = function (event) {
            if (event.target.closest('.toast__close')) {
                wrapper.removeChild(toast);
                clearTimeout(stopTimeOut); // khi bấm xoá toast sẽ dừng hàm setTimeout lại
            }
        };

        // Tạo danh sách icon
        const listIcon = {
            success: 'fas fa-check-circle', // Thêm icon cho success
            warning: 'fas fa-exclamation-circle',
            error: 'fas fa-exclamation-triangle'
        };

        // Nhét HTML vào thẻ toast
        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${listIcon[type]}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>
        `;
    }
}

// Hiển thị thông báo khi đã thêm vào giỏ hàng
function showSuccessToast() {
    toast({
      title: "Successful!",
      message: "You've added a product to your cart.",
      type: "success",
      duration: 1000
    });
  }

// Hiển thị thông báo khi sản phẩm đang được cập nhật
function showWarningToast() {
    toast({
        title: "Sorry!",
        message: "The product is being updated.",
        type: "warning",
        duration: 1000
    });
}

// Hiển thị thông tin chi tiết của sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Dữ liệu sản phẩm ví dụ (có thể thay đổi hoặc lấy từ API)
    const products = [
        { id: '1', name: 'Boxy Form Cotton Short Sleeve Polo Shirt', price: 78, description: 'Men is polo shirt with boxy shape, creating a comfortable and airy feeling. Cotton material is soft and absorbs sweat well, ideal for all daily activities. Outstanding pattern design and short sleeve style bring a dynamic, youthful look. The classic polo neck adds elegance and ease of coordination.', images: ['./img/products/o1_11zon.jpg', './img/products/o2_11zon.jpg', './img/products/o3_11zon.jpg', ] },
        { id: '2', name: 'Men is tank top. Loose ', price: 68, description: 'Men is tank top with Loose shape, made from cool cotton material, providing maximum comfort on hot days. The sleek, short-sleeved design helps you easily coordinate outfits, creating a dynamic and youthful appearance.', images: ['./img/products/bl1_11zon.jpg', './img/products/bl2_11zon.jpg', './img/products/bl3_11zon.jpg'] },
        { id: '3', name: 'Women is short-sleeved t-shirt. Regular ', price: 75, description: 'Women is T-shirt with regular shape, made from soft and breathable Cotton material. Outstanding design with fashionable patterns and short sleeves, suitable for all daily activities and creating a youthful, dynamic style.', images: ['./img/products/k1.jpg', './img/products/k2.jpg', './img/products/k3.jpg'] },
        { id: '4', name: 'Men is long-sleeved shirt. Fitted', price: 79, description: 'Men is shirt with fitted shape, hugging the body, creating a sharp and sophisticated look. High quality cotton material brings comfort and breathability. The sleek design and long sleeves help you easily coordinate with many different types of outfits, suitable for both office environments and formal occasions.', images: ['./img/products/p1_11zon.jpg', './img/products/p2_11zon.jpg', './img/products/p3_11zon.jpg', ] },
        { id: '5', name: 'Performance Care Men is Short Sleeve Polo Shirt', price: 79, description: 'Men is polo shirt with fitted form fits well, flatters the figure and creates a neat appearance. Cotton material is soft and sweat-absorbent, providing comfort all day long. The solid color design and rounded sleeves provide an elegant and easy-to-coordinate style. The classic polo neck completes the outfit with elegance and sophistication.', images: ['./img/products/pl1_11zon.jpg', './img/products/pl2_11zon.jpg', './img/products/pl3_11zon.jpg', ] },
        { id: '6', name: 'Long-sleeved shirt.', price: 79, description: 'The men is long-sleeved T-shirt with Regular shape is the perfect choice for those who love a simple yet sophisticated fashion style. Designed with high-quality cotton, the shirt feels comfortable and cool all day long Classic plain shirt with long sleeves, easy to combine with many different outfits, from office outfits to street outfits. This shirt not only brings elegance but also helps you confidently express your personal style. Suitable for all occasions and spaces, this is an indispensable product in the wardrobe of modern gentlemen.', images: ['./img/products/sw1.jpg', './img/products/sw2.jpg', './img/products/sw3.jpg'] },
        { id: '7', name: 'Men is 100% Cotton Short Sleeve Polo Shirt ', price: 79, description: 'Men is form fitted polo shirt hugs the body, creating a neat and stylish look. Made from 100% cotton, the shirt provides comfort and ease all day long. Creative color combination design and fashionable sleeves along with classic button collar provide an elegant and sophisticated look.', images: ['./img/products/x1.jpg', './img/products/x2.jpg', './img/products/x3.jpg'] },
        { id: '8', name: 'Men is 100% Cotton Baseball Cap Embroidered Freesize', price: 79, description: 'Unisex accessory with freesize form, made from 100% high quality Cotton. Outstanding design with unique patterns, bringing comfort and personal style to every user.', images: ['./img/products/m1.jpg', './img/products/m2.jpg', './img/products/m3.jpg'] },
        { id: '9', name: 'Men is shorts. Relax ', price: 79, description: 'Relax men is shorts, designed to provide maximum comfort during all activities. With a spacious and airy design, this product is perfect for walking around, traveling or light exercise, helping you feel comfortable all day long.', images: ['./img/products/n1.jpg', './img/products/n2.jpg', './img/products/n3.jpg'] },
        { id: '10', name: 'Slim Twill Men is Jeans ', price: 79, description: 'These Men is Slim Fit Jeans are the perfect combination of comfort and style. With Slim Fit shape, the pants fit just right, flattering your figure without causing discomfort. High quality Cotton material ensures durability and coolness, providing a comfortable feeling all day long. The highlight of these pants are the delicately designed pockets, which are not only highly aesthetic but also increase convenience when used. Men is Slim Fit Jeans are the perfect choice for all activities, from work, going out, to weekend walks.', images: ['./img/products/jean1_11zon.jpg', './img/products/jean_11zon.jpg', './img/products/jean2_11zon.jpg'] },
        { id: '11', name: 'Men is Slim Crop Vertical Striped Slim Trousers ', price: 79, description: 'Men is fabric pants with slim crop shape, giving a neat and modern look. Exquisite color combination design, creates a fashion highlight and easily coordinates with many different shirt styles. High quality fabric helps you feel comfortable and confident in any situation.', images: ['./img/products/qa1.jpg', './img/products/qa2.jpg', './img/products/qa3.jpg'] },
        { id: '12', name: 'Men is Wide-Leg Fleece Shorts 100% Cotton', price: 79, description: 'Loose shape men is shorts, made from 100% soft and breathable cotton. Simple plain design with convenient slanted pockets, ideal for summer or outdoor activities, providing comfort and active style.', images: ['./img/products/r1.jpg', './img/products/r2.jpg', './img/products/r3.jpg'] },
        { id: '13', name: 'Men is Cotton Spandex Straight Tube Shorts', price: 79, description: 'Straight shape men is shorts, made from slightly stretchy Cotton Spandex material, providing a snug and comfortable fit. Simple plain design with convenient slanted pockets, this product is the ideal choice for active summer days, easily coordinated with many different styles.', images: ['./img/products/s1.jpg', './img/products/s2.jpg', './img/products/s3.jpg'] },
        { id: '14', name: 'Men is Casual Pants Slim Fit Pleated Slim ', price: 79, description: 'Men is fabric pants with slim form, bringing neat and modern style. Durable and easy-care polyester material, combined with a simple design and convenient slanted pocket. The ideal product for looking elegant and comfortable in all activities.', images: ['./img/products/z1_11zon.jpg', './img/products/z2_11zon.jpg', './img/products/z3_11zon.jpg'] },
        { id: '15', name: 'Regular Form Women is Plain Long Sleeve Shirt', price: 79, description: 'Women is regular shirt with 55% viscose and 45% poly material. Solid color design, long sleeves and buttoned collar bring elegance and ease of coordination.', images: ['./img/products/nu2_11zon.jpg', './img/products/nu1_11zon.jpg', './img/products/nu3_11zon.jpg'] },
        { id: '16', name: 'Men is Swim Trunks Elastic Waist Pockets Straight', price: 79, description: 'Straight shape men is swimming trunks with durable polyester material, outstanding pattern design and convenient straight pockets. The product offers the perfect combination of style and function.', images: ['./img/products/j1_11zon.jpg', './img/products/j2_11zon.jpg', './img/products/j3_11zon.jpg'] },
    ];

   
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('productName').innerText = product.name;
        document.getElementById('productPrice').innerText = `$${product.price}`;
        document.getElementById('productDescription').innerText = product.description;
        document.getElementById('Maining').src = product.images[0];

        document.querySelectorAll('.small-img').forEach((img, index) => {
            img.src = product.images[index] || './img/placeholder.jpg';
        });

        document.getElementById('addToCartButton').addEventListener('click', function() {
            const cartProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: document.getElementById('Maining').src, // Sử dụng hình ảnh chính
                quantity: parseInt(document.getElementById('quantityInput').value, 10) || 1
            };
            addToCart(cartProduct);
        });
    }
});

// Hàm thêm sản phẩm vào giỏ hàng và lưu trong localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
        // Tăng số lượng nếu sản phẩm đã có trong giỏ hàng
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}



// Thay đổi hình ảnh chính khi click vào hình ảnh nhỏ
var Maining = document.getElementById("Maining");
var smalling = document.getElementsByClassName("small-img");

// Cập nhật hình ảnh chính khi click vào hình ảnh nhỏ
for (var i = 0; i < smalling.length; i++) {
    smalling[i].onclick = function() {
        Maining.src = this.src;
    };
}

smalling[0].onclick = function() {
    Maining.src = smalling[0].src;
}
smalling[1].onclick = function() {
    Maining.src = smalling[1].src;
}
smalling[2].onclick = function() {
    Maining.src = smalling[2].src;
}
smalling[3].onclick = function() {
    Maining.src = smalling[3].src;
}

