// 思维导图交互

// 记录当前选中的kanseibox-container内容
var selectedLabel = "design-concept1"; // 默认选中shape

// 添加Structures框
$(document).ready(function () {
    let counter = 2; // 因为你已经有Structures 1和Structures 2

    $('#add-structure').click(function () {
        let newQuestionContainer = `
        <div class="question-container">
          <div class="question-box">
<<<<<<< HEAD
            <div class="kanseibox-container" data-label="design-concept${counter}">Structures ${counter}</div>
=======
            <div class="kanseibox-container" data-label="design-concept${counter}">Structure ${counter}</div>
>>>>>>> show
          </div>
          <div class="answer-box">
            <textarea id="design-concept${counter}-answer" class="kansei-scheme-textarea"
              placeholder="Enter your design concept here."></textarea>
          </div>
        </div>
      `;

        $('.structures-container').append(newQuestionContainer);
        counter++;
    });

    $('.map2text-container').on('click', '.kanseibox-container', function () {
        selectedLabel = $(this).data('label');
        updateSelectedBackground();
    });
});




// 点击kanseibox-container更改当前选中内容
document.querySelectorAll('.kanseibox-container').forEach((label) => {
    label.addEventListener('click', function () {
        selectedLabel = this.getAttribute('data-label');
    });
});

function updateSelectedBackground() {
    // 移除所有已经被选中的背景色
    $('.kanseibox-container').removeClass('selected');

    // 添加新的背景色
    const selectedElem = $(`[data-label="${selectedLabel}"]`);
    if (selectedElem) {
        selectedElem.addClass('selected');
    }
}

// 初始设置
updateSelectedBackground();

// 点击kanseibox-container更改当前选中内容
document.querySelectorAll('.kanseibox-container').forEach((label) => {
    label.addEventListener('click', function () {
        selectedLabel = this.getAttribute('data-label');
        updateSelectedBackground();
    });
});



// 按下command + G，将选中的节点内容复制到对应的<textarea>
document.addEventListener('keydown', function (e) {
    if ((e.key === 'u' || e.key === 'p') && e.metaKey) {
        e.preventDefault();  // 阻止浏览器的默认行为

        // 检查哪个思维导图实例被选中
        let selectedNode;
        // 检查哪个思维导图实例被选中
        if (jm.get_selected_node() != 'null') {
            selectedNode = jm.get_selected_node(); // jm 的选中节点
        } else if (jm_kansei.get_selected_node()) {
            selectedNode = jm_kansei.get_selected_node(); // jm_kansei 的选中节点
        }

        if (selectedNode) {
            var topic = selectedNode.topic;
            var pre_value = $(`#${selectedLabel}-answer`).val();

            if (e.key === 'u') {
                e.preventDefault();  // 阻止浏览器的默认行为
                $(`#${selectedLabel}-answer`).val(topic);  // 当按下 'u'
            } else if (e.key === 'p') {
                e.preventDefault();  // 阻止浏览器的默认行为
                $(`#${selectedLabel}-answer`).val(pre_value + ' ' + topic);  // 当按下 '+'
            }
        }

    }
});