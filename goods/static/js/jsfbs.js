// gpt 返回
$(document).ready(function () {
    createContextMenu()
    // 输入设计问题
    $('#design-begin').click(function () {

        var DesignConcept = new FormData()

        DesignConcept.append("designID", '5W1H')
        DesignConcept.append("message", $('#design-problem').val())

        sendDataToBackend(DesignConcept).then(() => {
            add5W1H();
            initMindMap("Design");
            createContextMenu();
        }).catch((error) => {
            console.log("Error while sending data: ", error);
        });

    });

    // 输入Requirements 输出Function
    $('#send-5w1h').click(function () {

        var requirementsData = new FormData()
        var requirements =
            $('#who').val() + '\n' +
            $('#what').val() + '\n' +
            $('#when').val() + '\n' +
            $('#why').val() + '\n' +
            $('#where').val() + '\n' +
            $('#how').val();

        // var requirements = $('#who').val() + '\n' + $('#who').val() + '\n' + $('#when').val() + '\n' + $('#what').val() + '\n' + $('#where').val() + '\n' + $('#how').val()
        requirementsData.append("designID", "Requirements")
        requirementsData.append("requirements", requirements)

        // sendDataToBackend(requirementsData);
        sendDataToBackend(requirementsData).then(() => {
            addFunctions()
        }).catch((error) => {
            console.log("Error while sending data: ", error);
        });

    });

    // 输入Function 输出Behaviors
    // Behavior 数据结构示例:
    // {
    //     'Function1': {
    //         'Behavior1': 'Corresponding Detailed Behavior Description',
    //         'Behavior2': 'Corresponding Detailed Behavior Description'
    //     },
    //     'Function2': {
    //         'Behavior1': 'Corresponding Detailed Behavior Description',
    //         'Behavior2': 'Corresponding Detailed Behavior Description'
    //     },
    //     ...
    // }
    $('#behaviors-generate').click(function () {
        var functionsData = getFunctions();

        sendDataToBackend(functionsData).then(() => {
            addBehaviors()
        }).catch((error) => {
            console.log("Error while sending data: ", error);
        });

    });

    // 输入Behaviors 输出structures
    $('#sructures-generate').click(function () {
        var behaviorsData = getBehaviors();

        sendDataToBackend(behaviorsData).then(() => {
            addSructures()
        }).catch((error) => {
            console.log("Error while sending data: ", error);
        });

    });

    // 输入kansei-words 
    $('#kansei-words').click(function () {
        var kanseiData = getKansei();

        sendDataToBackend(kanseiData).then(() => {
            initMindMapKansei("Design")
            addKansei()
        }).catch((error) => {
            console.log("Error while sending data: ", error);
        });

    });

    // 向diuffusion输入prompt
    $('#image-generate').click(function () {
        $(".image-box").removeClass('hidden');
        // var imgData = getDiffusion();
        // sendDataToBackend(imgData).then(() => {
        //     addImage()
        // }).catch((error) => {
        //     console.log("Error while sending data: ", error);
        // });



    });


});

function singleReload() {
    var ReloadData = reload();
    sendDataToBackend(ReloadData).then(() => {
        console.log(gpt_response)

    }).catch((error) => {
        console.log("Error while sending data: ", error);
    });

}


function add5W1H() {
    console.log('add5W1H')

    console.log(gpt_response)
    var keys = ["Who", "What", "When", "Why", "Where", "How"];
    for (var key of keys) {
        if (gpt_response[key] !== undefined && gpt_response[key] !== null && gpt_response[key].trim() !== "") {
            $('#' + key.toLowerCase()).val(gpt_response[key]);
        }
    }

}

function addFunctions() {
    console.log(gpt_response)

    var nodeList = Object.keys(gpt_response);
    var nodeIDList = Object.keys(gpt_response);
    var rootID = jm.get_root()['id']
    for (let k = 0; k < nodeList.length; k++) {
        nodeList[k] = "<h3>" + nodeList[k] + "</h3>";
    }
    addData2MindMap(jm, rootID, nodeIDList, nodeList);

}

