var DesignMAP = 'fbs'
var jm = null
var jm_kansei = null

$(document).ready(function () {
    // 获取所有需要切换的元素
    const $leftTop = $(".left_top");
    const $leftBottom = $(".left_bottom");
    const $fbsMindmap = $("#fbs-mindmap");
    const $kanseiMindmap = $("#kansei-mindmap");
    const $rightTop = $(".right_top");
    const $rightBottom = $(".right_bottom");
    const $imageContainer = $(".image-container");

    // FBS Design 按钮点击事件
    $("#fbs-button").click(function () {
        DesignMAP = 'fbs'

        // 改变按钮颜色
        $(this).addClass('active');
        $("#kansei-button").removeClass('active');

        // 隐藏或显示相关元素
        $leftBottom.addClass("hidden");
        $kanseiMindmap.addClass("hidden");
        $rightBottom.addClass("hidden");
        $imageContainer.addClass("hidden");

        $leftTop.removeClass("hidden");
        $fbsMindmap.removeClass("hidden");
        $rightTop.removeClass("hidden");
    });

    // Kansei Design 按钮点击事件
    $("#kansei-button").click(function () {
        DesignMAP = 'kansei'
        // 改变按钮颜色
        $(this).addClass('active');
        $("#fbs-button").removeClass('active');
        // 隐藏或显示相关元素
        $leftTop.addClass("hidden");
        $fbsMindmap.addClass("hidden");
        $rightTop.addClass("hidden");

        $leftBottom.removeClass("hidden");
        $kanseiMindmap.removeClass("hidden");
        $rightBottom.removeClass("hidden");
        $imageContainer.removeClass("hidden");

    });
});