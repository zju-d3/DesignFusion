function addData2MindMap(targetMindMap, parentID, nodeID, nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
        targetMindMap.add_node(parentID, nodeID[i], nodeList[i], null, "right")
    }
}

function initMapData(topic, container, theme = 'pumpkin') {
    var mind = {
        "meta": {
            "name": "AI Design",
            "author": "Designers",
            "version": "0.1"
        },
        "format": "node_tree",
        "data": {
            "id": topic,
            "topic": topic

        }
    };
    var options = {
        container: container,
        editable: true,
        theme: theme,
        view: {
            node_overflow: 'wrap' // 节点文本过长时的样式
        },

    };
    return { mind, options }
}

function createMindMap(options, mind, jmVariable) {
    jmVariable = new jsMind(options);
    jmVariable.show(mind);
    return jmVariable;
}


function initMindMap(topic) {
    const { mind, options } = initMapData(topic, 'fbs-mindmap');
    jm = createMindMap(options, mind, jm);
    // 为第一个思维导图实例 jm 添加点击事件监听器
    jm.add_event_listener(function (type, o) {
        if (type === jsMind.event_type.click) {
            const nodeId = o.node.id;
            const topic = o.node.topic;
            copyTopicToTextarea(nodeId, topic, 'jm');
        }
    });
}

function initMindMapKansei(topic) {
    const { mind, options } = initMapData(topic, 'kansei-mindmap', 'belizehole');
    jm_kansei = createMindMap(options, mind, jm_kansei);
    // 为第二个思维导图实例 jm_kansei 添加点击事件监听器
    jm_kansei.add_event_listener(function (type, o) {
        if (type === jsMind.event_type.click) {
            const nodeId = o.node.id;
            const topic = o.node.topic;
            copyTopicToTextarea(nodeId, topic, 'jm_kansei');
        }
    });

}