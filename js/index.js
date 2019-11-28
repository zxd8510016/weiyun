$(function () {
    //通过数据渲染视图
    var thumbList = $('.list-item');
    createElementLi(thumbList);

    var lists = $('.list-item-wrap');
    createElementLi(lists);

    //点击导航切换对应的显示列表
    var others = [];
    var type = 'all';
    $('.menu-list li').click(function () {
        var title = $(this).find('span').html();
        $(this).addClass('cur').siblings().removeClass('cur');
        $('.main').html(title);
        
        type = this.dataset.type;
        filter(type)
        iconTitle.removeClass('icon-title-act');
    })
    //通过自定义属性type过滤数组
    function filter(type) {  
        if (type == 'all') {
            thumbList.html('');
            lists.html('');
            createElementLi(thumbList);
            createElementLi(lists);
        } else {
            others = files.filter(item => MIMEMAPS[type].includes(item.type));
            thumbList.html('');
            lists.html('');
            createElementLi(thumbList, others);
            createElementLi(lists, others);
        }     
    }
    
    //创建生成li列表
    function createElementLi(listObj, arr) {
        arr = arr == undefined ? files : arr;
        //判断传入的列表对象生成不同的视图
        switch (listObj) {
            case thumbList:
                arr.forEach(function (item) {
                    var lis = $(`
                        <li>
                            <i class="icon-file"></i>
                            <p>${item.name}</p>
                            <i class="icon-checkbox"></i>
                        </li>
                    `);
                    listObj.append(lis);
                })
                break;
            
            case lists:
                arr.forEach(function (item) {
                    var divs = $(`
                        <div class="item clearfix">
                            <div class="icon-wrap">
                                <i class="icon-checkbox"></i>
                            </div>
                            <div class="item-wrap">${item.name}</div>
                        </div>
                    `);
                    listObj.append(divs);
                })
                break;
        }
        
    }
    //切换列表的显示状态（缩略图VS列表）
    var actionItem = $('.action-item');
    var menuLists = $('.menu-lists');

    actionItem.eq(1).addClass('active');
    actionItem.click(function () {
        var _this = $(this);
        changeMenuList(_this);
    })

    function changeMenuList(_this) {
        _this.addClass('active').siblings().removeClass('active');
        menuLists.eq(_this.index()).show().siblings('.menu-lists').hide();
        lists.html('');
        createElementLi(lists);

        iconTitle.removeClass('icon-title-act');
        thumbList.find('li').removeClass('active');
        thumbList.find('.icon-checkbox').hide().removeClass('icon-checkbox-act');
    }

    //点击全选选中所有文件
    var iconTitle = $('.icon-title');

    iconTitle.click(function () {
        $(this).toggleClass('icon-title-act');

        if ($(this).hasClass('icon-title-act')) {
            thumbList.find('li').addClass('active');
            thumbList.find('.icon-checkbox').show().addClass('icon-checkbox-act');
        } else {
            thumbList.find('li').removeClass('active');
            thumbList.find('.icon-checkbox').hide().removeClass('icon-checkbox-act');
        }
    })
    //鼠标移入每个文件添加状态
    thumbList.on('mouseover', 'li', function () {
        var iconCheckbox = thumbList.find('.icon-checkbox');
        iconCheckbox.eq($(this).index()).show();

    }).on('mouseout', 'li', function () {
        var iconCheckbox = thumbList.find('.icon-checkbox');
        var index = $(this).index();
        if (!iconCheckbox.eq(index).hasClass('icon-checkbox-act')) {
            iconCheckbox.eq(index).hide();
            $(this).removeClass('active');
        }
    })
    
    //点击单选选中当前文件
    thumbList.on('click', 'i.icon-checkbox', function () {
        $(this).toggleClass('icon-checkbox-act');
        $(this).parent().toggleClass('active');

        setCheckAll();
    });
    thumbList.on('mousedown', 'i.icon-checkbox', function () {
        return false;
    })

    //在文件列表区域拖拽框选文件夹
    $('.content').mousedown(function (ev) {
        var drawDiv = $('<div>');
        drawDiv.css('background', 'rgba(124,135,142,0.5)');
        drawDiv.css('position', 'absolute');
        var disX = ev.clientX;
        var disY = ev.clientY;
        $('body').append(drawDiv);
        
        $(document).mousemove(function (ev) {
            var w = Math.abs(ev.clientX - disX);
            var h = Math.abs(ev.clientY - disY);
            var l = Math.min(disX, ev.clientX);
            var t = Math.min(disY, ev.clientY);
            drawDiv.css('width', w);
            drawDiv.css('height', h);
            drawDiv.css('left', l);
            drawDiv.css('top', t);

            thumbList.find('li').each(function () {
                var iconCheckbox = $(this).find('.icon-checkbox');
                if (isPeng(drawDiv[0], this)) {
                    $(this).addClass('active');
                    iconCheckbox.show().addClass('icon-checkbox-act');
                } else {
                    $(this).removeClass('active');
                    iconCheckbox.hide().removeClass('icon-checkbox-act');
                }
            })  
            setCheckAll();
        })

        $(document).mouseup(function () {
            $(this).off();
            drawDiv.remove();
        })
        return false;
    })
    
    //判断是否全部选中
    function setCheckAll() { 
        var iconCheckbox = thumbList.find('.icon-checkbox');
        var checkAll = [...iconCheckbox].every(function (item) {
            return item.classList.contains('icon-checkbox-act');
        });
        if (checkAll) {
            iconTitle.addClass('icon-title-act');
        } else {
            iconTitle.removeClass('icon-title-act');
        }
    }

    //碰撞检测函数封装
    function isPeng(obj1,obj2) {
        var elRect1 = obj1.getBoundingClientRect();
        var elRect2 = obj2.getBoundingClientRect();

        if (elRect1.left > elRect2.right || elRect1.right < elRect2.left || elRect1.top > elRect2.bottom || elRect1.bottom < elRect2.top) {
            return false;
        } else {
            return true;
        }
    }

    //新建文件夹
    $('#action-open').click(function (ev) {
        ev.stopPropagation();
        $('.action-list').toggle();
    })

    $(window).click(function () {
        $('.action-list').hide();
        customMenu.hide();
    })

    $('.createFiles').click(function () {
        iconTitle.removeClass('icon-title-act');
        var li = $(`
            <li>
                <i class="icon-file"></i>
                <input type="text" placeholder="新建文件夹" class="create-text">
                <p style="display:none">新建文件夹</p>
                <i class="icon-checkbox"></i>
            </li>
        `)
        
        thumbList.prepend(li);
        $('.create-text').focus();

        $('.create-text').keydown(function (ev) {
            var val = $(this).val();
            if (ev.keyCode == 13) {
                if (val == '') {
                    $(this).hide().next().html('新建文件夹').show();
                    files.push({
                        name: '新建文件夹',
                        type: 'text/file'
                    })
                } else {
                    $(this).hide().next().html(val).show();
                    files.push({
                        name: val,
                        type: 'text/file'
                    })
                }
                move(true);
            }
        })
    });

    //函数用来实现提醒框的运动
    function move(state) {
        if (state) {
            $('.top-tip').html('<span><i></i>新建文件夹成功</span>');
        } else {
            $('.top-tip').html('<span><i></i>删除成功</span>');
        }
        $('.top-tip').animate({ top: 0 }, 500, function () {
            setTimeout(() => {
                $(this).animate({ top: -42 }, 500);
            }, 1000)
        })
    }

    //删除文件夹
    var login = $('.login');
    var iTop = $(window).height()*0.5-50;

    $('#delete').click(function () {
        var iconCheckbox = thumbList.find('.icon-checkbox');
        iconCheckbox.each(function (i) {
            if ($(this).hasClass('icon-checkbox-act')) {
                var _this = $(this);
                login.show().animate({ opacity: 1, top: $(window).height() / 2 });

                login.find('.ok-btn').click(function () {
                    deleteFiles(_this);
                    login.stop().animate({ opacity: 0, top: iTop }, function () {
                        $(this).hide();
                        move(false);
                    }); 
                    if (!files.length) iconTitle.removeClass('icon-title-act');
                })

                login.find('.cancel-btn').click(function () {
                    login.stop().animate({ top: iTop, opacity: 0 }, function () {
                        $(this).hide();
                    });
                })
            }
        })
        
    })

    //函数用来删除选中的文件夹
    function deleteFiles (_this){
        _this.parent().remove();        
        var This = _this;
        
        files.forEach(function (item, index) {
            if (item.name == This.prev().html()) {     
                files.splice(index, 1);
            }
        })
    }

    //右键点击显示自定义菜单
    var customMenu = $('.custom-menu');

    $('.content').contextmenu(function (e) {
        e.preventDefault();
        customMenu.show();
        customMenu.css('left', e.clientX);
        customMenu.css('top', e.clientY);
    })
    
    $(window).contextmenu(function (e) {
        e.preventDefault()
    })
 
    $('#reload').click(function () {
        location.reload();
    })

    $('#open-list').hover(function () {
        $(this).find('.sub-menu').show();
    }, function () {
        $(this).find('.sub-menu').hide();  
    })
    
    $('.sub-menu a').click(function () {
        var _this = $(this);
        actionItem.eq(_this.index()).addClass('active').siblings().removeClass('active');
        changeMenuList(_this);
    })

    $('#create').click(function () {
        $('.createFiles').click();
    })
})