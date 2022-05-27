$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    template.default.imports.dateFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var hh = dt.getHours();
        var mm = dt.getMinutes();
        var ss = dt.getSeconds();
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
    }

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
                renderPage(res.total);
            }
        })
    }

    initTable();
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlstr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlstr);
                form.render();

            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }

            }
        })
    }

    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章列表失败！');
                    }
                    layer.msg('删除文章列表成功！');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();

                }
            })

            layer.close(index);
        });
    })
})