function getFunctions() {
    var functionsData = new FormData()

    let topics = jm.get_root().children.map(child => child.topic);
    var functions = topics.join('\n');
    console.log(functions);


    functionsData.append("designID", "Functions")
    functionsData.append("functions", functions)
    return functionsData
}

function addBehaviors() {
    console.log(gpt_response)
    var funcNodeList = Object.keys(gpt_response);
    for (let i = 0; i < funcNodeList.length; i++) {
        var beIDList = Object.keys(gpt_response[funcNodeList[i]]) // behavior key
        var beNodeList = Object.values(gpt_response[funcNodeList[i]])

        for (let k = 0; k < beNodeList.length; k++) {
            beNodeList[k] = "<h3>" + beIDList[k] + "</h3> <hr>" + beNodeList[k];
        }
        addData2MindMap(jm, funcNodeList[i], beIDList, beNodeList);
    }
}

function getBehaviors() {
    var behaviorsData = new FormData()

    if (jm && jm.get_root()) {
        var behaviorsList = jm.get_root().children.reduce((acc, funcNode) => {
            // 使用正则表达式提取 <h3> 和 </h3> 之间的内容
            var match = funcNode.topic.match(/<h3>(.*?)<\/h3>/);
            var content = match ? match[1] : '';

            if (jm.get_node(content)) {
                var behaviors = jm.get_node(content).children.map(child => child.id);
                return acc.concat(behaviors);
            }
            return acc;
        }, []);
    } else {
        console.error("jm或者其根节点是null");
    }
    var behaviorsString = behaviorsList.join('\n')

    behaviorsData.append("designID", "Behaviors")
    behaviorsData.append("behaviors", behaviorsString)
    return behaviorsData
}

function addSructures() {
    console.log(gpt_response)
    var beNodeList = Object.keys(gpt_response);
    for (let i = 0; i < beNodeList.length; i++) {
        var sctIDList = Object.keys(gpt_response[beNodeList[i]]) // behavior key
        var sctNodeList = Object.values(gpt_response[beNodeList[i]])

        for (let k = 0; k < sctNodeList.length; k++) {
            sctNodeList[k] = "<h3>" + sctIDList[k] + "</h3> <hr>" + sctNodeList[k];
        }
        addData2MindMap(jm, beNodeList[i], sctIDList, sctNodeList);
    }
}

function getKansei() {
    var kanseiData = new FormData()

    kanseiData.append("designID", "Kansei")
    kanseiData.append("kansei_n", $('#kansei-words-n').val())
    kanseiData.append("kansei_a", $('#kansei-words-a').val())
    return kanseiData
}

function addKansei() {
    console.log(gpt_response)

    var rootID = jm_kansei.get_root()['id'];
    var kanseiTypeList = Object.keys(gpt_response);
    var kanseiTypeList_show = Object.keys(gpt_response);
    for (let k = 0; k < kanseiTypeList_show.length; k++) {
        kanseiTypeList_show[k] = "<h3>" + kanseiTypeList_show[k] + "</h3>";
    }

    addData2MindMap(jm_kansei, rootID, kanseiTypeList, kanseiTypeList_show);

    for (let i = 0; i < kanseiTypeList.length; i++) {
        var kanseiIDList = Object.keys(gpt_response[kanseiTypeList[i]])
        var kanseiNodeList = Object.values(gpt_response[kanseiTypeList[i]]);

        for (let k = 0; k < kanseiNodeList.length; k++) {
            kanseiNodeList[k] = "<h3>" + kanseiIDList[k] + "</h3> <hr> " + kanseiNodeList[k];
        }
        addData2MindMap(jm_kansei, kanseiTypeList[i], kanseiIDList, kanseiNodeList);
    }

}

