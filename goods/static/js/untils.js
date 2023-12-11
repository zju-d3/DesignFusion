var anser_5W1H = null;
var gpt_response = null;



function genRandomID() {
    const randomNumber = Math.floor(Math.random() * 100000) + 1; // 随机生成1～100000的整数
    return randomNumber.toString(); // 转换为字符串
}

// 后端异步传输
function sendDataToBackend(formData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/UI_mindmap/",
            type: "POST",

            // data: dataInput,
            data: formData,
            contentType: false,
            processData: false,
            dataType: "JSON",
            headers: {
                'X-CSRFToken': getCookie('csrftoken')  // 获取CSRF令牌并将其添加到请求头
            },
            success: function (response) {
                gpt_response = response
                resolve(response); // 解析 Promise

            },
            error: function (error) {
                console.log(error);
                reject(error); // 拒绝 Promise
            }
        });
    });
}

// 用于获取cookie的函数
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}
