window.onload = function() {
    var totalItemPriceNode = document.getElementById("totalPrice");

    var itemNodes =  document.getElementById("tbody").children;
    var totalItemPrice = 0;
    

    for(var i=0; i<itemNodes.length;i++) {
        totalItemPrice = accAdd(itemNodes[i].children[3].innerText.split('$')[1], totalItemPrice);
    }

    totalItemPriceNode.innerText = "Total Price: $" + totalItemPrice;
}


// function insc(itemTitle, itemPrice) {
//     var countNode = document.getElementById(itemTitle);
//     var count = countNode.value;
//     var totalValueNode = countNode.parentNode.parentNode.children[3];
//     var parameter = {itemTitle: itemTitle};
//     var currentPrice = totalValueNode.innerText.split('$')[1];
//     var jqxhr = $.get("/checkout/checkStock", parameter);
//     jqxhr.done(function(result){
//         console.log(result);
//         if (parseInt(result) > parseInt(count)) {
//             countNode.setAttribute('value', parseInt(count) + 1);
//             totalValueNode.innerText = "$" + accAdd(currentPrice, itemPrice);
//         } else {
//             alert("Maximum purchase quantity reached!");
//         }
//     })
//     jqxhr.fail(function(jqXHR) {
//         console.log("insc wrong!" + jqXHR.status);
//     });
    
// }

function insc(itemTitle, itemPrice) {
    var countNode = document.getElementById(itemTitle);
    var count = countNode.value;
    countNode.value = parseInt(count) + 1;
    onChangeHandler(itemTitle, itemPrice);
   
    // countNode.setAttribute('value', parseInt(count) + 1);
}

function dec(itemTitle, itemPrice) {
    var countNode = document.getElementById(itemTitle);
    var count = countNode.value;

    if(parseInt(count)>=0){
        // countNode.setAttribute('value', parseInt(count) - 1);
        countNode.value = parseInt(count) - 1;
        onChangeHandler(itemTitle, itemPrice);
    };
}


// function dec(itemTitle, itemPrice) {
//     var countNode = document.getElementById(itemTitle);
//     var count = countNode.value;
//     var totalValueNode = countNode.parentNode.parentNode.children[3];
//     var currentPrice = totalValueNode.innerText.split('$')[1];
    

//     if(parseInt(count)>0){
//         totalValueNode.innerText = "$" + accSub(currentPrice, itemPrice);
//         countNode.setAttribute('value', parseInt(count) - 1);		
//     };
// }

function onChangeHandler(itemTitle, itemPrice){
    var countNode = document.getElementById(itemTitle);
    var count = countNode.value;
    var totalValueNode = countNode.parentNode.parentNode.children[3];
    var itemNodes =  document.getElementById("tbody").children;
    var parameter = {itemTitle: itemTitle};

    if (count <= 0) {
      console.log("111");
      removeItem(itemTitle);
    }
    var jqxhr = $.get("/checkout/checkStock", parameter);
    jqxhr.done(function(result){
        console.log(result);
        if (parseInt(result) >= parseInt(count)) {
            totalValueNode.innerText = "$" + accMul(itemPrice, count);
        } else {
            
            countNode.value = result;
            totalValueNode.innerText = "$" + accMul(itemPrice, result);
            alert("Exceeded maximum stock, will be set to maximum stock");
        }
        var totalItemPriceNode = document.getElementById("totalPrice");
        var totalItemPrice = 0;
        

        for(var i=0; i<itemNodes.length;i++) {
            totalItemPrice = accAdd(itemNodes[i].children[3].innerText.split('$')[1], totalItemPrice);
        }

        totalItemPriceNode.innerText = "Total Price: $" + totalItemPrice;
    })
    jqxhr.fail(function(jqXHR) {
        console.log("insc wrong!" + jqXHR.status);
    });

    
}

function removeItem(itemTitle) {
  var parameter = {itemTitle: itemTitle};
  var jqxhr = $.get("/checkout/removeItem", parameter);
    jqxhr.done(function(result) {
        console.log(result);
    })
  var countNode = document.getElementById(itemTitle);
  var nodeToRemove = countNode.parentNode.parentNode;
  var tbody =  document.getElementById("tbody");
  tbody.removeChild(nodeToRemove);


}



// author：dingFY
// link：https://juejin.cn/post/6844903903071322119
  function accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {}
    try {
      m += s2.split(".")[1].length;
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }

// author：dingFY
// link：https://juejin.cn/post/6844903903071322119
  function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
  }