function getDiffusion() {
    var diffusionData = new FormData()
    var design = $('#design-problem').val();
    var shapeValue = $('#shape-answer').val();
    var colorValue = $('#color-answer').val();
    var textureValue = $('#texture-answer').val();

    var diffusionString = "Product shot of" + design + shapeValue + ", " + colorValue + ", " + textureValue;


    diffusionData.append("designID", "Image")
    diffusionData.append("image", diffusionString)

    return diffusionData
}

function addImage() {
    console.log(gpt_response)
    var imgList = gpt_response;

    // 清空现有的图片
    $('.image-box').empty();

    // 添加新图片
    for (var i = 0; i < imgList.length; i++) {
        $('.image-box').append('<img src="/static/' + imgList[i] + '" alt="Image" />');
    }
}


// 右键菜单栏
// 右键添加菜单
function createContextMenu() {
    const $container = $('.mindmap-container');
    // 先移除旧的 contextMenu，避免多个菜单
    $("#contextMenu").remove();

    const $menu = $(
        `<div id="contextMenu">
            <ul>
                <li id="addNode">Add Node</li>
                <li id="removeNode">Delete Node</li>
<<<<<<< HEAD
                <li id="reload">Reload </li>
=======
                <li id="reload">Regenerate </li>
>>>>>>> show
            </ul>
        </div>`
    ).css({
        display: "none",
        position: "absolute",
        zIndex: 9999  // 使菜单显示在最前面
    }).appendTo('.mindmap-container');

    // 容器上的右键点击事件
    $container.off("contextmenu").on("contextmenu", function (event) {
        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;

        $menu.css({
            left: x,
            top: y,
            display: "block"
        });
    });

    // 绑定单击事件到菜单项
    $("#addNode").off('click').on('click', function (event) {
        event.stopPropagation();
        if (DesignMAP === 'fbs' && jm.get_selected_node() !== null) {
            menuAddChild(jm);
        } else if (DesignMAP === 'kansei' && jm_kansei.get_selected_node() !== null) {
            menuAddChild(jm_kansei);
        } else {
            alert("Please at least select one node!")
        }

        $menu.hide();

    });

    $("#removeNode").off('click').on('click', function (event) {
        event.stopPropagation();
        if (DesignMAP === 'fbs' && jm.get_selected_node() !== null) {
            menuRemoveChild(jm);
        } else if (DesignMAP === 'kansei' && jm_kansei.get_selected_node() !== null) {
            menuRemoveChild(jm_kansei);
        } else {
            alert("Please at least select one node!")
        }

        $menu.hide();
    });

    $("#reload").off('click').on('click', function (event) {
        event.stopPropagation();
        if (DesignMAP === 'fbs' && jm.get_selected_node() !== null) {
            reload(jm);
        } else if (DesignMAP === 'kansei' && jm_kansei.get_selected_node() !== null) {
            reload(jm_kansei);
        } else {
            alert("Please at least select one node!")
        }

        $menu.hide();
    });

    $container.off("click").on("click", function () {
        $menu.hide();
    });
}

function menuAddChild(jmInstance) {
    let selectedNode = jmInstance.get_selected_node()
    jmInstance.add_node(selectedNode.id, genRandomID(), 'New Node', null, 'right')
}

function menuRemoveChild(jmInstance) {
    let selectedNode = jmInstance.get_selected_node()
    jmInstance.remove_node(selectedNode)

}

/**
 * 重新加载选定节点的数据。
 * @param {Object} jmInstance - 思维导图的实例。
 * @returns {FormData} 返回要发送到后端的FormData对象。
 */
