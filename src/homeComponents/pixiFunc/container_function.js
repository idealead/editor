import _ from 'lodash'
import axios from 'axios'
export default {
  name: 'container_func',
  renderTemplate: function (firstLoad) {
    const me = this
    let data = me.render_data
    me.p_app.stage.children[0].removeChildren()
    me.$set(me, 'container_arr', [])
    me.$set(me, 'in_move', null)
    me.$set(me, 'ctrl_arr', [])
    me.$set(me, 'temporary_rect', null)
    // 获取数据，先渲染图片和文字，再对相应的组合进行渲染
    // 收集模版中每个模块的首要组合的资源进入缓存
    let img_src = []
    let font_family = {} // 文字字体集合
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
        if (
          data[i].children[0].ass_children[k].type == 'image' ||
          data[i].children[0].ass_children[k].type == 'svg'
        ) {
          let src_from = data[i].children[0].ass_children[k].src
          if (data[i].children[0].ass_children[k].role == 'logo' && firstLoad) { me.$set(me.tempRoleMsg, 'logo', (me.tempRoleMsg['logo'] += 1)) }
          if (data[i].children[0].ass_children[k].role == 'main' && firstLoad) { me.$set(me.tempRoleMsg, 'main', (me.tempRoleMsg['main'] += 1)) }
          if (data[i].children[0].ass_children[k].role == 'arc_titleImg') {
            // 获取弧形文字装饰的参数
            // console.log(`弧形装饰${data[i].children[0].ass_children[k]}`)
            me.$set(
              me.arc_obj,
              'arc_titleImg',
              data[i].children[0].ass_children[k]
            )
          }
          if (data[i].children[0].ass_children[k].role == 'arc_subtitleImg') {
            // 获取弧形文字装饰的参数
            // console.log(`弧形装饰${data[i].children[0].ass_children[k]}`)
            me.$set(
              me.arc_obj,
              'arc_subtitleImg',
              data[i].children[0].ass_children[k]
            )
          }
          if (!me.p_app.loader.resources[src_from]) {
            img_src.push(src_from)
          }
        }
        // 获取模板中的字体，进行加载
        if (data[i].children[0].ass_children[k].type == 'text' && data[i].children[0].ass_children[k].style.fontFamily !== 'st') {
          let thistext_obj = data[i].children[0].ass_children[k]
          font_family[`${thistext_obj.style.fontFamily}`] =
            (font_family[`${thistext_obj.style.fontFamily}`] ? font_family[`${thistext_obj.style.fontFamily}`] : '') +
            thistext_obj.text
        }
      }
    }
    if (Object.keys(font_family).length === 0 || !firstLoad) {
      img_src = Array.from(new Set(img_src))
      me.p_app.loader
        .add(img_src, {
          crossOrigin: 'Anonymous'
        })
        .load(function () {
          me.afterLoad(data, firstLoad)
        })
    } else {
      me.getfontFamilyBack(font_family).then(() => {
        setTimeout(() => {
          // 字体加载完毕回调
          img_src = Array.from(new Set(img_src))
          me.p_app.loader
            .add(img_src, {
              crossOrigin: 'Anonymous'
            })
            .load(function () {
              me.afterLoad(data, firstLoad)
            })
        }, 300)
      })
    }
  },
  fontPost: function (data) {
    const me = this
    let postD = {
      user_id: me.user_data.id,
      font_name: data.font_name,
      text: data.text
    }
    // 压缩字体接口函数
    return axios({
      method: 'post',
      url: me.api.cutFont,
      data: postD
    })
  },
  getAllfontFamily: function (font_family) {
    const me = this
    let allArr = []
    for (let key in font_family) {
      if (key !== 'st') {
        allArr.push(
          me.fontPost({
            font_name: `${key}`,
            text: font_family[key]
          })
        )
      }
    }
    return axios.all(allArr)
  },
  afterLoad: function (data, firstLoad) {
    const me = this
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
        let element_data = data[i].children[0].ass_children[k]
        element_data.association_id = data[i].children[0].association_id
        if (
          data[i].children[0].ass_children[k].type == 'image' ||
          data[i].children[0].ass_children[k].type == 'svg'
        ) {
          // 增加图片父级，添加图片并设置图片
          me.newContainer(element_data, true)
        } else if (data[i].children[0].ass_children[k].type == 'text') {
          // if (element_data.role == 'title' && me.changeTitle !== '') element_data.text = me.changeTitle
          // if (element_data.role == 'subtitle' && me.changeSubtitle !== '') element_data.text = me.changeSubtitle
          if (element_data.role == 'title') { me.$set(me.tempRoleMsg, 'title', (me.tempRoleMsg['title'] += 1)) }
          if (element_data.role == 'subtitle') {
            me.$set(
              me.tempRoleMsg,
              'subtitle',
              (me.tempRoleMsg['subtitle'] += 1)
            )
          }
          // 弧形文字↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 只是记录数据
          if (
            element_data.role == 'arc_title' ||
            element_data.role == 'arc_subtitle'
          ) { me.$set(me.arc_obj, element_data.role, element_data) }
          if (
            me.user_type == 'client' &&
            (element_data.role == 'arc_title' ||
              element_data.role == 'arc_subtitle')
          ) {
            // 用户编辑状态，渲染弧形文字
          } else {
            // 弧形文字↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            me.newContainerText(element_data, true)
          }
        }
      }
    }
    // 判断有没有弧形文字，渲染弧形文字******************************************************************************************************************************
    if (
      me.arc_obj.arc_title &&
      me.arc_obj.arc_titleImg &&
      me.user_type == 'client'
    ) {
      let wordArr = me.arc_obj.arc_title.text.split('')
      let textReplace = typeof (me.arc_obj.arc_title.textReplace) === 'number' ? me.arc_obj.arc_title.textReplace : null
      me.renderARC('arc_title', wordArr, textReplace)
    }
    if (
      me.arc_obj.arc_subtitle &&
      me.arc_obj.arc_subtitleImg &&
      me.user_type == 'client'
    ) {
      let wordArr = me.arc_obj.arc_subtitle.text.split('')
      let textReplace = typeof (me.arc_obj.arc_subtitle.textReplace) === 'number' ? me.arc_obj.arc_subtitle.textReplace : null
      me.renderARC('arc_subtitle', wordArr, textReplace)
    }
    // 判断有没有弧形文字，渲染弧形文字********************************************************************************************************************************
    me.renderStage()
    // 渲染组合矩形
    let ass_arr_obj = {}
    for (let j = 0; j < me.container_arr.length; j++) {
      if (me.container_arr[j].cont.children[0].association_name !== '') {
        let ass_id = me.container_arr[j].cont.children[0].association_name
        if (ass_arr_obj[ass_id]) {
        } else {
          ass_arr_obj[ass_id] = []
        }
        ass_arr_obj[ass_id].push(me.container_arr[j].cont.children[0])
      }
    }
    let keys_arr = Object.keys(ass_arr_obj)
    if (keys_arr.length > 0) {
      for (let l = 0; l < keys_arr.length; l++) {
        let key = keys_arr[l]
        me.ctrl_arr = ass_arr_obj[key]
        me.createAssociation(key, ass_arr_obj[key][0].m_comp_name, true)
      }
      me.renderStage()
    }
    // 渲染组合矩形
    if (firstLoad) {
      console.log('渲染模板')
      // 存储进活动日志
      me.pushActiveLog(true)
      // setTimeout(() => {
      //   if (me.user_type == 'render') {
      //     me.saveMould(me.mould_name, '', false)
      //   }
      // }, 20)
    }
    if (me.ctrl_arr) me.ctrl_arr.length = 0
    me.updateLayer()
  },
  renderStage: function () {
    const me = this
    me.p_app.stage.children[0].removeChildren()
    // 有可能要加入一个点击的矩形，用于取消之前选中的对象
    me.addCancleRect(me.mainStage_container)
    //
    for (let i = 0; i < me.container_arr.length; i++) {
      // 按顺序渲染容器
      me.mainStage_container.addChild(me.container_arr[i].cont)
      me.container_arr[i].cont.buttonMode = false
    }
    // 增加按钮线框容器
    me.outLine()
    // me.p_app.renderer.render(me.p_app.stage);
    me.p_app.stage.interactive = true
    me.p_app.stage.hitArea = new me.mypixi.Rectangle(0, 0, me.window_w, me.window_h)
  },
  addCancleRect: function (mainStage) {
    const me = this
    // 创建矩形
    let rectangle = new me.mypixi.Graphics()
    rectangle.interactive = true
    rectangle.width = me.window_w
    rectangle.height = me.window_h
    rectangle.beginFill(0xff3300)
    rectangle.alpha = 0
    rectangle.drawRect(0, 0, me.window_w, me.window_h)
    rectangle.endFill()
    rectangle.name = 'cancel_block'
    rectangle.rotation_num = 0
    rectangle.x = -(me.window_w - me.canvas_width) / 2
    rectangle.y = -(me.window_h - me.canvas_height) / 2
    // 监听事件
    rectangle.on('click', me.cancelInMove)
    mainStage.addChild(rectangle)
  },
  outLine: function () {
    const me = this
    me.outLine_container = new me.mypixi.Container()
    me.outLine_container.type = 'outLine'
    me.outLine_container.name = 'outLine'
    me.mainStage_container.addChild(me.outLine_container)
    // me.outLine_container = container
    // container = null
  },
  maskInit: function () {
    const me = this // 遮罩
    let rectangle = new me.mypixi.Graphics()
    rectangle.beginFill(0xdbdbdb, 0.5)
    rectangle.drawRect(0, 0, me.window_w, (me.window_h - me.canvas_height) / 2)
    rectangle.endFill()
    rectangle.x = 0
    rectangle.y = 0
    rectangle.interactive = false
    me.p_app.stage.addChild(rectangle)
    let rectangle1 = new me.mypixi.Graphics()
    rectangle1.beginFill(0xdbdbdb, 0.5)
    rectangle1.drawRect(
      0,
      0,
      me.window_w,
      (me.window_h - me.canvas_height) / 2
    )
    rectangle1.endFill()
    rectangle1.x = 0
    rectangle1.y = me.canvas_height + (me.window_h - me.canvas_height) / 2
    rectangle1.interactive = false
    me.p_app.stage.addChild(rectangle1)
    let rectangle2 = new me.mypixi.Graphics()
    rectangle2.beginFill(0xdbdbdb, 0.5)
    rectangle2.drawRect(
      0,
      0,
      (me.window_w - me.canvas_width) / 2,
      me.canvas_height
    )
    rectangle2.endFill()
    rectangle2.x = 0
    rectangle2.y = (me.window_h - me.canvas_height) / 2
    rectangle2.interactive = false
    me.p_app.stage.addChild(rectangle2)
    let rectangle3 = new me.mypixi.Graphics()
    rectangle3.beginFill(0xdbdbdb, 0.5)
    rectangle3.drawRect(
      0,
      0,
      (me.window_w - me.canvas_width) / 2,
      me.canvas_height
    )
    rectangle3.endFill()
    rectangle3.x = me.canvas_width + (me.window_w - me.canvas_width) / 2
    rectangle3.y = (me.window_h - me.canvas_height) / 2
    rectangle3.interactive = false
    me.p_app.stage.addChild(rectangle3)
    rectangle3 = null
    rectangle2 = null
    rectangle1 = null
    rectangle = null
    // new Array(4).fill(null)
  },
  ruler: function () {
    const me = this
    let ruler_container = new me.mypixi.Container()
    ruler_container.width = me.canvas_width
    ruler_container.height = me.canvas_height
    ruler_container.position.set(me.window_w / 2, me.window_h / 2)

    let line = new me.mypixi.Graphics()
    line.lineStyle(1, 0x827d7d, 1)
    for (let i = 1; i <= me.canvas_width; i++) {
      if (i % 100 == 0) {
        line.moveTo(i, 0)
        line.lineTo(i, -20)
        let text = new me.mypixi.Text(i)
        text.style.fontSize = '20px'
        text.style.fill = 0x827d7d
        text.x = i - me.canvas_width / 2
        text.y = -35 - me.canvas_height / 2
        ruler_container.addChild(text)
      } else if (i % 50 == 0) {
        line.moveTo(i, 0)
        line.lineTo(i, -10)
      } else if (i % 10 == 0) {
        line.moveTo(i, 0)
        line.lineTo(i, -5)
      }
    }
    line.x = -me.canvas_width / 2
    line.y = -me.canvas_height / 2

    let line2 = new me.mypixi.Graphics()
    line2.lineStyle(1, 0x827d7d, 1)
    for (let i = 1; i <= me.canvas_height; i++) {
      if (i % 100 == 0) {
        line.moveTo(0, i)
        line.lineTo(-20, i)
        let text = new me.mypixi.Text(i)
        text.style.fontSize = '20px'
        text.style.fill = 0x827d7d
        text.x = -45 - me.canvas_width / 2
        text.y = i - me.canvas_height / 2
        ruler_container.addChild(text)
      } else if (i % 50 == 0) {
        line.moveTo(0, i)
        line.lineTo(-10, i)
      } else if (i % 10 == 0) {
        line.moveTo(0, i)
        line.lineTo(-5, i)
      }
    }
    line2.x = -me.canvas_width / 2
    line2.y = -me.canvas_height / 2
    ruler_container.addChild(line)
    ruler_container.addChild(line2)
    me.ruler_container = ruler_container
    me.p_app.stage.addChild(ruler_container)
  },
  newContainer: function (set_data, render_add, func = () => { }) {
    // 增加新图层新元素
    const me = this
    if (!me.img_loading) {
      me.cancelInMove()
      set_data.type = 'image'
      // set_data.file_id = set_data.file_id
      set_data.id = `${set_data.id}`
      me.addContainer(set_data, set_data.position)
      me.loadSprite(set_data, render_add, func)
    } else {
      alert('已有元素再加载中')
    }
  },
  loadSprite: function (set_data, render_add, func) {
    // 加载精灵
    const me = this
    let my_set_data = _.cloneDeep(set_data)
    let src = my_set_data.src
    me.img_loading = true
    let sprite
    if (me.p_app.loader.resources[src]) {
      if (/.svg$/.test(src)) {
        me.loadSvgImg(src, sprite, my_set_data, render_add, func)
      } else {
        // 缓存过src的就直接新增
        sprite = new me.mypixi.Sprite(me.p_app.loader.resources[src].texture)
        me.addImg(sprite, my_set_data, render_add)
        me.img_loading = false
        func()
      }
    } else {
      me.p_app.loader
        .add(src, {
          crossOrigin: 'anonymous'
        })
        .load(function () {
          if (/.svg$/.test(src)) {
            me.loadSvgImg(src, sprite, my_set_data, render_add, func)
          } else {
            sprite = new me.mypixi.Sprite(me.p_app.loader.resources[src].texture)
            me.addImg(sprite, my_set_data, render_add)
            me.img_loading = false
            func()
          }
        })
    }
  },
  loadSvgImg: function (src, sprite, my_set_data, render_add, func) {
    const me = this
    let res = new me.mypixi.resources.SVGResource(src, { scale: 1, autoLoad: true })
    res.load().then(function () {
      let texture = new me.mypixi.BaseTexture(res)
      let texture1 = new me.mypixi.Texture(texture)
      sprite = new me.mypixi.Sprite(texture1)
      sprite.svg = true
      me.addImg(sprite, my_set_data, render_add)
      me.img_loading = false
      func()
    })
  },
  addImg: function (sprite, set_data, render_add) {
    // 添加图片精灵(监听点击，有移动，拉伸功能)精灵名称和容器名称相同
    const me = this
    sprite.interactive = true
    sprite.anchor.set(0.5)
    sprite.cursor = 'grab'
    sprite.name = `${set_data.id}`
    sprite.file_id = set_data.file_id
    sprite.type = 'image' // 精灵类型为图片
    sprite.srcData = set_data.src
    sprite.rotation_num = 0
    sprite.originalw = sprite.width
    sprite.originalh = sprite.height
    sprite.position.set(0, 0)
    sprite.association_name = '' // 组合名字，为空说明没有组合
    sprite.m_comp_name = set_data.m_comp_name
    sprite.lock = false
    sprite.role = 'normal'
    // 倾斜功能
    if (set_data.skew) {
      sprite.skew.set(set_data.skew.x, set_data.skew.y)
    }
    // 色相功能
    if (typeof (set_data.hueNumber) === 'number') {
      sprite.hueNumber = set_data.hueNumber
      set_data.hueNumber *= 360
      let filter = new me.mypixi.filters.ColorMatrixFilter()
      filter.hue(set_data.hueNumber, true)
      sprite.filters = [filter]
    }
    if (render_add) {
      sprite.rotation = set_data.rotation
      sprite.rotation_num = set_data.rotation
      sprite.alpha = set_data.alpha
      sprite.scale.set(set_data.scale)
      sprite.association_name = set_data.association_id
      sprite.role = set_data.role
      // if (set_data.role.search('arc') !== -1) {
      //   sprite.arc = set_data.arc
      // }
    }
    // 监听事件
    sprite
      .on('rightdown', me.onRightC)
      .on('mousedown', me.onDragStart)
      .on('mousemove', me.onDragMove)
      .on('mouseupoutside', me.onDragEnd)
      .on('mouseup', me.onDragEnd)
    //
    //
    me.container_arr[me.findCont(set_data.id)].cont.addChild(sprite)
    if (!render_add) {
      me.renderStage()
      // 在图层面板增加图层
      // 激活当前选中状态
      me.in_move = sprite
      me.containerLine(me.in_move, false)
      me.showEdit(me.in_move.type)
      // 图层面板监听
    }
    // sprite.off()
    // sprite = null
  },
  addText: function (set_data, render_add, saveLog) {
    const me = this
    let richText = null
    let style = {
      fontFamily: 'st',
      fontSize: 50,
      lineHeight: 50,
      leading: 0,
      fontStyle: 'normal',
      fontWeight: 'normal',
      fill: '#000',
      stroke: '#000',
      strokeThickness: 0,
      dropShadow: false,
      dropShadowColor: '#000000',
      dropShadowAngle: Math.PI / 6,
      dropShadowBlur: 0,
      dropShadowDistance: 18,
      wordWrap: true,
      wordWrapWidth: 400,
      breakWords: true,
      padding: 0,
      textBaseline: 'Middle',
      trim: false,
      whiteSpace: 'pre'
    }
    if (render_add) {
      richText = new me.mypixi.Text(`${set_data.text}`, set_data.style)
    } else {
      richText = new me.mypixi.Text(`${set_data.text}`, style)
    }
    richText.interactive = true
    richText.anchor.set(0.5)
    richText.cursor = 'grab'
    richText.name = set_data.id
    richText.type = 'text' // 精灵类型为文本
    richText.rotation_num = 0
    richText.originalw = richText.width
    richText.originalh = richText.height
    richText.ofonts = richText.style.fontSize
    richText.position.set(0, 0)
    richText.lineHeightM = richText.lineHeight - richText.fontSize
    richText.association_name = '' // 组合名字，为空说明没有组合
    richText.m_comp_name = set_data.m_comp_name
    richText.lock = false
    richText.role = 'normal'
    // 倾斜功能
    if (set_data.skew) {
      richText.skew.set(set_data.skew.x, set_data.skew.y)
    }
    // 文案替换功能
    if (typeof (set_data.textReplace) === 'number') {
      richText.textReplace = set_data.textReplace
      richText.textPosition = me.textPositionArr[set_data.textReplace]
    }
    // 文本倒序
    if (set_data.textReverse) {
      // let rtext = set_data.text.split('')
      // rtext = rtext.reverse()
      // richText.text = rtext.join('')
      richText.textReverse = true
    }
    // 色相功能
    if (typeof (set_data.hueNumber) === 'number') {
      richText.hueNumber = set_data.hueNumber
      set_data.hueNumber *= 360
      let filter = new me.mypixi.filters.ColorMatrixFilter()
      filter.hue(set_data.hueNumber, true)
      richText.filters = [filter]
    }
    if (render_add) {
      richText.rotation = set_data.rotation
      richText.rotation_num = set_data.rotation
      richText.alpha = set_data.alpha
      richText.association_name = set_data.association_id
      richText.ofonts = set_data.style.fontSize
      richText.originalw = richText.width
      richText.originalh = richText.height
      richText.role = set_data.role
      // if (set_data.structure && me.user_type == 'designer' && me.structure_id != '') {
      //   //此处方法废弃，structure
      //   richText.structure = set_data.structure
      // }
    }
    me.container_arr[me.findCont(set_data.id)].cont.addChild(richText)
    if (!saveLog) {
      richText.type = 'notSave'
    } else {
      if (set_data.text_num) {
        richText.text_num = set_data.text_num
      } else {
        richText.text_num = richText.width / richText.style.fontSize
      }
      // 监听事件
      richText
        .on('rightdown', me.onRightC)
        .on('mousedown', me.onDragStart)
        .on('mousemove', me.onDragMove)
        .on('mouseupoutside', me.onDragEnd)
        .on('mouseup', me.onDragEnd)
      if (!render_add) {
        me.renderStage()
        me.in_move = richText
        me.containerLine(richText, false)
        me.showEdit(me.in_move.type)
      }
    }
    if (richText.role == 'arc_title') {
      // 貌似要addchild或者渲染进canvas后，把对象赋值才有用
      setTimeout(() => {
        me.arc_obj.title_obj = richText
      }, 0)
      // me.$set(me.arc_obj, 'title_obj', richText)
    } else if (richText.role == 'arc_subtitle') {
      setTimeout(() => {
        me.arc_obj.subtitle_obj = richText
      }, 0)
      // me.$set(me.arc_obj, 'subtitle_obj', richText)
    }
    set_data = null
    style = null
    richText.off()
    richText = null
    //* ********
  },
  addContainer: function (
    set_data,
    position = { x: this.canvas_width / 2, y: this.canvas_height / 2 }
  ) {
    const me = this
    let container = new me.mypixi.Container()
    container.width = me.canvas_width
    container.height = me.canvas_height
    container.position.set(position.x, position.y)
    // container.name = `${set_data.id}_c`;
    container.type = `${set_data.type}_c`
    container.rotation_num = 0
    // 按素材模块分类加入，找到此模块中元素的最高层级，在其后面加入
    me.containerArrAdd(set_data.m_comp_name, container, set_data.id)
    container = null
  },
  newContainerText: function (set_data, render_add, saveLog) {
    const me = this
    set_data.type = 'text'
    // let time = new Date().getTime()
    set_data.id = `${set_data.id}`
    me.addContainer(set_data, set_data.position)
    me.addText(set_data, render_add, saveLog)
    set_data = null
  },
  containerArrAdd: function (m_comp_name, container, id) {
    const me = this
    let final_index = me.findFinalIndex(m_comp_name)
    // 相同模块中最后一个元素的index
    let arr1 = []
    let arr2 = [
      {
        cont: container,
        index: 0,
        name: id,
        m_comp_name: m_comp_name
      }
    ]
    let arr3 = []
    if (
      final_index == me.container_arr.length - 1 ||
      (final_index == 0 && me.container_arr.length == 0)
    ) {
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
  sortContainerArr: function (clear_rotation) {
    const me = this
    // 将数组容器里的index排序
    me.container_arr.map(function (value, index, array) {
      value.index = index
      if (
        clear_rotation &&
        (value.cont.type == 'image_c' || value.cont.type == 'text_c')
      ) {
        value.cont.rotation_num = 0
      }
    })
  },
  containerLine: function (obj, t_a, a_r_btn, color, lock) {
    // 增加边框的方法
    const me = this
    // t_a用于判断是否是组合对象或者临时组合，是否添加按钮
    if (!t_a) {
      me.removeLine()
    }
    // 克隆尝试解决内存泄露（有可能循环引用）
    // let cloneObj=_.cloneDeep(obj)
    me.createBorder(obj, t_a, a_r_btn, !lock, color)
    // cloneObj=null
  },
  createBorder: function (obj, t_a, a_r_btn, show_btn, color) {
    let me = this
    let dash = 15
    // dash是虚线空隙
    let sprite_Border = new me.mypixi.Container()
    sprite_Border.width = me.canvas_width
    sprite_Border.height = me.canvas_height
    if (obj.type == 'association_gap' || obj.type == 'association_gap_notT') {
      // 是组合空白区域或者临时组合的
      sprite_Border.position.set(obj.centerX, obj.centerY)
    } else {
      sprite_Border.position.set(obj.parent.position.x, obj.parent.position.y)
    }
    sprite_Border.pivot.set(0, 0)
    sprite_Border.type = 'outLine_child'
    sprite_Border.name = obj.name

    let line = new me.mypixi.Graphics()
    line.lineStyle(2, color, 1)
    line.moveTo(0, 0)
    line.type = 'line'
    line.name = 'line'
    for (let k = 0; k < Math.ceil(obj.height / dash); k++) {
      if (k + 1 >= Math.ceil(obj.height / dash)) {
        // line.moveTo(0, dash * k)
        // line.lineTo(0, Math.ceil(obj.height))
        // line.moveTo(Math.ceil(-obj.width), (k - 1 > 0 ? k - 1 : 0) * dash)
        // line.lineTo(Math.ceil(-obj.width), Math.ceil(obj.height))
        line.moveTo(0, 0)
        break
      }
      if (k % 2 == 0 || k == 0) {
        line.lineTo(0, dash * k)
        line.moveTo(Math.ceil(-obj.width), (k - 1 > 0 ? k - 1 : 0) * dash)
        line.lineTo(Math.ceil(-obj.width), dash * k)
      } else {
        line.moveTo(0, dash * k)
      }
    }
    for (let k = 0; k < Math.ceil(obj.width / dash); k++) {
      // if (k + 1 >= Math.ceil(obj.width / dash)) {
      //   line.moveTo(-dash * k, 0)
      //   line.lineTo(Math.ceil(-obj.width), 0)
      //   line.moveTo((k - 1 > 0 ? k - 1 : 0) * -dash, Math.ceil(obj.height))
      //   line.lineTo(Math.ceil(-obj.width), Math.ceil(obj.height))
      //   break
      // }
      if (k % 2 == 0 || k == 0) {
        line.lineTo(-k * dash, 0)
        line.moveTo((k - 1 > 0 ? k - 1 : 0) * -dash, Math.ceil(obj.height))
        line.lineTo(-k * dash, Math.ceil(obj.height))
      } else {
        line.moveTo(-k * dash, 0)
      }
    }
    line.x = Math.ceil(obj.width / 2)
    line.y = Math.ceil(-obj.height / 2)

    // 参数为边框按钮容器对象和选中元素对象
    if (t_a && show_btn) {
      if (obj.type == 'association_gap' || obj.type == 'association_gap_notT') {
        // 临时组合的缩放选择按钮
        if (obj.type == 'association_gap_notT' && a_r_btn) {
          me.addScaleIcon(sprite_Border, obj, false, true)
          me.addRotateIcon(sprite_Border, obj, false, true)
        } else if (obj.type == 'association_gap') {
          me.addScaleIcon(sprite_Border, obj, t_a)
          me.addRotateIcon(sprite_Border, obj, t_a)
        }
      }
    } else if (show_btn) {
      if (obj.type == 'text' && !obj.structure) {
        // 骨架的文字不允许增加按钮
        me.addScaleIcon(sprite_Border, obj)
        me.addStretchIcon(sprite_Border, obj)
        me.addRotateIcon(sprite_Border, obj)
      } else if (obj.type == 'image') {
        me.addScaleIcon(sprite_Border, obj)
        me.addRotateIcon(sprite_Border, obj)
      }
    }
    // 添加线框会导致内存泄露
    sprite_Border.addChild(line);
    me.outLine_container.addChild(sprite_Border)

    // 边框图层旋转角度和对象元素选择角度一致
    sprite_Border.rotation = obj.rotation
    sprite_Border = null
    line = null
    obj = null
    me = null
  },
  addScaleIcon: function (outLineC, obj, t_a, a_r_btn = false) {
    const me = this
    let sprite
    sprite = new me.mypixi.Sprite(me.p_app.loader.resources[me.scale].texture)
    sprite.interactive = true
    sprite.scale.set(2)
    sprite.anchor.set(0.5)
    sprite.name = 'scale-btn'
    sprite.cursor = 'move'
    sprite.type = 'btn' // 精灵类型为按钮
    sprite.position.set(Math.floor(obj.width / 2), Math.floor(-obj.height / 2))
    if (t_a) {
      // 临时组合监听
      sprite
        .on('pointerdown', me.onTScaleStart)
        .on('pointerup', me.onTScaleEnd)
        .on('mousemove', function (event) {
          me.onTScaleMove(sprite, event)
        })
        .on('pointerupoutside', me.onTScaleEnd)
    } else if (a_r_btn) {
      // 组合矩形按钮监听
      sprite
        .on('pointerdown', me.onAScaleStart)
        .on('pointerup', me.onAScaleEnd)
        .on('mousemove', function (event) {
          me.onAScaleMove(sprite, event)
        })
        .on('pointerupoutside', me.onAScaleEnd)
    } else {
      // 监听事件
      sprite
        .on('pointerdown', me.onScaleStart)
        .on('pointerup', me.onScaleEnd)
        .on('mousemove', function (event) {
          me.onScaleMove(sprite, event)
        })
        .on('pointerupoutside', me.onScaleEnd)
      //
    }
    outLineC.addChild(sprite)
    sprite.off()
    if (!t_a && !a_r_btn) {
      sprite = null
    }
    outLineC = null
  },
  addRotateIcon: function (outLineC, obj, t_a, a_r_btn = false) {
    const me = this
    let sprite
    sprite = new me.mypixi.Sprite(me.p_app.loader.resources[me.rotate].texture)
    sprite.interactive = true
    sprite.scale.set(2)
    sprite.anchor.set(0.5)
    sprite.name = 'rotate-btn'
    sprite.cursor = 'pointer'
    sprite.type = 'btn' // 精灵类型为按钮
    sprite.position.set(0, Math.floor(-obj.height / 2 - me.r_btn_h))
    if (t_a) {
      // 临时组合监听
      sprite
        .on('pointerdown', me.onTRotateStart)
        .on('pointerup', me.onTRotateEnd)
        .on('mousemove', me.onTRotateMove)
        .on('pointerupoutside', me.onTRotateEnd)
    } else if (a_r_btn) {
      // 组合矩形按钮监听
      sprite
        .on('pointerdown', me.onARotateStart)
        .on('pointerup', function (event) {
          me.onARotateEnd(sprite, event)
        })
        .on('mousemove', function (event) {
          me.onARotateMove(sprite, event)
        })
        .on('pointerupoutside', function (event) {
          me.onARotateEnd(sprite, event)
        })
    } else {
      // 监听事件
      sprite
        .on('pointerdown', me.onRotateStart)
        .on('mousemove', me.onRotateMove)
        .on('pointerup', me.onRotateEnd)
        .on('pointerupoutside', me.onRotateEnd)
    }
    outLineC.addChild(sprite)
    sprite.off()
    sprite = null
    outLineC = null
  },
  addStretchIcon: function (outLineC, obj) {
    const me = this
    let sprite
    sprite = new me.mypixi.Sprite(me.p_app.loader.resources[me.stretch].texture)
    sprite.interactive = true
    // sprite.buttonMode = true;
    sprite.scale.set(2)
    sprite.anchor.set(0.5)
    sprite.name = 'stretch-btn'
    sprite.cursor = 'ew-resize'
    sprite.type = 'btn' // 精灵类型为按钮
    sprite.position.set(Math.floor(obj.width / 2), 0)
    // 监听事件
    sprite
      .on('pointerdown', me.onStretchStart)
      .on('pointerup', me.onStretchEnd)
      .on('mousemove', me.onStretchMove)
      .on('pointerupoutside', me.onStretchEnd)
    outLineC.addChild(sprite)
    sprite.off()
    sprite = null
    outLineC = null
  },
  findMinAndAdd: function (data, a_length = 0, a_name = '') {
    const me = this
    let index_arr = []
    if ((me.ctrl_arr.length >= 2 && a_length == 0) || a_length > 1) {
      me.in_move = null
      // 删除之前的空白区容器，临时组合的空白区容器,不删除临时组合数组
      me.clearTemAss(true) // true表示清空数组中元素的父级旋转角度
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        index_arr.push(me.findCont(me.ctrl_arr[i].name))
      }
      index_arr.sort((a, b) => a - b)
      let container = new me.mypixi.Container()
      container.width = me.canvas_width
      container.height = me.canvas_height
      container.pivot.set(0, 0)
      container.name = 'temporary_c'
      me.container_arr.splice(index_arr[0], 0, {
        cont: container,
        index: index_arr[0],
        name: 'temporary_c'
      })
      // 将数组容器里的index排序
      me.sortContainerArr(true)
      // 找到临时组合中，最小、最大的x，y，并创建矩形
      me.findRect(container, data, true)
    } else if (me.ctrl_arr.length == 1 && a_length == 0) {
      // 单独一个元素
      me.normalStart(me.ctrl_arr[0], data)
      me.in_move.dragging = false
    } else if (a_length == 1) {
      me.clearTemAss(true)
      // 添加组合边框给组合矩形加按钮,不渲染临时边框
      me.renderTLine(false, true, a_name)
    }
  },
  findRect: function (container, data, tem_move) {
    const me = this
    let x_arr = []
    let y_arr = []
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
    let width = x_arr[x_arr.length - 1] - x_arr[0]
    let height = y_arr[y_arr.length - 1] - y_arr[0]
    // 设置父级矩形容器的位置
    container.position.set(0, 0)
    // 创建矩形
    let rectangle = new me.mypixi.Graphics()
    rectangle.interactive = true
    rectangle.width = width
    rectangle.height = height
    rectangle.originalw = width
    rectangle.originalh = height
    rectangle.beginFill(0xff3300, 0.1)
    rectangle.alpha = 0.01
    rectangle.drawRect(0, 0, width, height)
    rectangle.endFill()
    rectangle.name = 'temporary'
    rectangle.type = 'association_gap'
    rectangle.rotation_num = 0
    rectangle.x = x_arr[0] - (me.window_w - me.canvas_width) / 2
    rectangle.y = y_arr[0] - (me.window_h - me.canvas_height) / 2
    rectangle.cursor = 'grab'
    // 矩形中心点
    rectangle.centerX = rectangle.x + rectangle.width / 2
    rectangle.centerY = rectangle.y + rectangle.height / 2
    me.temporary_rect = rectangle
    // 监听事件
    rectangle
      .on('rightdown', me.onRightC)
      .on('mousedown', me.onTemporaryStart)
      .on('mousemove', me.onDragMove)
      .on('mouseupoutside', me.onTemporaryEnd)
      .on('mouseup', me.onTemporaryEnd)
    container.addChild(rectangle)
    me.renderStage()
    // 添加临时组合边框
    me.renderTLine(true)
    // 计算临时组合的偏差值用于移动
    me.ctrlDeviation(data, true, tem_move)
  },
  removeLine: function (id = null) {
    let me = this
    if (id !== null) {
      let removeObj = me.outLine_container.getChildByName(id)
      removeObj.removeChildren()
      me.outLine_container.removeChild(removeObj)
      removeObj = null
    } else if (me.outLine_container) {
      me.outLine_container.removeChildren()
    }
    me = null
  },
  cancelInMove: function () {
    const me = this
    // 取消当前选中对象
    me.removeLine()
    if (me.in_move) {
      me.in_move = null
    } else if (me.temporary_rect) {
      me.clearTemporary()
    }
    if (me.ctrl_arr) me.ctrl_arr.length = 0
    me.click_ass_id = ''
    // 右侧编辑栏
    me.$set(me.edit_bar.btn, 'show', false)
    me.hide_edit_f()
    me.updateLayer()
  },
  clearTemporary: function () {
    // 情空临时组合而且清空ctrl_arr数组
    const me = this
    let index = me.findCont('temporary_c')
    // 清空临时组合
    if (index !== -1) {
      // 新增了个取消面板，所以index+1
      me.mainStage_container.removeChildAt(index + 1)
      me.container_arr.splice(index, 1)
    }
    if (me.ctrl_arr.length >= 1) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.ctrl_arr[i].dragging = false
        me.ctrl_arr[i].data = null
      }
    }
    me.ctrl_arr.length = 0
    me.temporary_rect = null
    // 将数组容器里的index排序
    me.sortContainerArr(true)
  },
  clearTemAss: function (clear_rotation, clear_association = false) {
    const me = this
    // 删除之前的空白区容器，临时组合的空白区容器,不删除临时组合数组
    if (me.temporary_rect !== null) {
      let index_c = me.findCont('temporary_c')
      if (index_c !== -1) {
        // 新增了取消面板所以index+1
        me.mainStage_container.removeChildAt(index_c + 1)
        me.container_arr.splice(index_c, 1)
      }
      me.temporary_rect = null
    }
    // 是否删除数组中元素组合的矩形，新合并数组时删除
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
  createAssociation: function (name, m_comp_name, render_create) {
    const me = this
    // 情空临时矩形区域,清空包含在ctrl_arr数组里的其他组合矩形
    if (!render_create) {
      me.clearTemAss(true, true)
    }
    // 对组合元素进行排序，全部移动至组合中最高层之下，并维持原组合内顺序
    // 找到组合中最高级
    let index_arr = []
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      index_arr.push(me.findCont(me.ctrl_arr[i].name))
    }
    index_arr.sort(function (a, b) {
      return a - b
    })
    // 保存原container_arr中组合最高级之前除去组合中的元素
    let arr1 = []
    let arr2 = []
    let arr3 = []
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
    // 将数组容器里的index排序
    me.sortContainerArr(true)
    let index_min = -1
    for (let i = 0; i < me.container_arr.length; i++) {
      if (me.container_arr[i].cont.children[0].association_name == name) {
        index_min = i
        break
      }
    }
    // 创建组合空白矩形
    let container = new me.mypixi.Container()
    container.width = me.canvas_width
    container.height = me.canvas_height
    container.pivot.set(0, 0)
    container.rotation_num = 0
    container.name = name
    me.container_arr.splice(index_min, 0, {
      cont: container,
      index: index_arr[0],
      name: name,
      m_comp_name: m_comp_name
    })
    // 将数组容器里的index排序
    me.sortContainerArr(true)
    me.createAssociationRect(container, name, render_create)
  },
  createAssociationRect: function (container, name, render_create) {
    const me = this
    let x_arr = []
    let y_arr = []
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
    x_arr.sort(function (a, b) {
      return a - b
    })
    y_arr.sort(function (a, b) {
      return a - b
    })
    let width = x_arr[x_arr.length - 1] - x_arr[0]
    let height = y_arr[y_arr.length - 1] - y_arr[0]
    // 设置父级矩形容器的位置
    container.position.set(0, 0)
    // 创建矩形
    let rectangle = new me.mypixi.Graphics()
    rectangle.interactive = true
    // rectangle.buttonMode = true;
    rectangle.width = width
    rectangle.height = height
    rectangle.originalw = width
    rectangle.originalh = height
    rectangle.beginFill(0xe6e6fa, 0.1)
    rectangle.alpha = 0.01
    // rectangle.pivot.set(0.5,0.5);
    rectangle.drawRect(0, 0, width, height)
    rectangle.endFill()
    rectangle.name = name
    rectangle.association_name = name
    rectangle.lock = false
    // 正式组合的空白矩形
    rectangle.type = 'association_gap_notT'
    rectangle.rotation_num = 0
    rectangle.x = x_arr[0] - (me.window_w - me.canvas_width) / 2
    rectangle.y = y_arr[0] - (me.window_h - me.canvas_height) / 2
    rectangle.cursor = 'grab'
    // 矩形中心点
    rectangle.centerX = rectangle.x + rectangle.width / 2
    rectangle.centerY = rectangle.y + rectangle.height / 2
    me.ctrl_arr.push(rectangle) // 没有顺序之分
    // 监听事件
    rectangle
      .on('rightdown', me.onRightC)
      .on('mousedown', me.onAssociationStart)
      .on('mousemove', me.onDragMove)
      .on('mouseupoutside', me.onTemporaryEnd)
      .on('mouseup', me.onTemporaryEnd)
    container.addChild(rectangle)
    if (!render_create) {
      me.renderStage()
      // 添加组合边框给组合矩形加按钮,不渲染临时边框
      me.renderTLine(false, true, name)
      me.showEdit('association')
    }
  },
  renderTLine: function (t_r, a_r_btn, name, lock) {
    let me = this
    // 添加临时组合边框
    me.removeLine()
    for (let i = 0; i < me.ctrl_arr.length; i++) {
      if (a_r_btn && me.ctrl_arr[i].association_name == name) {
        if (lock) {
          me.containerLine(me.ctrl_arr[i], true, a_r_btn, '#D62B25', true)
        } else {
          me.containerLine(me.ctrl_arr[i], true, a_r_btn)
        }
      } else {
        me.containerLine(me.ctrl_arr[i], true)
      }
    }
    // 值为真则需要添加临时矩形边框
    if (t_r) {
      me.containerLine(me.temporary_rect, true)
    }
    me = null
  },
  upDownMove: function (index, up, max) {
    const me = this
    let arr1 = []
    let arr2 = []
    let arr3 = []
    let arr4 = []
    let upindex = null
    if (up) {
      upindex = index + 1
    } else {
      upindex = index - 1
    }
    // 找出本index是否是组合，还有前后的是否是组合
    let self_f_index = null
    let change_f_index = null
    if (me.container_arr[index].cont.children[0].association_name !== '') {
      let sa_name = me.container_arr[index].cont.children[0].association_name
      for (let i = 0; i < me.container_arr.length; i++) {
        if (sa_name == me.container_arr[i].cont.children[0].association_name) {
          arr2.push(me.container_arr[i])
          self_f_index = i
        }
      }
      if (up) {
        upindex = self_f_index + 1
        for (let i = 0; i < arr2[0].index; i++) {
          arr1.push(me.container_arr[i])
        }
      } else {
        upindex = arr2[0].index - 1
      }
    } else {
      arr2.push(me.container_arr[index])
      for (let i = 0; i < arr2[0].index; i++) {
        arr1.push(me.container_arr[i])
      }
      self_f_index = index
    }
    // 判断替换顺序的两个是否来自同一归属模块
    if (!me.container_arr[upindex]) return false
    if (
      me.container_arr[index].m_comp_name !==
      me.container_arr[upindex].m_comp_name
    ) { return false }
    if (me.container_arr[upindex]) {
      if (me.container_arr[upindex].cont.children[0].association_name !== '') {
        let a_name =
          me.container_arr[upindex].cont.children[0].association_name
        for (let i = 0; i < me.container_arr.length; i++) {
          if (a_name == me.container_arr[i].cont.children[0].association_name) {
            arr3.push(me.container_arr[i])
            change_f_index = i
          }
        }
      } else {
        arr3.push(me.container_arr[upindex])
        change_f_index = upindex
      }
    }
    if (up) {
      for (let i = change_f_index + 1; i < me.container_arr.length; i++) {
        arr4.push(me.container_arr[i])
      }
      if (max !== '' && max == 'maxUp') {
        me.container_arr = [...arr1, ...arr3, ...arr4, ...arr2]
      } else {
        me.container_arr = [...arr1, ...arr3, ...arr2, ...arr4]
      }
    } else {
      for (let i = self_f_index + 1; i < me.container_arr.length; i++) {
        arr4.push(me.container_arr[i])
      }
      let change_first_index = arr3[0].index
      arr1.length = 0
      for (let i = 0; i < change_first_index; i++) {
        arr1.push(me.container_arr[i])
      }
      if (max !== '' && max == 'maxDown') {
        me.container_arr = [...arr2, ...arr1, ...arr3, ...arr4]
      } else {
        me.container_arr = [...arr1, ...arr2, ...arr3, ...arr4]
      }
    }
    me.sortContainerArr(true)
    me.renderUpDown()
    me.updateLayer()
    me.$set(me.right_block, 'show', false)
    // 存储进活动日志
    me.pushActiveLog(true)
  },
  renderUpDown: function () {
    const me = this
    // 保留边框层，更新元素图层
    let cont = me.mainStage_container.children[me.mainStage_container.children.length - 1]
    me.mainStage_container.removeChildren()
    me.addCancleRect(me.mainStage_container)
    for (let i = 0; i < me.container_arr.length; i++) {
      // 按顺序渲染容器
      me.mainStage_container.addChild(me.container_arr[i].cont)
      me.container_arr[i].cont.buttonMode = false
    }
    me.mainStage_container.addChild(cont)
  },
  deleteSomeone: function (name, render, callback) {
    const me = this
    let index_c = me.findCont(name)
    if (index_c !== -1) {
      // 新增了取消面板所以index+1
      me.mainStage_container.removeChildAt(index_c + 1)
      me.container_arr.splice(index_c, 1)
      me.in_move = null
      me.sortContainerArr(true)
      if (render) {
        me.renderStage()
      }
      callback()
    }
  },
  onRightDelete: function () {
    const me = this
    if (me.ctrl_arr.length == 0 && me.in_move) {
      // 删除单个元素
      me.deleteSomeone(me.in_move.name, true, function () {
        // 删除回调,隐藏右键弹窗
        me.$set(me.right_block, 'show', false)
      })
    } else {
      me.clearTemAss(false)
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        me.deleteSomeone(me.ctrl_arr[i].name, false, function () { })
      }
      me.renderStage()
      me.$set(me.right_block, 'show', false)
    }
    // 更新图层tab
    me.updateLayer()
    // 存储进活动日志
    me.pushActiveLog(true)
    me.cancelInMove()
  },
  moveActiveLog: function (way) {
    const me = this
    setTimeout(() => {
      // me.p_app.stage.children[0].removeChildren()
      // for(let j=0;j<me.active_log[me.active_index-1].pixi.length;j++){
      //   let pixiData=_.cloneDeep(me.active_log[me.active_index-1].pixi[j])
      //   me.p_app.stage.children[0].addChild(pixiData)
      // }
      // me.p_app.renderer.render(me.p_app.stage);
      // //恢复vue数据
      // for(let key in me.active_log[me.active_index-1].vueData){
      //   me.$set(me, key, me.active_log[me.active_index-1].vueData[key])
      // }
      if (way == 'prev' && me.active_index > 0) {
        me.$set(me, 'render_data', me.active_log[me.active_index - 1])
        me.$set(me, 'active_index', me.active_index - 1)
        me.renderTemplate()
        if (me.active_index == 0) {
          // 回到初始状态则初始化日志
          let first = _.cloneDeep(me.active_log[0])
          me.active_log.length = 0
          me.active_log.push(first)
        }
      } else if (
        way == 'next' &&
        me.active_log.length - 1 !== me.active_index
      ) {
        me.$set(me, 'render_data', me.active_log[me.active_index + 1])
        me.$set(me, 'active_index', me.active_index + 1)
        me.renderTemplate()
      }
    }, 50)
  },
  renderARC: function (titleType, wordArr, textReplace) {
    const me = this
    let setData = null
    let imgSetData = null
    if (titleType == 'arc_title') {
      setData = _.cloneDeep(me.arc_obj.arc_title)
      // imgSetData = {
      //   position: {
      //     x: 375,
      //     y: 750
      //   },
      //   size: {
      //     width: 300,
      //     height: 100
      //   },
      //   arc: {
      //     arc_deg: 80,
      //     radius: 500,
      //     centerToTop: 50,
      //     direction: 'up'
      //   }
      // }
      // 弧形装饰参数size可以从数据中读到或者实例中读到
      imgSetData = {
        position: _.cloneDeep(me.arc_obj.arc_titleImg.position.x ? me.arc_obj.arc_titleImg.position : me.arc_obj.arc_titleImg.parent.position),
        size: {
          width: me.arc_obj.arc_titleImg.width ? me.arc_obj.arc_titleImg.width : me.arc_obj.arc_titleImg.size.width,
          height: me.arc_obj.arc_titleImg.height ? me.arc_obj.arc_titleImg.height : me.arc_obj.arc_titleImg.size.height
        },
        arc: _.cloneDeep(me.arc_obj.arc_titleImg.arc)
      }
    } else if (titleType == 'arc_subtitle') {
      setData = _.cloneDeep(me.arc_obj.arc_subtitle)
      imgSetData = {
        position: _.cloneDeep(me.arc_obj.arc_subtitleImg.position.x ? me.arc_obj.arc_subtitleImg.position : me.arc_obj.arc_subtitleImg.parent.position),
        size: {
          width: me.arc_obj.arc_subtitleImg.width ? me.arc_obj.arc_subtitleImg.width : me.arc_obj.arc_subtitleImg.size.width,
          height: me.arc_obj.arc_subtitleImg.height ? me.arc_obj.arc_subtitleImg.height : me.arc_obj.arc_subtitleImg.size.height
        },
        arc: _.cloneDeep(me.arc_obj.arc_subtitleImg.arc)
      }
    }
    for (let m = 1; m <= wordArr.length; m++) {
      let mtext = wordArr[m - 1] // 拆分的单个文字
      // 深拷贝arc_title改变其中ID、文字、位置、角度
      let newD = _.cloneDeep(setData)
      newD.id += `${m}`
      // 计算圆弧位置
      let eachDeg = parseInt(imgSetData.arc.arc_deg) / wordArr.length / 2 // 每个文字间隔的角度
      let [x0, y0] = [0, 0] // 圆心
      x0 = imgSetData.position.x
      let newDeg = 90 + parseInt(imgSetData.arc.arc_deg) / 2 // 文字起始角度,计算完位置后设置成单个字的旋转角度，已y轴为中心
      let [newx, newy] = [0, 0]
      if (imgSetData.arc.direction == 'down') {
        y0 =
          imgSetData.position.y -
          imgSetData.size.height / 2 +
          parseInt(imgSetData.arc.centerToTop) +
          parseInt(imgSetData.arc.radius)
        newx =
          x0 +
          parseInt(imgSetData.arc.radius) *
          Math.cos(((-eachDeg * (2 * m - 1) + newDeg) * Math.PI) / 180)
        newy =
          y0 -
          parseInt(imgSetData.arc.radius) *
          Math.sin(((-eachDeg * (2 * m - 1) + newDeg) * Math.PI) / 180)
        newDeg = ((90 - (newDeg - eachDeg * (2 * m - 1))) * Math.PI) / 180
      } else {
        newDeg = -newDeg
        y0 =
          imgSetData.position.y +
          imgSetData.size.height / 2 -
          parseInt(imgSetData.arc.centerToTop) -
          parseInt(imgSetData.arc.radius)
        newx =
          x0 +
          parseInt(imgSetData.arc.radius) *
          Math.cos(((eachDeg * (2 * m - 1) + newDeg) * Math.PI) / 180)
        newy =
          y0 -
          parseInt(imgSetData.arc.radius) *
          Math.sin(((eachDeg * (2 * m - 1) + newDeg) * Math.PI) / 180)
        newDeg = ((-90 - (newDeg + eachDeg * (2 * m - 1))) * Math.PI) / 180
      }
      // 设置新数据，渲染成新图层
      newD.position.x = newx
      newD.position.y = newy
      newD.text = mtext
      newD.rotation = newDeg
      newD.role = 'normal'
      newD.textReplace = textReplace
      me.newContainerText(newD, true, true)
    }
    me.renderStage()
  }
}
