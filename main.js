let categories = ["Laptop", "Desktop", "Mobile"]

let products = [
    {
        id: Date.now() * Math.random(),
        name: "Asus " +  Date.now(),
        price: 12000000,
        avatar: "https://cdn.tgdd.vn/Products/Images/44/302473/asus-gaming-rog-strix-scar-18-g834jy-i9-n6039w-thumb-600x600.jpg",
        category: categories[0]
    },
    {
        id: Date.now() * Math.random(),
        name: "Lenovo " +  Date.now(),
        price: 78000000,
        avatar: "https://cdn.mediamart.vn/images/product/laptop-asus-vivobook-a515ea-bq1530w_9f8ffa98.jpg",
        category: categories[0]
    },
    {
        id: Date.now() * Math.random(),
        name: "Desktop 2 " +  Date.now(),
        price: 1300000,
        avatar: "https://www.tncstore.vn/image/catalog/BAI%20VIET/Cach%20build%20PC%20Gaming%20Gia%20re/125.%20(1).jpg",
        category: categories[1]
    },
    {
        id: Date.now() * Math.random(),
        name: "Desktop 3 " +  Date.now(),
        price: 5600000,
        avatar: "https://www.tncstore.vn/image/catalog/BAI%20VIET/PC%20Gaming%20m%E1%BB%9Bi/96_pc_gaming%20(1).jpg",
        category: categories[1]
    },
    {
        id: Date.now() * Math.random(),
        name: "Samsung xxl " +  Date.now(),
        price: 4000000,
        avatar: "https://cdn.tgdd.vn/Products/Images/42/264060/samsung-galaxy-s23-600x600.jpg",
        category: categories[2]
    }
]

let users = [
    {
        id: Date.now() * Math.random(),
        email: "admin@gmail.com",
        password: "123",
        role: 1,// 1: admin, 0: member,
        address: [],
        phoneNumber: '0329577177',
        carts: [],
    },
    {
        id: Date.now() * Math.random(),
        email: "member@gmail.com",
        password: "123",
        role: 0,// 1: admin, 0: member,
        address: [],
        phoneNumber: '0815777339',
        carts: [],
    }
]

if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products))
}

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users))
}

function renderTableData(productList) {
    let tableDataString = ``;

    for (let i = 0; i < productList.length; i++) {
        tableDataString += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${productList[i].name}</td>
                <td>${productList[i].price}</td>
                <td>
                    <img style="width: 50px; height: 50px; border-radius: 50%;" src="${productList[i].avatar}" >
                </td>
                <td>${productList[i].category}</td>
                <td><button onclick="buyItem(${productList[i].id})" type="button" class="btn btn-danger">Mua</button></td>
            </tr>
        `
    }
    document.getElementById("table_data").innerHTML = tableDataString;
}


renderTableData(JSON.parse(localStorage.getItem("products")));

function removeAccentLowerCase(str) {
    return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

function searchByInfo(event) {
    let productCopy = [...JSON.parse(localStorage.getItem("products"))];
    productCopy = productCopy.filter(product => removeAccentLowerCase(product.name + product.price + product.category).includes(removeAccentLowerCase(event.target.value)));
    renderTableData(productCopy);
}

function getProductById(productId) {
    return JSON.parse(localStorage.getItem("products")).find(product => product.id == productId);
}

function buyItem(productId) {
    let userLogin = localStorage.getItem("userLogin");
    if(userLogin) {
        userLogin = JSON.parse(userLogin);

        // console.log("productId",productId)
        // console.log("productId",getProductById(productId))
        let itemIncart = userLogin.carts.find(item => item.id == productId);
        if(itemIncart) {
            itemIncart.quantity += 1;

            let carts = userLogin.carts.map(item => {
                if(item.id == itemIncart.id) {
                    return itemIncart
                }
                return item
            })

            userLogin.carts = carts;

            //save to local
            localStorage.setItem("userLogin", JSON.stringify(userLogin))
            
            let users = JSON.parse(localStorage.getItem("users"));

            users = users.map(user => {
                if(user.id == userLogin.id) {
                    return userLogin
                }
                return user
            })
            localStorage.setItem("users", JSON.stringify(users))

        }else {
            let product = getProductById(productId);
            product.quantity = 1;
            userLogin.carts.push(product)
            //save to local
            localStorage.setItem("userLogin", JSON.stringify(userLogin))
            
            let users = JSON.parse(localStorage.getItem("users"));

            users = users.map(user => {
                if(user.id == userLogin.id) {
                    return userLogin
                }
                return user
            })

            // for (let i = 0; i < users.length; i++) {
            //     if(users[i].id == userLogin.id) {
            //         users[i] = userLogin;
            //     }
            // }
            
            localStorage.setItem("users", JSON.stringify(users))
        }
    }else {
        /* chưa đăng nhập */
    }
    countCart()
}

if(localStorage.getItem("userLogin")) {
    document.getElementById("userlogin").innerText = "User đang login: " + JSON.parse(localStorage.getItem("userLogin")).email
}

function countCart() {
    let userLogin = localStorage.getItem("userLogin");
    let cart_count_el = document.getElementById("cart_count");
    if(userLogin) {
        cart_count_el.innerText = JSON.parse(userLogin).carts.reduce((result, nextItem) => {
            return result += nextItem.quantity;
        }, 0)
    }else {
        cart_count_el.innerText = 0;
    }
}

countCart();

let flag = false;
function sortByPrice() {
    let products = JSON.parse(localStorage.getItem("products"));
    if (flag) {
        products.sort((a, b) => a.price - b.price);
    }else {
        products.sort((a, b) => b.price - a.price);
    }
    flag = !flag;
    renderTableData(products)
}