function reload(jmInstance) {
    let selectedNode = jmInstance.get_selected_node();

    let reload_type = findNodeType(jmInstance.get_root().id, selectedNode);

    var reloadData = new FormData();

    const DesignID = {
        SINGLE_FUNCTION: 'signleFunction',
        SINGLE_BEHAVIOR: 'signleBehavior',
        SINGLE_STRUCTURE: 'signleStructure',
        SINGLE_COLOR: 'signleColor',
        SINGLE_SHAPE: 'signleShape',
        SINGLE_TEXTURE: 'signleTexture'
    };

    if (DesignID[reload_type]) {
        reloadData.append('designID', DesignID[reload_type]);
        sendDataToBackend(reloadData).then(() => {
            console.log(gpt_response)
            addReloadNode(jmInstance, selectedNode, reload_type)

        }).catch((error) => {
            console.log("Error while sending data: ", error);
        });


    } else {
        // 错误处理，可以根据实际需要添加更多逻辑
        console.warn('Invalid or unknown node type:', reload_type);
    }

    // return selectedNode;
}


/**
 * 根据选定的思维导图和节点，确定节点的类型。
 * @param {string} selectMap - 思维导图的类型，如 "fbs"。
 * @param {Object} selectedNode - 选定的节点。
 * @returns {string} 返回节点的类型。
 */
function findNodeType(selectMap, selectedNode) {
    if (!selectedNode) {
        return 'selectedNode InvalidNode'; // 或其他适当的错误处理
    }

    if (selectMap === 'Design') {
        return findFBSNodeType(selectedNode);
    } else {
        return findOtherNodeType(selectedNode);
    }
}

/**
 * 辅助函数：根据FBS思维导图的节点，确定节点的类型。
 * @param {Object} selectedNode - 选定的节点。
 * @returns {string} 返回节点的类型。
 */
function findFBSNodeType(selectedNode) {
    const FBSNodeType = {
        NO: 'Root',
        SINGLE_FUNCTION: 'SINGLE_FUNCTION',
        SINGLE_BEHAVIOR: 'SINGLE_BEHAVIOR',
        SINGLE_STRUCTURE: 'SINGLE_STRUCTURE'
    };

    // 检查 selectedNode 是否为 null 或 undefined
    if (!selectedNode) {
        console.log('UnknownType')
        return 'findFBSNodeType selectedNode UnknownType: null or undefined'; // 或者其他适当的处理
    }

    let depth = 0;
    let currentNode = selectedNode;
    console.log(currentNode)


    while (currentNode && currentNode.parent !== null) {
        depth++;
        currentNode = currentNode.parent;
    }

    switch (depth) {
        case 0: return FBSNodeType.NO;
        case 1: return FBSNodeType.NO;
        case 2: return FBSNodeType.SINGLE_FUNCTION;
        case 3: return FBSNodeType.SINGLE_BEHAVIOR;
        case 4: return FBSNodeType.SINGLE_STRUCTURE;
        default: return 'depth UnknownType';
    }
}

/**
 * 辅助函数：根据其他类型思维导图的节点，确定节点的类型。
 * @param {Object} selectedNode - 选定的节点。
 * @returns {string} 返回节点的类型。
 */
function findOtherNodeType(selectedNode) {
    const OtherNodeType = {
        SINGLE_COLOR: 'SINGLE_COLOR',
        SINGLE_SHAPE: 'SINGLE_SHAPE',
        SINGLE_TEXTURE: 'SINGLE_TEXTURE'
    };

    let type = selectedNode.parent ? selectedNode.parent.id : '';

    switch (type) {
        case 'Color': return OtherNodeType.SINGLE_COLOR;
        case 'Shape': return OtherNodeType.SINGLE_SHAPE;
        case 'Texture': return OtherNodeType.SINGLE_TEXTURE;
        default: return 'findOtherNodeType UnknownType';
    }
}


function addReloadNode(jmInstance, selectedNode, reload_type) {
    if (reload_type === 'SINGLE_FUNCTION') {
        addFunctions();
    } else {
        var parentID = selectedNode.parent.id
        var nodeIDList = Object.keys(gpt_response)
        var nodeList = Object.values(gpt_response)
        nodeList = "<h3>" + nodeIDList + "</h3> <hr>" + nodeList

        addData2MindMap(jmInstance, parentID, [nodeIDList], [nodeList])
    }

}
















