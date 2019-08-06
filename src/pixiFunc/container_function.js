import * as PIXI from 'pixi.js'
export default {
  name: 'container_func',
  renderTemplate: function() {
    const me = this;
    let data = me.render_data;
    //获取数据，先渲染图片和文字，再对相应的组合进行渲染
    //收集模版中每个模块的首要组合的资源进入缓存
    let img_src = [];
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
        if (data[i].children[0].ass_children[k].type == 'image' || data[i].children[0].ass_children[k].type == 'svg') {
          img_src.push(data[i].children[0].ass_children[k].src)
        }
      }
    }
    me.p_app.loader.add(img_src, {
      crossOrigin: true
    }).load(function() {
      for (let i = 0; i < data.length; i++) {
        for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
          let element_data = data[i].children[0].ass_children[k];
          element_data.association_id = data[i].children[0].association_id
          if (data[i].children[0].ass_children[k].type == 'image' || data[i].children[0].ass_children[k].type == 'svg') {
            //增加图片父级，添加图片并设置图片
            me.newContainer(element_data, true)
          } else if (data[i].children[0].ass_children[k].type == 'text') {
            me.newContainerText(element_data, true)
          }
        }
      }
      me.renderStage()
      //渲染组合矩形
      let ass_arr_obj = {};
      for (let j = 0; j < me.container_arr.length; j++) {
        if (me.container_arr[j].cont.children[0].association_name !== '') {
          let ass_id = me.container_arr[j].cont.children[0].association_name;
          if (ass_arr_obj[ass_id]) {} else {
            ass_arr_obj[ass_id] = []
          }
          ass_arr_obj[ass_id].push(me.container_arr[j].cont.children[0])
        }
      }
      let keys_arr = Object.keys(ass_arr_obj)
      for (let l = 0; l < keys_arr.length; l++) {
        let key = keys_arr[l]
        me.ctrl_arr = ass_arr_obj[key];
        me.create_association(key, ass_arr_obj[key][0].m_comp_name, true)
      }
      //渲染
      me.renderStage()
      me.update_layer()
    })
  },
  renderStage: function() {
    const me = this;
    me.p_app.stage.children[0].removeChildren();
    //有可能要加入一个点击的矩形，用于取消之前选中的对象
    me.addCancleRect(me.mainStage_container)
    //
    for (let i = 0; i < me.container_arr.length; i++) {
      //按顺序渲染容器
      me.mainStage_container.addChild(me.container_arr[i].cont);
      me.container_arr[i].cont.buttonMode = false;
    }
    //增加按钮线框容器
    me.outLine(me.mainStage_container)
    me.p_app.renderer.render(me.p_app.stage);
    me.p_app.stage.interactive = true;
    me.p_app.stage.hitArea = new PIXI.Rectangle(0, 0, me.window_w, me.window_h);
  },
  addCancleRect: function(mainStage) {
    const me = this;
    //创建矩形
    let rectangle = new PIXI.Graphics();
    rectangle.interactive = true;
    rectangle.width = me.window_w;
    rectangle.height = me.window_h;
    rectangle.beginFill(0xFF3300);
    rectangle.alpha = 0;
    rectangle.drawRect(0, 0, me.window_w, me.window_h);
    rectangle.endFill();
    rectangle.name = 'cancel_block';
    rectangle.rotation_num = 0;
    rectangle.x = -(me.window_w - me.canvas_width) / 2;
    rectangle.y = -(me.window_h - me.canvas_height) / 2;
    //监听事件
    rectangle.on('click', me.cancelInMove)
    mainStage.addChild(rectangle);
  },
  outLine: function(mainStage) {
    const me = this;
    let container = new PIXI.Container;
    container.type = 'outLine';
    container.name = 'outLine';
    mainStage.addChild(container);
    me.outLine_container = container
  },
  maskInit: function() {
    const me = this; //遮罩
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x000000, .2);
    rectangle.drawRect(0, 0, me.window_w, (me.window_h - me.canvas_height) / 2);
    rectangle.endFill();
    rectangle.x = 0;
    rectangle.y = 0;
    rectangle.interactive = false;
    me.p_app.stage.addChild(rectangle);
    let rectangle1 = new PIXI.Graphics();
    rectangle1.beginFill(0x000000, .2);
    rectangle1.drawRect(0, 0, me.window_w, (me.window_h - me.canvas_height) / 2);
    rectangle1.endFill();
    rectangle1.x = 0;
    rectangle1.y = me.canvas_height + (me.window_h - me.canvas_height) / 2;
    rectangle1.interactive = false;
    me.p_app.stage.addChild(rectangle1);
    let rectangle2 = new PIXI.Graphics();
    rectangle2.beginFill(0x000000, .2);
    rectangle2.drawRect(0, 0, (me.window_w - me.canvas_width) / 2, me.canvas_height);
    rectangle2.endFill();
    rectangle2.x = 0;
    rectangle2.y = (me.window_h - me.canvas_height) / 2;
    rectangle2.interactive = false;
    me.p_app.stage.addChild(rectangle2);
    let rectangle3 = new PIXI.Graphics();
    rectangle3.beginFill(0x000000, .2);
    rectangle3.drawRect(0, 0, (me.window_w - me.canvas_width) / 2, me.canvas_height);
    rectangle3.endFill();
    rectangle3.x = me.canvas_width + (me.window_w - me.canvas_width) / 2;
    rectangle3.y = (me.window_h - me.canvas_height) / 2;
    rectangle3.interactive = false;
    me.p_app.stage.addChild(rectangle3);
  },
  ruler: function() {
    const me = this;
    let ruler_container = new PIXI.Container;
    ruler_container.width = me.canvas_width;
    ruler_container.height = me.canvas_height;
    ruler_container.position.set(me.window_w / 2, me.window_h / 2)

    let line = new PIXI.Graphics();
    line.lineStyle(1, 0x827D7D, 1);
    for (let i = 1; i <= me.canvas_width; i++) {
      if (i % 100 == 0) {
        line.moveTo(i, 0)
        line.lineTo(i, -20)
      } else if (i % 50 == 0) {
        line.moveTo(i, 0)
        line.lineTo(i, -10)
      } else if (i % 10 == 0) {
        line.moveTo(i, 0)
        line.lineTo(i, -5)
      }
    }
    line.x = -me.canvas_width / 2;
    line.y = -me.canvas_height / 2;

    let line2 = new PIXI.Graphics();
    line2.lineStyle(1, 0x827D7D, 1);
    for (let i = 1; i <= me.canvas_height; i++) {
      if (i % 100 == 0) {
        line.moveTo(0, i)
        line.lineTo(-20, i)
      } else if (i % 50 == 0) {
        line.moveTo(0, i)
        line.lineTo(-10, i)
      } else if (i % 10 == 0) {
        line.moveTo(0, i)
        line.lineTo(-5, i)
      }
    }
    line2.x = -me.canvas_width / 2;
    line2.y = -me.canvas_height / 2;
    ruler_container.addChild(line)
    ruler_container.addChild(line2)
    me.p_app.stage.addChild(ruler_container);
  },
  newContainer: function(set_data, render_add, func = () => {}) {
    //增加新图层新元素
    const me = this;
    if (!me.img_loading) {
      me.cancelInMove()
      set_data.type='image'
      me.addContainer(set_data, set_data.position)
      me.loadSprite(set_data, render_add, func)
    } else {
      alert("已有元素再加载中")
    }
  },
  loadSprite: function(set_data, render_add, func) {
    //加载精灵
    const me = this;
    let src = set_data.src;
    let my_set_data = _.cloneDeep(set_data);
    me.img_loading = true;
    let sprite;
    if (me.p_app.loader.resources[src]) {
      if (/.svg$/.test(src)) {
        me.loadSvgImg(src, sprite, my_set_data, render_add)
      } else {
        //缓存过src的就直接新增
        sprite = new PIXI.Sprite(me.p_app.loader.resources[src].texture);
        me.addImg(sprite, my_set_data, render_add);
        me.img_loading = false;
        func();
      }
    } else {
      me.p_app.loader.add(src, {
        crossOrigin: true
      }).load(function() {
        if (/.svg$/.test(src)) {
          me.loadSvgImg(src, sprite, my_set_data, render_add)
        } else {
          sprite = new PIXI.Sprite(me.p_app.loader.resources[src].texture);
          me.addImg(sprite, my_set_data, render_add);
          me.img_loading = false;
          func();
        }
      });
    }
  },
  loadSvgImg: function(src, sprite, my_set_data, render_add) {
    let res = new PIXI.resources.SVGResource(src, { scale: 1, autoLoad: true })
    res.load().then(function() {
      let texture = new PIXI.BaseTexture(res)
      let texture1 = new PIXI.Texture(texture)
      sprite = new PIXI.Sprite(texture1);
      sprite.svg = true;
      me.addImg(sprite, my_set_data, render_add);
      me.img_loading = false;
      func();
    })
  },
  addImg: function(sprite, set_data, render_add) {
    //添加图片精灵(监听点击，有移动，拉伸功能)精灵名称和容器名称相同
    const me = this
    sprite.interactive = true;
    sprite.anchor.set(0.5);
    sprite.cursor = 'grab';
    sprite.name = set_data.id;
    sprite.type = 'image' //精灵类型为图片
    sprite.srcData = set_data.src;
    sprite.rotation_num = 0;
    sprite.originalw = sprite.width;
    sprite.originalh = sprite.height;
    sprite.position.set(0, 0);
    sprite.association_name = ''; //组合名字，为空说明没有组合
    sprite.m_comp_name = set_data.m_comp_name;
    if (render_add) {
      sprite.rotation = set_data.rotation;
      sprite.rotation_num = set_data.rotation;
      sprite.alpha = set_data.alpha;
      sprite.scale.set(set_data.scale)
      sprite.association_name = set_data.association_id
    }
    //监听事件
    sprite.on('rightdown', me.onRightC).on('mousedown', function(event) {
      me.onDragStart(sprite, event)
    }).on('mousemove', function(event) {
      me.onDragMove(sprite, event)
    }).on('pointerupoutside', function(event) {
      me.onDragEnd(sprite, event)
    }).on('pointerup', function(event) {
      me.onDragEnd(sprite, event)
    });
    //
    //
    me.container_arr[me.findCont(set_data.id)].cont.addChild(sprite);
    if (!render_add) {
      me.renderStage()
      //在图层面板增加图层
      //激活当前选中状态
      me.in_move = sprite
      me.containerLine(me.in_move, false);
      me.showEdit(me.in_move.type)
      //图层面板监听
    }
  },
  addText: function(set_data, render_add) {
    const me = this;
    let style = {
      fontFamily: 'Lantinghei SC',
      fontSize: 50,
      lineHeight: 60,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fill: '#000',
      stroke: '#000',
      strokeThickness: 0,
      dropShadow: false,
      dropShadowColor: '#000000',
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 8,
      wordWrap: true,
      wordWrapWidth: 300,
      breakWords: true,
      padding: 70,
      trim: true
    };
    var richText = new PIXI.Text(set_data.text, style);
    richText.interactive = true;
    richText.anchor.set(0.5);
    richText.cursor = 'grab';
    richText.name = set_data.id;
    richText.type = 'text' //精灵类型为文本
    richText.rotation_num = 0;
    richText.originalw = richText.width;
    richText.originalh = richText.height;
    richText.ofonts = richText.style.fontSize;
    richText.position.set(0, 0);
    richText.lineHeightM = 10;
    richText.association_name = ''; //组合名字，为空说明没有组合
    richText.m_comp_name = set_data.m_comp_name;
    if (render_add) {
      richText.style = set_data.style;
      richText.rotation = set_data.rotation;
      richText.rotation_num = set_data.rotation;
      richText.alpha = set_data.alpha;
      richText.association_name = set_data.association_id;
    }
    me.container_arr[me.findCont(set_data.id)].cont.addChild(richText);
    if (set_data.text_num) {
      richText.text_num = set_data.text_num;
    } else {
      richText.text_num = richText.width / richText.style.fontSize;
    }
    //监听事件
    richText.on('rightdown', me.onRightC).on('mousedown', function(event) {
      me.onDragStart(richText, event)
    }).on('mousemove', function(event) {
      me.onDragMove(richText, event)
    }).on('pointerupoutside', function(event) {
      me.onDragEnd(richText, event)
    }).on('pointerup', function(event) {
      me.onDragEnd(richText, event)
    });
    if (!render_add) {
      me.renderStage()
      me.in_move = richText;
      me.containerLine(richText, false);
      me.showEdit(me.in_move.type)
    }
    //*********
  },
  addContainer: function(set_data, position = { x: this.canvas_width / 2, y: this.canvas_height / 2 }) {
    const me = this;
    let container = new PIXI.Container;
    container.width = me.canvas_width;
    container.height = me.canvas_height;
    container.position.set(position.x, position.y);
    // container.name = `${set_data.id}_c`;
    container.type = `${set_data.type}_c`;
    container.rotation_num = 0;
    //按素材模块分类加入，找到此模块中元素的最高层级，在其后面加入
    me.containerArrAdd(set_data.m_comp_name, container, set_data.id)
  },
  newContainerText: function(set_data, render_add) {
    const me = this;
    set_data.type='text'
    me.addContainer(set_data, set_data.position)
    me.addText(set_data, render_add)
  },
  containerArrAdd: function(m_comp_name, container, id) {
    const me = this;
    let final_index = me.findFinalIndex(m_comp_name);
    //相同模块中最后一个元素的index
    let arr1 = [];
    let arr2 = [{
      cont: container,
      index: 0,
      name: id,
      m_comp_name: m_comp_name
    }];
    let arr3 = [];
    if (final_index == me.container_arr.length - 1 || (final_index == 0 && me.container_arr.length == 0)) {
      me.container_arr = [...me.container_arr, ...arr2]
    } else {
      for (let i = 0; i < me.container_arr.length; i++) {
        if (i <= final_index) {
          arr1.push(me.container_arr[i])
        } else if (i > final_index) {
          arr3.push(me.container_arr[i])
        }
      }
      me.container_arr = [...arr1, ...arr2, ...arr3]
    }
    me.sortContainerArr(true)
  },
  sortContainerArr: function(clear_rotation) {
    const me = this;
    //将数组容器里的index排序
    me.container_arr.map(function(value, index, array) {
      value.index = index;
      if (clear_rotation && (value.cont.type == 'image_c' || value.cont.type == 'text_c')) {
        value.cont.rotation_num = 0;
      }
    })
  },
  containerLine: function(obj, t_a, a_r_btn = false) {
    //增加边框的方法
    const me = this
    //t_a用于判断是否是组合对象或者临时组合，是否添加按钮
    if (!t_a) {
      me.removeLine();
    }
    me.createBorder(obj, t_a, a_r_btn);
  },
  createBorder: function(obj, t_a, a_r_btn, show_btn = true) {
    const me = this;
    let dash = 5;
    //dash是虚线空隙
    let sprite_Border = new PIXI.Container;
    sprite_Border.width = me.canvas_width;
    sprite_Border.height = me.canvas_height;
    if (obj.type == 'association_gap' || obj.type == 'association_gap_notT') {
      //是组合空白区域或者临时组合的
      sprite_Border.position.set(obj.centerX, obj.centerY);
    } else {
      sprite_Border.position.set(obj.parent.position.x, obj.parent.position.y);
    }
    sprite_Border.pivot.set(0, 0);
    sprite_Border.type = 'outLine_child';
    sprite_Border.name = obj.name;
    me.outLine_container.addChild(sprite_Border);
    for (let i = 1; i <= 4; i++) {
      let line = new PIXI.Graphics();
      line.lineStyle(1, 0x87CEFF, 1);
      line.moveTo(0, 0);
      line.type = 'line';
      line.name = 'line'
      switch (i) {
        case 1:
          for (let k = 0; k < obj.height / dash; k++) {
            if (k % 2 == 0 || k == 0) {
              line.lineTo(0, dash * k);
            } else {
              line.moveTo(0, dash * k)
            }
            if (k + 1 >= obj.height / dash) {
              line.lineTo(0, obj.height);
            }
          }
          line.x = obj.width / 2;
          line.y = -obj.height / 2;
          break;
        case 2:
          for (let k = 0; k < obj.width / dash; k++) {
            if (k % 2 == 0 || k == 0) {
              line.lineTo(-k * dash, 0);
            } else {
              line.moveTo(-k * dash, 0)
            }
            if (k + 1 >= obj.width / dash) {
              line.lineTo(-obj.width, 0);
            }
          }
          line.x = obj.width / 2;
          line.y = -obj.height / 2;
          break;
        case 3:
          for (let k = 0; k < obj.width / dash; k++) {
            if (k % 2 == 0 || k == 0) {
              line.lineTo(k * dash, 0);
            } else {
              line.moveTo(k * dash, 0)
            }
            if (k + 1 >= obj.width / dash) {
              line.lineTo(obj.width, 0);
            }
          }
          // line.lineTo(obj.width, 0);
          line.x = -obj.width / 2;
          line.y = obj.height / 2;
          break;
        case 4:
          for (let k = 0; k < obj.height / dash; k++) {
            if (k % 2 == 0 || k == 0) {
              line.lineTo(0, -dash * k);
            } else {
              line.moveTo(0, -dash * k)
            }
            if (k + 1 >= obj.height / dash) {
              line.lineTo(0, -obj.height);
            }
          }
          line.x = -obj.width / 2;
          line.y = obj.height / 2;
      }
      sprite_Border.addChild(line)
    }
    //参数为边框按钮容器对象和选中元素对象
    if (t_a && show_btn) {
      if (obj.type == 'association_gap' || obj.type == 'association_gap_notT') {
        //临时组合的缩放选择按钮
        if (obj.type == 'association_gap_notT' && a_r_btn) {
          me.addScaleIcon(sprite_Border, obj, false, true)
          me.addRotateIcon(sprite_Border, obj, false, true)
        } else if (obj.type == 'association_gap') {
          me.addScaleIcon(sprite_Border, obj, t_a)
          me.addRotateIcon(sprite_Border, obj, t_a)
        }
      }
    } else if (show_btn) {
      if (obj.type == 'text') {
        me.addScaleIcon(sprite_Border, obj)
        me.addStretchIcon(sprite_Border, obj)
        me.addRotateIcon(sprite_Border, obj)
      } else {
        me.addScaleIcon(sprite_Border, obj)
        me.addRotateIcon(sprite_Border, obj)
      }
    }
    //边框图层旋转角度和对象元素选择角度一致
    sprite_Border.rotation = obj.rotation;
  },
  addScaleIcon: function(outLineC, obj, t_a, a_r_btn = false) {
    const me = this;
    let sprite;
    sprite = new PIXI.Sprite(me.p_app.loader.resources[me.scale].texture);
    sprite.interactive = true;
    sprite.scale.set(.5);
    sprite.anchor.set(0.5);
    sprite.name = 'scale-btn';
    sprite.cursor = 'move';
    sprite.type = 'btn' //精灵类型为按钮
    sprite.position.set(obj.width / 2, -obj.height / 2);
    if (t_a) {
      //临时组合监听
      sprite.on('pointerdown', me.onTScaleStart).on('pointerup', me.onTScaleEnd).on('mousemove', function(event) {
        me.onTScaleMove(sprite, event)
      }).on('pointerupoutside', me.onTScaleEnd);
    } else if (a_r_btn) {
      //组合矩形按钮监听
      sprite.on('pointerdown', me.onAScaleStart).on('pointerup', me.onAScaleEnd).on('mousemove', function(event) {
        me.onAScaleMove(sprite, event)
      }).on('pointerupoutside', me.onAScaleEnd);
    } else {
      //监听事件
      sprite.on('pointerdown', me.onScaleStart).on('pointerup', me.onScaleEnd).on('mousemove', function(event) {
        me.onScaleMove(sprite, event)
      }).on('pointerupoutside', me.onScaleEnd);
      // 
    }
    outLineC.addChild(sprite);
  },
  addRotateIcon: function(outLineC, obj, t_a, a_r_btn = false) {
    const me = this;
    let sprite;
    sprite = new PIXI.Sprite(me.p_app.loader.resources[me.rotate].texture);
    sprite.interactive = true;
    sprite.scale.set(.5);
    sprite.anchor.set(0.5);
    sprite.name = 'rotate-btn';
    sprite.cursor = 'pointer';
    sprite.type = 'btn' //精灵类型为按钮
    sprite.position.set(0, -obj.height / 2 - me.r_btn_h);
    if (t_a) {
      //临时组合监听
      sprite.on('pointerdown', me.onTRotateStart).on('pointerup', me.onTRotateEnd).on('mousemove', me.onTRotateMove).on('pointerupoutside', me.onTRotateEnd);
    } else if (a_r_btn) {
      //组合矩形按钮监听
      sprite.on('pointerdown', me.onARotateStart).on('pointerup', function(event) {
        me.onARotateEnd(sprite, event)
      }).on('mousemove', function(event) {
        me.onARotateMove(sprite, event)
      }).on('pointerupoutside', function(event) {
        me.onARotateEnd(sprite, event)
      });
    } else {
      //监听事件
      sprite.on('pointerdown', me.onRotateStart).on('mousemove', me.onRotateMove).on('pointerup', me.onRotateEnd).on('pointerupoutside', me.onRotateEnd);
    }
    outLineC.addChild(sprite);
  },
  addStretchIcon: function(outLineC, obj) {
    const me = this;
    let sprite;
    sprite = new PIXI.Sprite(me.p_app.loader.resources[me.stretch].texture);
    sprite.interactive = true;
    // sprite.buttonMode = true;
    sprite.scale.set(.5);
    sprite.anchor.set(0.5);
    sprite.name = 'stretch-btn';
    sprite.cursor = 'ew-resize';
    sprite.type = 'btn' //精灵类型为按钮
    sprite.position.set(obj.width / 2, 0);
    //监听事件
    sprite.on('pointerdown', me.onStretchStart).on('pointerup', me.onStretchEnd).on('mousemove', me.onStretchMove).on('pointerupoutside', me.onStretchEnd);
    outLineC.addChild(sprite);
  },
  findMinAndAdd: function(data, a_length = 0, a_name = '') {
    const me = this;
    let index_arr = [];
    if ((me.ctrl_arr.length >= 2 && a_length == 0) || (a_length > 1)) {
      me.in_move = null;
      //删除之前的空白区容器，临时组合的空白区容器,不删除临时组合数组
      me.clearTemAss(true) //true表示清空数组中元素的父级旋转角度
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        index_arr.push(me.findCont(me.ctrl_arr[i].name))
      }
      index_arr.sort((a, b) => a - b)
      let container = new PIXI.Container;
      container.width = me.canvas_width;
      container.height = me.canvas_height;
      container.pivot.set(0, 0);
      container.name = 'temporary_c';
      me.container_arr.splice(index_arr[0], 0, {
        cont: container,
        index: index_arr[0],
        name: 'temporary_c'
      })
      //将数组容器里的index排序
      me.sortContainerArr(true)
      //找到临时组合中，最小、最大的x，y，并创建矩形
      me.findRect(container, data, true);
    } else if (me.ctrl_arr.length == 1 && a_length == 0) {
      //单独一个元素
      me.normalStart(me.ctrl_arr[0], data)
      me.in_move.dragging = false;
    } else if (a_length == 1) {
      me.clearTemAss(true)
      //添加组合边框给组合矩形加按钮,不渲染临时边框
      me.renderTLine(false, true, a_name)
    }
  },
  findRect: function(container, data, tem_move) {
    const me = this;
    let x_arr = [];
    let y_arr = [];
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      let vertexData = me.ctrl_arr[i].vertexData
      for (let k = 0; k < vertexData.length; k++) {
        if (k % 2 == 0 || k == 0) {
          x_arr.push(vertexData[k])
        } else {
          y_arr.push(vertexData[k])
        }
      }
    }
    x_arr.sort((a, b) => a - b)
    y_arr.sort((a, b) => a - b)
    let width = x_arr[x_arr.length - 1] - x_arr[0];
    let height = y_arr[y_arr.length - 1] - y_arr[0];
    //设置父级矩形容器的位置
    container.position.set(0, 0);
    //创建矩形
    let rectangle = new PIXI.Graphics();
    rectangle.interactive = true;
    rectangle.width = width;
    rectangle.height = height;
    rectangle.originalw = width;
    rectangle.originalh = height;
    rectangle.beginFill(0xFF3300);
    rectangle.alpha = .7;
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.name = 'temporary';
    rectangle.type = 'association_gap';
    rectangle.rotation_num = 0;
    rectangle.x = x_arr[0] - (me.window_w - me.canvas_width) / 2;
    rectangle.y = y_arr[0] - (me.window_h - me.canvas_height) / 2;
    rectangle.cursor = 'grab';
    //矩形中心点
    rectangle.centerX = rectangle.x + rectangle.width / 2;
    rectangle.centerY = rectangle.y + rectangle.height / 2;
    me.temporary_rect = rectangle;
    //监听事件
    rectangle.on('rightdown', me.onRightC).on('pointerdown', me.onTemporaryStart).on('mousemove', function(event) {
      me.onDragMove(rectangle, event)
    }).on('pointerupoutside', me.onTemporaryEnd).on('pointerup', me.onTemporaryEnd);
    container.addChild(rectangle);
    me.renderStage()
    //添加临时组合边框
    me.renderTLine(true)
    //计算临时组合的偏差值用于移动
    me.ctrlDeviation(data, true, tem_move);
  },
  removeLine: function(id = null) {
    const me = this;
    if (id !== null) {
      let removeObj = me.outLine_container.getChildByName(id);
      me.outLine_container.removeChild(removeObj)
    } else if (me.outLine_container) {
      me.outLine_container.removeChildren()
    }
  },
  cancelInMove: function() {
    const me = this;
    //取消当前选中对象
    me.removeLine()
    if (me.in_move) {
      me.in_move = null;
    } else if (me.temporary_rect) {
      me.clearTemporary()
    }
    me.click_ass_id = '';
    //右侧编辑栏
    me.$set(me.edit_bar.btn, 'show', false)
    me.hide_edit_f()
  },
  clearTemporary: function() {
    //情空临时组合而且清空ctrl_arr数组
    const me = this;
    let index = me.findCont('temporary_c')
    //清空临时组合
    if (index !== -1) {
      //新增了个取消面板，所以index+1
      me.mainStage_container.removeChildAt(index + 1)
      me.container_arr.splice(index, 1)
    }
    if (me.ctrl_arr.length >= 1) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false;
        me.ctrl_arr[i].data = null;
      }
    }
    me.ctrl_arr.length = 0;
    me.temporary_rect = null;
    //将数组容器里的index排序
    me.sortContainerArr(true)
  },
  clearTemAss: function(clear_rotation, clear_association = false) {
    const me = this;
    //删除之前的空白区容器，临时组合的空白区容器,不删除临时组合数组
    if (me.temporary_rect !== null) {
      let index_c = me.findCont('temporary_c')
      if (index_c !== -1) {
        //新增了取消面板所以index+1
        me.mainStage_container.removeChildAt(index_c + 1)
        me.container_arr.splice(index_c, 1)
      }
      me.temporary_rect = null;
    }
    //是否删除数组中元素组合的矩形，新合并数组时删除
    if (clear_association) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          let index_c = me.findCont(me.ctrl_arr[i].name)
          if (index_c !== -1) {
            me.mainStage_container.removeChildAt(index_c + 1)
            me.container_arr.splice(index_c, 1)
          }
        }
      }
    }
    me.sortContainerArr(clear_rotation)
  },
  createAssociation: function(name, m_comp_name, render_create) {
    const me = this;
    //情空临时矩形区域,清空包含在ctrl_arr数组里的其他组合矩形
    if (!render_create) {
      me.clearTemAss(true, true)
    }
    //对组合元素进行排序，全部移动至组合中最高层之下，并维持原组合内顺序
    //找到组合中最高级
    let index_arr = []
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      index_arr.push(me.findCont(me.ctrl_arr[i].name))
    }
    index_arr.sort(function(a, b) {
      return a - b;
    })
    //保存原container_arr中组合最高级之前除去组合中的元素
    let arr1 = [],
      arr2 = [],
      arr3 = [];
    for (let i = 0; i < me.container_arr.length; i++) {
      if (i < index_arr[index_arr.length - 1]) {
        if (me.container_arr[i].cont.children[0].association_name !== name) {
          arr1.push(me.container_arr[i])
        }
      } else if (i > index_arr[index_arr.length - 1]) {
        if (me.container_arr[i].cont.children[0].association_name !== name) {
          arr3.push(me.container_arr[i])
        }
      }
      if (me.container_arr[i].cont.children[0].association_name == name) {
        arr2.push(me.container_arr[i])
      }
    }
    me.container_arr = [...arr1, ...arr2, ...arr3]
    //将数组容器里的index排序
    me.sortContainerArr(true)
    let index_min = -1;
    for (let i = 0; i < me.container_arr.length; i++) {
      if (me.container_arr[i].cont.children[0].association_name == name) {
        index_min = i;
        break;
      }
    }
    //创建组合空白矩形
    let container = new PIXI.Container;
    container.width = me.canvas_width;
    container.height = me.canvas_height;
    container.pivot.set(0, 0);
    container.rotation_num = 0;
    container.name = name;
    me.container_arr.splice(index_min, 0, {
      cont: container,
      index: index_arr[0],
      name: name,
      m_comp_name: m_comp_name
    })
    //将数组容器里的index排序
    me.sortContainerArr(true)
    me.createAssociationRect(container, name, render_create)
  },
  createAssociationRect: function(container, name, render_create) {
    const me = this;
    let x_arr = [];
    let y_arr = [];
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      let vertexData = me.ctrl_arr[i].vertexData
      for (let k = 0; k < vertexData.length; k++) {
        if (k % 2 == 0 || k == 0) {
          x_arr.push(vertexData[k])
        } else {
          y_arr.push(vertexData[k])
        }
      }
    }
    x_arr.sort(function(a, b) {
      return a - b;
    })
    y_arr.sort(function(a, b) {
      return a - b;
    })
    let width = x_arr[x_arr.length - 1] - x_arr[0];
    let height = y_arr[y_arr.length - 1] - y_arr[0];
    //设置父级矩形容器的位置
    container.position.set(0, 0);
    //创建矩形
    let rectangle = new PIXI.Graphics();
    rectangle.interactive = true;
    // rectangle.buttonMode = true;
    rectangle.width = width;
    rectangle.height = height;
    rectangle.originalw = width;
    rectangle.originalh = height;
    rectangle.beginFill(0xE6E6FA);
    rectangle.alpha = .7;
    // rectangle.pivot.set(0.5,0.5);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.name = name;
    rectangle.association_name = name;
    //正式组合的空白矩形
    rectangle.type = 'association_gap_notT';
    rectangle.rotation_num = 0;
    rectangle.x = x_arr[0] - (me.window_w - me.canvas_width) / 2;
    rectangle.y = y_arr[0] - (me.window_h - me.canvas_height) / 2;
    rectangle.cursor = 'grab';
    //矩形中心点
    rectangle.centerX = rectangle.x + rectangle.width / 2;
    rectangle.centerY = rectangle.y + rectangle.height / 2;
    me.ctrl_arr.push(rectangle) //没有顺序之分
    //监听事件
    rectangle.on('rightdown', me.onRightC).on('pointerdown', me.onAssociationStart).on('mousemove', function(event) {
      me.onDragMove(rectangle, event)
    }).on('pointerupoutside', me.onTemporaryEnd).on('pointerup', me.onTemporaryEnd);
    container.addChild(rectangle);
    if (!render_create) {
      me.renderStage()
      //添加组合边框给组合矩形加按钮,不渲染临时边框
      me.renderTLine(false, true, name)
      me.showEdit('association')
    }
  },
  renderTLine: function(t_r, a_r_btn = false, name = '') {
    const me = this;
    //添加临时组合边框
    me.removeLine();
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (a_r_btn && me.ctrl_arr[i].association_name == name) {
        me.containerLine(me.ctrl_arr[i], true, a_r_btn)
      } else {
        me.containerLine(me.ctrl_arr[i], true)
      }
    }
    //值为真则需要添加临时矩形边框
    if (t_r) {
      me.containerLine(me.temporary_rect, true)
    }
  },
}
