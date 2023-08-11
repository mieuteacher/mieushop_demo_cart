
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
                <td>
                    <button onclick="updateItem(${productList[i].id}, '-')">-</button>
                    ${productList[i].quantity}
                    <button onclick="updateItem(${productList[i].id}, '+')">+</button>
                </td>
                <td>${productList[i].quantity * productList[i].price }</td>
                <td><button onclick="deleteItem(${productList[i].id})" type="button" class="btn btn-danger">Delete</button></td>
            </tr>
        `
    }

    tableDataString += `
            <tr>
                <th scope="row"></th>
                <td>Tổng Cộng</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>${productList.reduce((result, nextItem) => {
                    return result += (nextItem.quantity * nextItem.price)
                }, 0)}</td>
                <td></td>
            </tr>
        `
    document.getElementById("table_data").innerHTML = tableDataString;
}

renderTableData(JSON.parse(localStorage.getItem("userLogin")).carts)


function deleteItem(productId) {
    if(!confirm("Xóa ok?")) {
        return
    }
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    let userCart = userLogin.carts;
    userLogin.carts = userCart.filter(item => item.id != productId);

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
    // reload
    renderTableData(JSON.parse(localStorage.getItem("userLogin")).carts)
}

function updateItem(productId, type) {
    let userLogin = JSON.parse(localStorage.getItem("userLogin"));
    let userCart = userLogin.carts;
    if(type == '-') {

        for (let i in userLogin.carts) {
            if(userLogin.carts[i].id == productId) {
                
                if(userLogin.carts[i].quantity == 1) {
                        deleteItem(productId);
                        return
                }else {
                    userLogin.carts[i].quantity -= 1;
                }

                break;
            }
        }
    }else {
        userLogin.carts = userCart.map(item => {
            if(item.id == productId) {
                item.quantity += 1;
            }
            return item
        });
    }
    
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
    // reload
    renderTableData(JSON.parse(localStorage.getItem("userLogin")).carts)
}