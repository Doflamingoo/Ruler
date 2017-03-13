

    var G_SCALE_LI = '<li class="js-scale-li"></li>';//标尺刻度

    var CashSlider = function(options){
        //默认参数设置
        options = $.extend({
            max_amount : 1000,
            min_amount : 500,
            default_amount : 1000
        }, options);

        this.max_amount = options.max_amount;
        this.min_amount = options.min_amount;
        this.default_amount = options.default_amount;
        this.input_ele = options.input_ele;
        this.slider_wrap = options.slider_wrap;
    };

    CashSlider.prototype = {

        //根据金额移动滑块
        moveByAmount : function(amount){
            var percent = 0;

            if(!isNaN(amount)){
                var amount=Number(amount);
                if(amount > this.max_amount){
                    percent = 100;
                    this.input_ele.val(this.max_amount);
                }
                else if(amount < this.min_amount){
                    percent = 0;
                }
                else{
                    percent = ((amount - this.min_amount) / (this.max_amount - this.min_amount)).toPrecision(4) * 100;
                    //console.log(percent);
                }
                this.move(percent);
            }
        },

        //根据百分比转化金额
        convertAmount : function(percent){

            var amount = parseInt((this.max_amount - this.min_amount) * percent / 100) + this.min_amount;
            //取整10数
            if(percent < 100 && percent > 0){
                amount = amount - amount % 10;
            }
            this.input_ele.val(amount);
        },

        //移动滑块
        moveByTouch : function(x){
            var left_percent = ((x - this.minX) / (this.maxX - this.minX)).toPrecision(4) * 100;

            if(left_percent > 100){
                left_percent = 100;
            }
            else if(left_percent < 0){
                left_percent = 0;
            }
            //转化金额 并渲染
            this.convertAmount(left_percent);

            this.move(left_percent);
        },

        move : function(percent){
            this.slider.css('left', percent + '%');
        },

        //渲染视图
        renderView : function(){
            this.slider_wrap.find('.js-min-value').text(this.min_amount);
            this.slider_wrap.find('.js-max-value').text(this.max_amount);

            this.dt = Math.ceil((this.max_amount - this.min_amount)/2500);//最大金额的增加，修改此参数

            var scale = this.slider_wrap.find('.js-scale');
            //重新渲染前清空标尺内容
            scale.empty();

            for(var i = 0; i <= this.dt; i++){
                scale.append(G_SCALE_LI);
            }
        },

        //改变最大最小值重新渲染样式
        reload : function(params){
            this.max_amount = params.max_amount;
            this.min_amount = params.min_amount;
            this.renderView();
            this.input_ele.val(this.default_amount);
            this.moveByAmount(this.default_amount);
        },

        bindEvent : function(){
            var _this = this;

            //点击时滑动
            this.slider_wrap.find('.js-scale').on('touchstart', function (e) {
                var x = e.touches[0].clientX;
                //var x=e.originalEvent.targetTouches[0].pageX;
                _this.moveByTouch(x);
            });

            //滑块滑动
            this.slider.on('touchstart', function(e){
                var x = e.touches[0].clientX;
                _this.moveByTouch(x);
            });

            this.slider.on('touchmove', function(e){
                e.preventDefault();

                var x = e.changedTouches[e.changedTouches.length - 1].clientX;
                _this.moveByTouch(x);
            });

            this.input_ele.on('input', function(){
                var amount = $(this).val();
                _this.moveByAmount(amount);
            });

        },

        initParams : function(){
            this.slider = this.slider_wrap.find('.js-slider');
            this.maxX = Math.ceil($('.js-scale-li:last-child').offset().left);
            this.minX = Math.floor($('.js-scale-li:first-child').offset().left);

            this.moveByAmount(this.input_ele.val());
        },

        init : function () {
            this.renderView();
            this.initParams();
            this.bindEvent();
            return this;
        }
    };

