import computed_func from '@/pixiFunc/computational_function.js'
export default {
  name: 'element_func',
  onRightC: function(event) {
    const me = this;
    event.stopped = true;
    //右键点击，如果是单独元素则有置顶，置底，删除，复制
    //如果有临时组合则，有删除，复制
    //如果有组合，是组合的置顶，置底，复制，删除功能
    //根据画布外canvas缩放等级来判断位置，显示右键弹窗
    let browser_w = document.body.clientWidth;
    let browser_h = document.body.clientHeight;
    let canvas_scale = 1;
    let mouse_x = browser_w / 2 + ((380 / canvas_scale / 2) - me.window_w / 2) + (event.data.global.x * canvas_scale)
    let mouse_y = browser_h / 2 + ((80 / canvas_scale / 2) - me.window_h / 2) + (event.data.global.y * canvas_scale)
    //右键面板展示
    me.$set(me.right_block, 'rb_left', `${mouse_x}px`)
    me.$set(me.right_block, 'rb_top', `${mouse_y}px`)
    me.$set(me.right_block, 'show', true)
    if (event.currentTarget.type == 'text' || event.currentTarget.type == 'image') {
      //右键点击的元素是图片或者文字
      let inorNot = false;
      let has_ass = false;
      let has_noass = false;
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].name == event.currentTarget.name) {
          inorNot = true;
        }
        if (me.ctrl_arr[i].association_name !== '') {
          has_ass = true;
        }
        if (me.ctrl_arr[i].association_name == '') {
          has_noass = true;
        }
      }
      if (event.currentTarget.association_name == '') {
        //右键的元素不在组合中
        if (!inorNot) {
          //类型1 为单个元素的删除功能,模拟单个元素点击
          let f_parm = {
            type: 1,
            currentTarget: event.currentTarget,
            data: event.data
          }
          me.onRightFunc(f_parm)
        } else if (inorNot) {
          //类型2 为临时组合的删除功能
          let f_parm = {
            type: 2
          }
          me.onRightFunc(f_parm, event)
        }
      } else {
        if (has_noass) {
          //类型2 为临时组合的删除功能
          let f_parm = {
            type: 2
          }
          me.onRightFunc(f_parm, event)
        } else {
          //类型3 为组合的删除功能，模拟组合点击
          let f_parm = {
            type: 3
          }
          me.onRightFunc(f_parm, event)
        }
      }
    } else if (event.currentTarget.type == 'association_gap') {
      //类型2 为临时组合的删除功能
      let f_parm = {
        type: 2
      }
      me.onRightFunc(f_parm, event)
    } else if (event.currentTarget.type == 'association_gap_notT') {
      //类型3 为组合的删除功能，模拟组合点击
      let f_parm = {
        type: 3
      }
      me.onRightFunc(f_parm, event)
    }
  },
  normalStart: function(that, data) {
    const me = this;
    me.clearTemporary()
    that.data = data;
    that.dragging = true;
    me.in_move = that;
    //偏差值，鼠标点击目标任何位置移动都不会闪烁
    let newPosition = that.data.getLocalPosition(me.mainStage_container);
    that.deviationX = newPosition.x - that.parent.x;
    that.deviationY = newPosition.y - that.parent.y;
    //删除之前的边框按钮图层，增加此对象的边框按钮
    me.containerLine(that, false);
    me.showEdit(me.in_move.type)
  },
  onDragStart: function(sprite, event) {
    const me = this;
    //点击时判断是否是按着ctrl选择多个,且点击的不是带组合的元素
    if (me.key_ctrlf.isDown && !me.key_ctrlf.isUp) {
      //ctrl选择第二个元素或多个元素
      if (me.ctrl_arr.length == 0 && me.in_move.name !== sprite.name) {
        me.ctrl_arr.push(me.in_move);
        //如果是单个元素就加入，如果是组合元素就加入组合
        if (sprite.association_name.length == 0) {
          me.ctrl_arr.push(sprite);
        }
        //新增临时组合,找出其中层级最低的容器，在它之前加入临时组合的空白区
        me.findMinAndAdd(event.data);
      } else if (me.ctrl_arr.length >= 2) {
        let inorNot = false;
        if (sprite.association_name.length == 0) {
          //ctrl点击单个元素的
          for (let i = 0; i < me.ctrl_arr.length; i++) {
            if (me.ctrl_arr[i].name == sprite.name) {
              inorNot = true;
              me.removeLine(me.ctrl_arr[i].name)
              me.ctrl_arr.splice(i, 1)
            }
          }
          if (inorNot == false) {
            me.ctrl_arr.push(sprite);
          }
          //新增临时组合,找出其中层级最低的容器，在它之前加入临时组合的空白区
          me.findMinAndAdd(event.data);
        } else if (sprite.association_name !== '') {
          //ctrl点击了其他组合,重复点击去除，否则添加
          //计算当期ctrl_arr有多少个组合，对ass名字查重
          let ass_name_arr = me.setCtrlArrAssname()
          if (ass_name_arr.length == 1) {
            if (sprite.association_name !== ass_name_arr[0]) {
              ass_name_arr = me.ctrlAddAss(sprite.association_name, ass_name_arr)
              me.findMinAndAdd(event.data, ass_name_arr.length);
            }
          } else if (ass_name_arr.length > 1) {
            //重复的组合去掉，新的组合增加
            let inarr = false;
            for (let i = 0; i < ass_name_arr.length; i++) {
              if (ass_name_arr[i] == sprite.association_name) {
                inarr = true;
                break;
              }
            }
            if (inarr) {
              ass_name_arr = me.ctrlDisAss(sprite.association_name, ass_name_arr)
            } else {
              ass_name_arr = me.ctrlAddAss(sprite.association_name, ass_name_arr)
            }
            me.findMinAndAdd(event.data, ass_name_arr.length, ass_name_arr[0]);
          }
        }
      }
    } else {
      //普通元素点击判断是否在临时组合中
      let inorNot1 = false;
      if (sprite.association_name !== '') {
        //如果有组合，将组合加入ctrl_arr
        if (me.temporary_rect) {
          me.cancelInMove()
        }
        me.ctrl_arr.length = 0;
        me.addACtrlarr(sprite.association_name)
      } else {
        me.click_ass_id = ''
      }
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].name == sprite.name) {
          inorNot1 = true;
          break;
        }
      }
      if (inorNot1) {
        if (me.temporary_rect) {
          me.ctrlDeviation(event.data, true);
        } else if (!me.temporary_rect && sprite.association_name !== '') {
          if (sprite.association_name == me.click_ass_id && me.click_ass_id !== '' && me.in_move) {
            me.aSingleClick(sprite, event.data)
          } else {
            me.onAssociationStart(event)
          }
        }
      } else {
        me.normalStart(sprite, event.data)
      }
    }
  },
  onDragMove: function(obj, event) {
    const me = this;
    if (me.ctrl_arr.length > 0) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].dragging) {
          let newPosition = me.ctrl_arr[i].data.getLocalPosition(me.mainStage_container);
          if (me.ctrl_arr[i].type == 'association_gap_notT') {
            me.ctrl_arr[i].x = newPosition.x - me.ctrl_arr[i].deviationX;
            me.ctrl_arr[i].y = newPosition.y - me.ctrl_arr[i].deviationY;
            let param = [me.ctrl_arr[i].width / 2, me.ctrl_arr[i].height / 2, me.ctrl_arr[i].rotation];
            param = computed_func.AFTER_ROTATE(param);
            // me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
            // me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
            me.ctrl_arr[i].centerX = me.ctrl_arr[i].x + parseFloat(param[0]);
            me.ctrl_arr[i].centerY = me.ctrl_arr[i].y + parseFloat(param[1]);
            me.moveOutLine(me.ctrl_arr[i].centerX, me.ctrl_arr[i].centerY, me.ctrl_arr[i]);
          } else {
            me.ctrl_arr[i].parent.x = newPosition.x - me.ctrl_arr[i].deviationX;
            me.ctrl_arr[i].parent.y = newPosition.y - me.ctrl_arr[i].deviationY;
            //移动icon线框位置
            me.moveOutLine(me.ctrl_arr[i].parent.x, me.ctrl_arr[i].parent.y, me.ctrl_arr[i])
          }
        }
      }
      //如果是单独移动组合中的元素，组合矩形需要变化
      if (obj.association_name == me.click_ass_id && obj.dragging) {
        me.click_ass_id = ''
        // me.for_change_association(obj.association_name)
      }
      if (me.temporary_rect && me.temporary_rect.dragging) {
        let newPosition = me.temporary_rect.data.getLocalPosition(me.mainStage_container);
        me.temporary_rect.x = newPosition.x - me.temporary_rect.deviationX;
        me.temporary_rect.y = newPosition.y - me.temporary_rect.deviationY;
        // 利用向量旋转计算出矩形中心点，如果临时组合未旋转则角度为0
        let param = [me.temporary_rect.width / 2, me.temporary_rect.height / 2, me.temporary_rect.rotation];
        param = computed_func.AFTER_ROTATE(param);
        me.temporary_rect.centerX = me.temporary_rect.x + parseFloat(param[0]);
        me.temporary_rect.centerY = me.temporary_rect.y + parseFloat(param[1]);
        me.moveOutLine(me.temporary_rect.centerX, me.temporary_rect.centerY, me.temporary_rect)
      }
    } else {
      if (obj.dragging) {
        let newPosition = obj.data.getLocalPosition(me.mainStage_container);
        obj.parent.x = newPosition.x - obj.deviationX;
        obj.parent.y = newPosition.y - obj.deviationY;
        //移动icon线框位置
        me.moveOutLine(obj.parent.x, obj.parent.y, obj)
        // btn_box.position.set(newPosition.x, newPosition.y);
      }
    }
  },
  onDragEnd: function(sprite, event) {
    const me = this;
    var that = sprite;
    //拖动结束
    that.dragging = false;
    that.data = null;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].dragging = false;
      me.ctrl_arr[i].data = null;
    }
    //组合点击的逻辑
    if (me.click_ass_id !== '' && me.click_ass_id == that.association_name && that.type !== 'btn' && that.type !== 'association_gap_notT') {
      me.in_move = that
      me.aSingleClickBorder(that.association_name)
    }
    if (me.click_ass_id == '' && that.association_name !== '') {
      me.click_ass_id = that.association_name
    }
    //如果是组合元素拖动结束，渲染组合边框
    if (that.association_name !== '' && that.type !== 'association_gap_notT' && me.in_move) {
      me.aSingleClickBorder(that.association_name)
    }
    // }
    if (me.temporary_rect && me.temporary_rect.dragging) {
      me.temporary_rect.dragging = false;
      me.temporary_rect.data = null;
      // $('.association').removeClass('association_un_click');
    }
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].dragging = false;
      me.ctrl_arr[i].data = null;
    }
  },
  onScaleStart: function(event) {
    const me = this;
    event.target.data = event.data;
    me.in_move.dragging = !1;
    me.can_scale = 1;
    //
    if (me.in_move.association_name !== '') {
      //组合空白矩形
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].association_name == me.in_move.association_name) {
          //缩放结束后，改变组合空白矩形change
          me.ctrl_arr[i].change = true;
          break;
        }
      }
    }
    if (me.in_move.type == 'text') {
      let num = me.in_move.width / me.in_move.style.fontSize;
      me.in_move.text_num = num;
    }
  },
  onScaleMove: function(btn, event) {
    const me = this
    if (me.can_scale) {
      var e = event.data.getLocalPosition(me.mainStage_container);
      //目前拉伸的到原点连线的长度
      var n = computed_func.LENGTH_SIZE({
        x: me.in_move.parent.position.x,
        y: me.in_move.parent.position.y
      }, e);
      //计算缩放值，并改变元素移动边框和icon
      let d_value = Math.abs(e.x - me.in_move.parent.position.x)
      if (me.in_move.type == 'text') {
        me.scaleAll(n, d_value, me.in_move.text_num);
      } else {
        me.scaleAll(n, d_value);
      }
    }
  },
  scaleAll: function(n, d_value, text_num = 0) {
    const me = this;
    let dw = 2 * d_value
    if (n <= 0) {
      return
    }
    //x1 x2为原始拉伸对象的长宽
    var x1,
      x2;
    x1 = me.in_move.originalw / 2;
    x2 = me.in_move.originalh / 2;
    let original_scale = Math.sqrt(x1 * x1 + x2 * x2);
    let scale = n / original_scale;
    if (scale <= 0.1) {
      scale = 0.1
    }
    if (me.in_move.type == 'text') {
      // 
      let fs = dw / text_num
      if (fs >= 12) {
        me.in_move.style.wordWrapWidth = dw
        if (me.in_move.style.fontStyle == 'normal') {
          me.in_move.style.wordWrapWidth += fs * 0.2
        }
        me.in_move.style.fontSize = fs;
        me.$set(me.edit_bar.text, 'fontSize', fs)
        me.in_move.style.lineHeight = me.in_move.style.fontSize + me.in_move.lineHeightM;
        //
        me.moveIcon(me.in_move)
      }
    } else {
      if (me.in_move.svg) {
        me.in_move.scale.set(scale / me.in_move.texture.baseTexture.resource.scale);
      } else {
        me.in_move.scale.set(scale);
      }
      //删除边框、旋转按钮，保留缩放按钮，拉伸结束恢复
      me.moveIcon(me.in_move)
    }
    me.forChangeAssociation(me.in_move.association_name)
  },
  onScaleEnd: function() {
    const me = this;
    me.can_scale = 0;
    me.containerLine(me.in_move, false);
    // //改变组合空白矩形,在元素拖动方法中已经修改，放大后改change为假
    if (me.in_move.association_name !== '') {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].change && me.in_move.association_name == me.ctrl_arr[i].association_name) {
          me.aSingleClickBorder(me.ctrl_arr[i].association_name)
        }
      }
    }
    if (me.in_move.type == 'text') {
      me.scaleTextEnd(me.in_move)
    } else if (me.in_move.svg) {
      me.updateSvgScale(me.in_move)
    }
  },
  onRotateStart: function() {
    const me = this;
    me.in_move.dragging = !1;
    me.can_rotate = 1;
    if (me.in_move.association_name !== '') {
      //组合空白矩形
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT' && me.ctrl_arr[i].association_name == me.in_move.association_name) {
          //缩放结束后，改变组合空白矩形change
          me.ctrl_arr[i].change = true;
          break;
        }
      }
    }
  },
  onRotateMove: function(event) {
    const me = this;
    if (me.can_rotate) {
      let e = event.data.getLocalPosition(me.mainStage_container);
      //计算向量夹角
      let a1 = {};
      a1.x = 0;
      a1.y = -me.in_move.height / 2 - me.r_btn_h;
      let a2 = {};
      a2.x = e.x - me.in_move.parent.position.x;
      a2.y = e.y - me.in_move.parent.position.y;
      //
      let cos;
      let numerator = a1.x * a2.x + a1.y * a2.y;
      let denominator = Math.sqrt(a1.x * a1.x + a1.y * a1.y) * Math.sqrt(a2.y * a2.y + a2.x * a2.x);
      cos = numerator / denominator;
      //反余弦值
      me.rotateOBj(Math.acos(cos), e.x)
    }
  },
  rotateOBj: function(num, x) {
    const me = this;
    if (x - me.in_move.parent.position.x >= 0) {
      me.in_move.rotation = num;
      me.outLine_container.getChildByName(me.in_move.name).rotation = num;
    } else {
      me.in_move.rotation = -num;
      me.outLine_container.getChildByName(me.in_move.name).rotation = -num;
    }
    me.forChangeAssociation(me.in_move.association_name)
  },
  onRotateEnd: function() {
    const me = this;
    me.in_move.rotation_num = me.in_move.rotation
    me.can_rotate = 0;
    // //改变组合空白矩形,在元素拖动方法中已经修改，放大后改change为假
    if (me.in_move.association_name !== '') {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT' && me.in_move.association_name == me.ctrl_arr[i].association_name) {
          me.aSingleClickBorder(me.ctrl_arr[i].association_name)
        }
      }
    }
  },
  onStretchStart: function(event) {
    const me = this;
    me.in_move.dragging = false;
    me.can_scale = 0;
    me.can_rotate = 0;
    me.can_stretch = 1;
  },
  onStretchMove: function(event) {
    const me = this;
    if (me.can_stretch) {
      let e = event.data.getLocalPosition(me.mainStage_container);
      let centerx = me.in_move.parent.position.x;
      let wordWrapWidth = (e.x - centerx) * 2;
      if (wordWrapWidth > me.in_move.style.fontSize) {
        me.in_move.style.wordWrapWidth = wordWrapWidth;
        //移动文字icon
        me.moveIcon(me.in_move)
      }
    }
  },
  onStretchEnd: function() {
    const me = this;
    me.can_stretch = 0;
    me.in_move.originalw = me.in_move.width;
    me.in_move.originalh = me.in_move.height;
    me.in_move.ofonts = me.in_move.style.fontSize;
    me.containerLine(me.in_move, false);
    if (me.in_move.association_name !== '') {
      me.aSingleClickBorder(me.in_move.association_name)
    }
  },
  onTemporaryStart: function(event) {
    //计算临时组合的偏差值用于移动,布尔值表示移动临时组合矩形，false表示移动组合矩形(包含在ctrl_arr里)
    const me = this;
    me.ctrlDeviation(event.data, true);
  },
  onTemporaryEnd: function() {
    const me = this;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].dragging = false;
      me.ctrl_arr[i].data = null;
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        setTimeout(function() {
          me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
          me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
          me.moveOutLine(me.ctrl_arr[i].centerX, me.ctrl_arr[i].centerY, me.ctrl_arr[i])
          me.ctrl_arr[i].change = false;
        }, 150)
        if (me.click_ass_id == '') {
          me.click_ass_id = me.ctrl_arr[i].association_name
        }
      }
    }
    if (me.temporary_rect) {
      me.temporary_rect.dragging = false;
      me.temporary_rect.data = null;
      //添加临时组合边框,vertexData数据返回可能有延迟，所以设个延迟时间
      setTimeout(function() {
        me.temporary_rect.centerX = (me.temporary_rect.vertexData[0] + me.temporary_rect.vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
        me.temporary_rect.centerY = (me.temporary_rect.vertexData[1] + me.temporary_rect.vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
        me.moveOutLine(me.temporary_rect.centerX, me.temporary_rect.centerY, me.temporary_rect)
      }, 150)
    }
    //上次点击对象清空
    // if (me.in_move && me.click_obj_name !== me.in_move.name) {
    //   me.click_obj_name = '';
    // } else if (!me.in_move) {
    //   me.click_obj_name = '';
    // }
  },
  onTScaleStart: function(event) {
    const me = this;
    event.target.data = event.data;
    me.can_scale = 1;
    let ctrl_arr_pivot = [];
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].oScale = me.ctrl_arr[i].scale.x;
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        ctrl_arr_pivot.push({
          index: i,
          x: me.ctrl_arr[i].position.x,
          y: me.ctrl_arr[i].position.y
        })
      } else {
        if (me.ctrl_arr[i].type == 'text') {
          let num = me.ctrl_arr[i].width / me.ctrl_arr[i].style.fontSize;
          me.ctrl_arr[i].text_num = num;
          me.ctrl_arr[i].ratio = 2 * (-me.temporary_rect.x + me.temporary_rect.centerX) / me.ctrl_arr[i].width;
        }
        ctrl_arr_pivot.push({
          index: i,
          x: me.ctrl_arr[i].parent.position.x,
          y: me.ctrl_arr[i].parent.position.y
        })
      }
    };
    //用于处理缩放时对称点不对影响错位，实时根据缩放改变位置
    event.target.pivotX = me.temporary_rect.centerX;
    event.target.pivotY = me.temporary_rect.centerY;
    event.target.temporary_rectX = me.temporary_rect.x;
    event.target.temporary_rectY = me.temporary_rect.y;
    event.target.ctrl_arr_pivot = ctrl_arr_pivot;
    me.temporary_rect.oScale = me.temporary_rect.scale.x
  },
  onTScaleMove: function(btn, event) {
    const me = this;
    if (me.can_scale) {
      var e = event.data.getLocalPosition(me.mainStage_container);
      //目前拉伸的到原点连线的长度
      var n = computed_func.LENGTH_SIZE({
        x: me.temporary_rect.centerX,
        y: me.temporary_rect.centerY
      }, e);
      //计算缩放值，并改变元素移动边框和icon
      me.tScaleAll(n, btn);
    }
  },
  tScaleAll: function(n, that, present_w) {
    const me = this;
    if (n <= 0) {
      return
    }
    //x1 x2为原始拉伸对象的长宽
    var x1,
      x2;
    x1 = me.temporary_rect.originalw / 2;
    x2 = me.temporary_rect.originalh / 2;
    let original_scale = Math.sqrt(x1 * x1 + x2 * x2);
    let scale = n / original_scale;
    if (scale <= 0.1) {
      scale = 0.1
    }
    me.temporary_rect.scale.set(scale * me.temporary_rect.oScale)
    me.temporary_rect.x = that.pivotX - (that.pivotX - that.temporary_rectX) * scale;
    me.temporary_rect.y = that.pivotY - (that.pivotY - that.temporary_rectY) * scale;
    //删除边框、旋转按钮，保留缩放按钮，拉伸结束恢复
    me.moveIcon(me.temporary_rect)
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
        me.ctrl_arr[i].x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
        me.ctrl_arr[i].y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
      } else if (me.ctrl_arr[i].type == 'text') {
        let fs = me.temporary_rect.width / me.ctrl_arr[i].ratio / me.ctrl_arr[i].text_num
        me.ctrl_arr[i].style.wordWrapWidth = me.ctrl_arr[i].text_num * fs
        if (me.ctrl_arr[i].style.fontStyle == 'normal') {
          me.ctrl_arr[i].style.wordWrapWidth += fs * 0.2
        }
        me.ctrl_arr[i].style.fontSize = fs;
        me.$set(me.edit_bar.text, 'fontSize', fs)
        me.ctrl_arr[i].style.lineHeight = me.ctrl_arr[i].style.fontSize + me.ctrl_arr[i].lineHeightM;
        me.ctrl_arr[i].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
        me.ctrl_arr[i].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
      } else {
        if (me.ctrl_arr[i].svg) {
          me.ctrl_arr[i].scale.set(scale);
        } else {
          me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
        }
        //补充位移
        me.ctrl_arr[i].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
        me.ctrl_arr[i].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
      }
    }
  },
  onTScaleEnd: function() {
    const me = this;
    me.can_scale = 0;
    me.temporary_rect.originalw = me.temporary_rect.width;
    me.temporary_rect.originalh = me.temporary_rect.height;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type == 'text') {
        me.scaleTextEnd(me.ctrl_arr[i])
      } else if (me.ctrl_arr[i].svg) {
        me.updateSvgScale(me.ctrl_arr[i])
      }
      setTimeout(function() {
        me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
        me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
        if (i == me.ctrl_arr.length - 1) me.renderTLine(true)
      }, 150)
    }
  },
  onTRotateStart: function(event = null) {
    const me = this;
    me.temporary_rect.dragging = false;
    me.temporary_rect.beforeRX = me.temporary_rect.x;
    me.temporary_rect.beforeRY = me.temporary_rect.y;
    //临时组合元素设置pivot点是从自己锚点开始的相对位置，将其设置到空白矩形中点
    //再将元素的位置补差值，维持原位(差值涉及缩放比例)
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].dragging = false;
      me.ctrl_arr[i].data = null;
      //元素线框,旋转后直接重新渲染线框，所以结束时不用恢复pivot
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].x;
        me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].y;
        me.ctrl_arr[i].pivot.set((me.temporary_rect.centerX - me.ctrl_arr[i].x) / me.ctrl_arr[i].scale.x, (me.temporary_rect.centerY - me.ctrl_arr[i].y) / me.ctrl_arr[i].scale.y);
        me.ctrl_arr[i].x = me.temporary_rect.centerX
        me.ctrl_arr[i].y = me.temporary_rect.centerY
      } else {
        me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].parent.x;
        me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].parent.y;
        me.ctrl_arr[i].parent.pivot.set((me.temporary_rect.centerX - me.ctrl_arr[i].parent.position.x) / 1, (me.temporary_rect.centerY - me.ctrl_arr[i].parent.position.y) / 1);
        me.ctrl_arr[i].parent.x = me.temporary_rect.centerX
        me.ctrl_arr[i].parent.y = me.temporary_rect.centerY
      }
    }
    //(相对位置不计算角度)
    me.temporary_rect.pivot.set((me.temporary_rect.width / 2) / me.temporary_rect.scale.x, (me.temporary_rect.height / 2) / me.temporary_rect.scale.y);
    me.temporary_rect.x = me.temporary_rect.centerX;
    me.temporary_rect.y = me.temporary_rect.centerY;
    me.can_rotate = 1;
  },
  onTRotateMove: function(event) {
    const me = this;
    if (me.can_rotate) {
      let e = event.data.getLocalPosition(me.mainStage_container);
      //计算向量夹角
      let a1 = {};
      a1.x = 0;
      a1.y = -me.temporary_rect.height / 2 - me.r_btn_h;
      let a2 = {};
      a2.x = e.x - (me.temporary_rect.centerX);
      a2.y = e.y - (me.temporary_rect.centerY);
      //
      let cos;
      let numerator = a1.x * a2.x + a1.y * a2.y;
      let denominator = Math.sqrt(a1.x * a1.x + a1.y * a1.y) * Math.sqrt(a2.y * a2.y + a2.x * a2.x);
      cos = numerator / denominator;
      //反余弦值
      me.tRotateOBj(Math.acos(cos), e.x)
    }
  },
  tRotateOBj: function(num, x) {
    const me = this;
    if (x - (me.temporary_rect.centerX) >= 0) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].rotation = num;
        } else {
          me.ctrl_arr[i].parent.rotation = num - me.ctrl_arr[i].parent.rotation_num;
        }
        // outLine_container.getChildByName(ctrl_arr[i].name).rotation = num- ctrl_arr[i].parent.rotation_num;
      }
      me.temporary_rect.rotation = num
      me.outLine_container.getChildByName(me.temporary_rect.name).rotation = num
      // outLine_container.getChildByName(temporary_rect.name).rotation = num;
    } else {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].rotation = -num;
        } else {
          me.ctrl_arr[i].parent.rotation = -num - me.ctrl_arr[i].parent.rotation_num
        }
        // outLine_container.getChildByName(ctrl_arr[i].name).rotation = -num-ctrl_arr[i].parent.rotation_num;
      }
      me.temporary_rect.rotation = -num
      me.outLine_container.getChildByName(me.temporary_rect.name).rotation = -num
      // outLine_container.getChildByName(temporary_rect.name).rotation = -num;
    }
    // outLine_container.getChildByName(temporary_rect.name).getChildByName('line').alpha=0;
  },
  onTRotateEnd: function() {
    const me = this;
    let temporary_rect = me.temporary_rect;
    let ctrl_arr = me.ctrl_arr;
    temporary_rect.pivot.set(0)
    let param1 = [-temporary_rect.width / 2, -temporary_rect.height / 2, temporary_rect.rotation]
    param1 = computed_func.AFTER_ROTATE(param1);
    temporary_rect.x = parseFloat(param1[0]) + (temporary_rect.centerX)
    temporary_rect.y = parseFloat(param1[1]) + (temporary_rect.centerY)
    me.can_rotate = 0;
    for (let i = 0; i < ctrl_arr.length; i++) {
      if (ctrl_arr[i].type !== 'association_gap_notT') {
        ctrl_arr[i].rotation_num = ctrl_arr[i].rotation + ctrl_arr[i].parent.rotation;
        ////将临时组合元素恢复位置,将父级的旋转取消，本身旋转
        ctrl_arr[i].parent.pivot.set(0);
        let param;
        param = [ctrl_arr[i].beforeRX - (temporary_rect.centerX), ctrl_arr[i].beforeRY - (temporary_rect.centerY), ctrl_arr[i].parent.rotation]
        param = computed_func.AFTER_ROTATE(param);
        ctrl_arr[i].parent.x = parseFloat(param[0]) + (temporary_rect.centerX)
        ctrl_arr[i].parent.y = parseFloat(param[1]) + (temporary_rect.centerY)
        ctrl_arr[i].parent.rotation_num += ctrl_arr[i].parent.rotation; //记录父级旋转的角度，
        ctrl_arr[i].parent.rotation = 0;
        ctrl_arr[i].rotation = ctrl_arr[i].rotation_num;
      } else if (ctrl_arr[i].type == 'association_gap_notT') {
        ctrl_arr[i].pivot.set(0);
        let param2;
        param2 = [ctrl_arr[i].beforeRX - (temporary_rect.centerX), ctrl_arr[i].beforeRY - (temporary_rect.centerY), ctrl_arr[i].rotation - ctrl_arr[i].rotation_num]
        param2 = computed_func.AFTER_ROTATE(param2);
        ctrl_arr[i].x = parseFloat(param2[0]) + (temporary_rect.centerX)
        ctrl_arr[i].y = parseFloat(param2[1]) + (temporary_rect.centerY)
        ctrl_arr[i].rotation_num = ctrl_arr[i].rotation;
        setTimeout(function() {
          ctrl_arr[i].centerX = (ctrl_arr[i].vertexData[0] + ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
          ctrl_arr[i].centerY = (ctrl_arr[i].vertexData[1] + ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
        }, 50)
      }
    }
    //渲染边框
    setTimeout(function() {
      me.renderTLine(true)
    }, 130)
  },
  onAssociationStart: function(event) {
    const me = this
    if (me.key_ctrlf.isDown && !me.key_ctrlf.isUp) {
      me.onDragStart(event.currentTarget, event)
    } else {
      me.clearTemporary();
      me.addACtrlarr(event.target.association_name)
      me.ctrlDeviation(event.data, false);
      //添加组合边框给组合矩形加按钮,不渲染临时边框
      me.renderTLine(false, true, event.target.association_name)
    }
  },
  onAScaleStart: function(event) {
    const me = this;
    me.can_scale = 1;
    let ctrl_arr_pivot = [];
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].oScale = me.ctrl_arr[i].scale.x;
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        event.target.pivotX = me.ctrl_arr[i].centerX
        event.target.pivotY = me.ctrl_arr[i].centerY;
        event.target.association_rectX = me.ctrl_arr[i].x;
        event.target.association_rectY = me.ctrl_arr[i].y;
        event.target.owidth = me.ctrl_arr[i].width;
        event.target.oheight = me.ctrl_arr[i].height;
        //充数用的
        ctrl_arr_pivot.push({
          index: i,
          x: me.ctrl_arr[i].position.x,
          y: me.ctrl_arr[i].position.y
        })
      } else {
        if (me.ctrl_arr[i].type == 'text') {}
        ctrl_arr_pivot.push({
          index: i,
          x: me.ctrl_arr[i].parent.position.x,
          y: me.ctrl_arr[i].parent.position.y
        })
      }
    };
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type == 'text') {
        let num = me.ctrl_arr[i].width / me.ctrl_arr[i].style.fontSize;
        me.ctrl_arr[i].text_num = num;
        me.ctrl_arr[i].ratio = event.target.owidth / me.ctrl_arr[i].width;
      }
    }
    event.target.ctrl_arr_pivot = ctrl_arr_pivot;
  },
  onAScaleMove: function(btn, event) {
    const me = this;
    if (me.can_scale) {
      var e = event.data.getLocalPosition(me.mainStage_container);
      //目前拉伸的到原点连线的长度
      var n = computed_func.LENGTH_SIZE({
        x: btn.pivotX,
        y: btn.pivotY
      }, e);
      //计算缩放值，并改变元素移动边框和icon
      me.aScaleAll(n, btn);
    }
  },
  aScaleAll: function(n, that) {
    const me = this;
    if (n <= 0) {
      return
    }
    //x1 x2为原始拉伸对象的长宽
    var x1,
      x2;
    x1 = that.owidth / 2;
    x2 = that.oheight / 2;
    let original_scale = Math.sqrt(x1 * x1 + x2 * x2);
    let scale = n / original_scale;
    if (scale <= 0.1) {
      scale = 0.1
    }
    let ass_width = 0;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
        me.ctrl_arr[i].x = that.pivotX - (that.pivotX - that.association_rectX) * scale;
        me.ctrl_arr[i].y = that.pivotY - (that.pivotY - that.association_rectY) * scale;
        me.moveIcon(me.ctrl_arr[i])
        ass_width = me.ctrl_arr[i].width;
      } else if (me.ctrl_arr[i].type !== 'text') {
        if (me.ctrl_arr[i].svg) {
          me.ctrl_arr[i].scale.set(scale);
        } else {
          me.ctrl_arr[i].scale.set(scale * me.ctrl_arr[i].oScale);
        }
        me.ctrl_arr[i].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[i].x) * scale;
        me.ctrl_arr[i].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[i].y) * scale
      }
    }
    for (let k = 0; k < me.ctrl_arr.length; k++) {
      if (me.ctrl_arr[k].type == 'text') {
        let fs = ass_width / me.ctrl_arr[k].ratio / me.ctrl_arr[k].text_num
        me.ctrl_arr[k].style.wordWrapWidth = me.ctrl_arr[k].text_num * fs
        if (me.ctrl_arr[k].style.fontStyle == 'normal') {
          me.ctrl_arr[k].style.wordWrapWidth += fs * 0.2
        }
        me.ctrl_arr[k].style.fontSize = fs;
        me.$set(me.edit_bar.text, 'fontSize', fs)
        me.ctrl_arr[k].style.lineHeight = me.ctrl_arr[k].style.fontSize + me.ctrl_arr[k].lineHeightM;
        me.ctrl_arr[k].parent.x = that.pivotX - (that.pivotX - that.ctrl_arr_pivot[k].x) * scale;
        me.ctrl_arr[k].parent.y = that.pivotY - (that.pivotY - that.ctrl_arr_pivot[k].y) * scale
      }
    }
  },
  onAScaleEnd: function() {
    const me = this;
    me.can_scale = 0;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type == 'text') {
        me.scaleTextEnd(me.ctrl_arr[i])
      } else if (me.ctrl_arr[i].svg) {
        me.updateSvgScale(me.ctrl_arr[i])
      }
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        me.ctrl_arr[i].change = true;
        me.change_association(me.ctrl_arr[i])
        setTimeout(function() {
          me.renderTLine(false, true, me.ctrl_arr[i].association_name)
        }, 150)
      }
    }
  },
  onARotateStart: function(event = null) {
    const me = this;
    //组合旋转
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].dragging = false;
      me.ctrl_arr[i].data = null;
      //元素线框,旋转后直接重新渲染线框，所以结束时不用恢复pivot
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        //更新矩形中心点
        me.ctrl_arr[i].centerX = (me.ctrl_arr[i].vertexData[0] + me.ctrl_arr[i].vertexData[6]) / 2 - (me.window_w - me.canvas_width) / 2;
        me.ctrl_arr[i].centerY = (me.ctrl_arr[i].vertexData[1] + me.ctrl_arr[i].vertexData[7]) / 2 - (me.window_h - me.canvas_height) / 2;
        me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].x;
        me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].y;
        me.ctrl_arr[i].pivot.set((me.ctrl_arr[i].width / 2) / me.ctrl_arr[i].scale.x, (me.ctrl_arr[i].height / 2) / me.ctrl_arr[i].scale.y);
        me.ctrl_arr[i].x = me.ctrl_arr[i].centerX
        me.ctrl_arr[i].y = me.ctrl_arr[i].centerY
        //更多数据
        me.ass_r_data.associationH = me.ctrl_arr[i].height;
        me.ass_r_data.association_centerX = me.ctrl_arr[i].centerX;
        me.ass_r_data.association_centerY = me.ctrl_arr[i].centerY;
        me.ass_r_data.association_name = me.ctrl_arr[i].association_name
      }
    }
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type !== 'association_gap_notT') {
        me.ctrl_arr[i].beforeRX = me.ctrl_arr[i].parent.x;
        me.ctrl_arr[i].beforeRY = me.ctrl_arr[i].parent.y;
        me.ctrl_arr[i].parent.pivot.set((me.ass_r_data.association_centerX - me.ctrl_arr[i].parent.position.x) / 1, (me.ass_r_data.association_centerY - me.ctrl_arr[i].parent.position.y) / 1);
        me.ctrl_arr[i].parent.x = me.ass_r_data.association_centerX
        me.ctrl_arr[i].parent.y = me.ass_r_data.association_centerY
      }
    }
    me.can_rotate = 1;
  },
  onARotateMove: function(btn = null, event = null) {
    const me = this;
    if (me.can_rotate) {
      let e = event.data.getLocalPosition(me.mainStage_container);
      //计算向量夹角
      let a1 = {};
      a1.x = 0;
      a1.y = -me.ass_r_data.associationH / 2 - me.r_btn_h;

      let a2 = {};
      a2.x = e.x - (me.ass_r_data.association_centerX);
      a2.y = e.y - (me.ass_r_data.association_centerY);
      //
      let cos;
      let numerator = a1.x * a2.x + a1.y * a2.y;
      let denominator = Math.sqrt(a1.x * a1.x + a1.y * a1.y) * Math.sqrt(a2.y * a2.y + a2.x * a2.x);
      cos = numerator / denominator;
      //反余弦值
      me.aRotateOBj(Math.acos(cos), e.x, me.ass_r_data.association_centerX)
    }
  },
  aRotateOBj: function(num, x, centerX) {
    const me = this;
    if (x - (centerX) >= 0) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].rotation = num;
          me.outLine_container.getChildByName(me.ctrl_arr[i].name).rotation = num
        } else {
          me.ctrl_arr[i].parent.rotation = num
        }
      }
    } else {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          me.ctrl_arr[i].rotation = -num;
          me.outLine_container.getChildByName(me.ctrl_arr[i].name).rotation = -num
        } else {
          me.ctrl_arr[i].parent.rotation = -num
        }
      }
    }
  },
  onARotateEnd: function(btn = null, event = null) {
    const me = this;
    me.can_rotate = 0;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type !== 'association_gap_notT') {
        me.ctrl_arr[i].rotation_num = me.ctrl_arr[i].rotation + me.ctrl_arr[i].parent.rotation;
        ////将临时组合元素恢复位置,将父级的旋转取消，本身旋转
        me.ctrl_arr[i].parent.pivot.set(0);
        let param;
        param = [me.ctrl_arr[i].beforeRX - (me.ass_r_data.association_centerX), me.ctrl_arr[i].beforeRY - (me.ass_r_data.association_centerY), me.ctrl_arr[i].parent.rotation]
        param = computed_func.AFTER_ROTATE(param);
        me.ctrl_arr[i].parent.x = parseFloat(param[0]) + (me.ass_r_data.association_centerX)
        me.ctrl_arr[i].parent.y = parseFloat(param[1]) + (me.ass_r_data.association_centerY)
        // me.ctrl_arr[i].parent.rotation_num += me.ctrl_arr[i].parent.rotation; //记录父级旋转的角度，
        me.ctrl_arr[i].parent.rotation = 0;
        me.ctrl_arr[i].rotation = me.ctrl_arr[i].rotation_num;
      } else if (me.ctrl_arr[i].type == 'association_gap_notT') {
        me.ctrl_arr[i].pivot.set(0);
        let param2;
        param2 = [-me.ctrl_arr[i].width / 2, -me.ctrl_arr[i].height / 2, me.ctrl_arr[i].rotation]
        param2 = computed_func.AFTER_ROTATE(param2);
        me.ctrl_arr[i].x = parseFloat(param2[0]) + (me.ass_r_data.association_centerX)
        me.ctrl_arr[i].y = parseFloat(param2[1]) + (me.ass_r_data.association_centerY)
        me.ctrl_arr[i].rotation_num = me.ctrl_arr[i].rotation;
      }
    }
    //渲染边框
    me.forChangeAssociation();
    setTimeout(() => {
      me.renderTLine(false, true, me.ass_r_data.association_name)
    }, 100)
  },
  forChangeAssociation: function(ass_id = undefined) {
    const me = this;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        if (ass_id == undefined || ass_id == me.ctrl_arr[i].association_name) {
          me.ctrl_arr[i].change = true;
          me.change_association(me.ctrl_arr[i])
          break;
        }
      }
    }
  },
  updateSvgScale: function(obj) {
    const me = this;
    let src = obj.texture.baseTexture.resource.svg;
    let res = new PIXI.resources.SVGResource(src, { scale: obj.scale.x * obj.texture.baseTexture.resource.scale, autoLoad: true })
    res.load().then(function() {
      obj.texture.baseTexture.destroy()
      obj.texture.baseTexture.setResource(res);
      obj.texture.baseTexture.update();
      obj.scale.set(1)
    })
  },
  scaleTextEnd(text) {
    const me = this;
    // text.style.wordWrapWidth = text.width;
    text.ofonts = text.style.fontSize;
    text.originalw = text.width;
    text.originalh = text.height;
  },
  ctrlDeviation: function(data, t_r, tem_move = true) {
    const me = this;
    me.in_move = null;
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      me.ctrl_arr[i].data = data;
      me.ctrl_arr[i].dragging = tem_move;
      //偏差值，鼠标点击目标任何位置移动都不会闪烁
      let newPosition = me.ctrl_arr[i].data.getLocalPosition(me.mainStage_container);
      if (me.ctrl_arr[i].type == 'association_gap_notT') {
        me.ctrl_arr[i].deviationX = newPosition.x - me.ctrl_arr[i].x;
        me.ctrl_arr[i].deviationY = newPosition.y - me.ctrl_arr[i].y;
        me.showEdit('association');
      } else {
        me.ctrl_arr[i].deviationX = newPosition.x - me.ctrl_arr[i].parent.x;
        me.ctrl_arr[i].deviationY = newPosition.y - me.ctrl_arr[i].parent.y;
      }
    }
    //临时组合矩形
    if (t_r) {
      me.temporary_rect.data = data;
      me.temporary_rect.dragging = tem_move;
      let newPosition1 = me.temporary_rect.data.getLocalPosition(me.mainStage_container);
      me.temporary_rect.deviationX = newPosition1.x - me.temporary_rect.x;
      me.temporary_rect.deviationY = newPosition1.y - me.temporary_rect.y;
      me.showEdit('temporary');
    }
  },
  moveIcon: function(obj) {
      const me = this;
      me.outLine_container.getChildByName(obj.name).getChildByName('scale-btn').position.set(obj.width / 2, -obj.height / 2);
      me.outLine_container.getChildByName(obj.name).getChildByName('rotate-btn').position.set(0, (-obj.height / 2) - me.r_btn_h);
      if (obj.type == 'text') {
        me.outLine_container.getChildByName(me.in_move.name).getChildByName('stretch-btn').position.set(me.in_move.width / 2, 0);
      }
    },
}
