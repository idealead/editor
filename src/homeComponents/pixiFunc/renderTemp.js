import axios from 'axios'
import * as PIXI from 'pixi.js'
import _ from 'lodash'

// 参数
// 参数
export default {
  // promise功能的变量保存
  resolve: null,
  reject: null,
  // promise功能的变量保存
  window_w: 2500,
  window_h: 2500,
  template_name: '',
  origin_preview_img: '',
  r_app: null,
  logoFileId: '',
  mainFileId: '',
  img_app: null,
  mainStage_container: null,
  container_arr: [],
  active_log: [],
  ctrl_arr: [],
  material_id: [],
  // 原始主图尺寸
  originMian_obj: {},
  token: '',
  tempId: 0,
  render_data: [],
  canvas_width: 0,
  canvas_height: 0,
  project_m_comp: [{
    name: 'text',
    chinese: '文案'
  }, {
    name: 'slogan',
    chinese: 'slogan'
  }, {
    name: 'product',
    chinese: '产品图'
  }, {
    name: 'logo',
    chinese: 'logo'
  }, {
    name: 'ornament',
    chinese: '装饰'
  }, {
    name: 'model',
    chinese: '模特'
  }, {
    name: 'code',
    chinese: '二维码'
  }, {
    name: 'other',
    chinese: '版权信息'
  }, {
    name: 'background',
    chinese: '背景'
  }],
  // 普通替换功能参数
  changeTitle: '',
  changeSubtitle: '',
  changeLogo: '',
  changeMain: '',
  // 普通替换功能参数
  expand: false, // 是否扩展
  o_w: 750,
  o_h: 1334,
  standard: '', // 依照宽度来适配
  // 扩展
  arc_title: null, // 弧形主标题文字
  arc_subtitle: null, // 弧形副标题文字
  arc_titleImg: null, // 弧形主标题文字装饰元素位置数据
  arc_subtitleImg: null, // 弧形主副标题文字装饰元素位置数据
  arc_titleMid: '', // 素材id，继续存储
  arc_titleMid_index: 0,
  arc_subtitleMid: '',
  arc_subtitleMid_index: 0,
  split: false,
  splitData: [],
  father_id: '', // 根模板id
  initData: function (data) {
    const me = this
    // 重置参数
    me.mainStage_container = null
    me.container_arr.length = 0
    me.active_log.length = 0
    me.ctrl_arr.length = 0
    me.template_name = ''
    me.render_data.length = 0
    me.origin_preview_img = ''
    me.changeTitle = ''
    me.changeSubtitle = ''
    me.changeLogo = ''
    me.changeMain = ''
    me.logoFileId = ''
    me.mainFileId = ''
    me.originMian_obj = {}
    me.arc_title = null
    me.arc_subtitle = null
    me.arc_titleImg = null
    me.arc_subtitleImg = null
    me.arc_titleMid = ''
    me.arc_subtitleMid = ''
    me.splitData = []
    if (data.tempId) me.tempId = data.tempId
    if (data.changeTitle) me.changeTitle = data.changeTitle
    if (data.changeSubtitle) me.changeSubtitle = data.changeSubtitle
    if (data.changeLogo) me.changeLogo = data.changeLogo
    if (data.changeMain) me.changeMain = data.changeMain
    if (data.logoFileId) me.logoFileId = data.logoFileId
    if (data.mainFileId) me.mainFileId = data.mainFileId
    if (data.token) me.token = data.token
    if (data.expand) { // 模板扩展尺寸功能
      // 设置比例基准
      me.expand = data.expand
      let o_ratio = me.o_h / me.o_w
      let new_ratio = data.height / data.width
      if (new_ratio >= o_ratio) {
        me.standard = 'width'
      } else {
        me.standard = 'height'
      }
    } else {
      me.expand = false
    }
    // 裂变功能
    if (data.split && data.splitData && data.splitData.length > 0) {
      me.split = data.split
      me.splitData = data.splitData
    }
    me.r_app = data.app
  },
  tempInit: function (data) {
    const me = this
    return new Promise(function (resolve, reject) {
      me.resolve = resolve
      me.reject = reject

      me.initData(data)
      me.tempId = parseInt(me.tempId)
      let condition = me.split ? 2 : 1 // 查询普通模板值为1，裂变专属模板值为2
      axios({
        method: 'post',
        url: `http://ht.idealead.hbindex.com/api/template/find_template_by_id/template_id/${me.tempId}.html`,
        data: {
          condition: condition
        },
        headers: { 'my_flag': '1' }
      }).then(function (response) {
        // let render_data = [];
        for (let i = 0; i < response.data.data.material_content.length; i++) {
          let material_content = JSON.parse(response.data.data.material_content[i].content)
          me.render_data.push(material_content)
          // 获取模板中的字体，进行加载
          // 弧形文字要记录index，保存成新模板时按原index插入
          if (material_content.children[0].ass_children[0].role == 'arc_title') {
            me.arc_titleMid = JSON.parse(response.data.data.material_content[i].id)
            me.arc_titleMid_index = i
          } else if (material_content.children[0].ass_children[0].role == 'arc_subtitle') {
            me.arc_subtitleMid = JSON.parse(response.data.data.material_content[i].id)
            me.arc_subtitleMid_index = i
          }
        }
        // 设置模板宽高，名字
        me.canvas_width = me.expand ? parseInt(data.width) : parseInt(response.data.data.template_width)
        me.canvas_height = me.expand ? parseInt(data.height) : parseInt(response.data.data.template_height)
        me.template_name = response.data.data.template_name
        me.origin_preview_img = response.data.data.preview_img
        // 执行方法
        me.initPixiApp()
      }).catch(function (error) {
        me.reject(error)
      })
    })
  },
  initPixiApp: function () {
    const me = this
    me.r_app.view.id = 'pixiCanvas'
    // 创建主内容容器，包含所有内容，固定尺寸，container_arr作为其子元素
    let mainStage = new PIXI.Container()
    mainStage.width = me.canvas_width
    mainStage.height = me.canvas_height
    mainStage.position.set((me.window_w - me.canvas_width) / 2, (me.window_h - me.canvas_height) / 2)
    mainStage.accessible = true
    me.mainStage_container = mainStage
    me.r_app.view.style.width = me.window_w + 'px'
    me.r_app.view.style.height = me.window_h + 'px'
    me.r_app.stage.addChild(me.mainStage_container)
    me.r_app.stage.width = me.window_w
    me.r_app.stage.height = me.window_h
    let rectangle = new PIXI.Graphics()
    rectangle.beginFill(0xE6E6FA, 0)
    rectangle.drawRect(0, 0, me.window_w, me.window_h)
    rectangle.endFill()
    rectangle.position.set(0, 0)
    me.r_app.stage.addChild(rectangle)

    // 执行方法
    me.renderTemplate()
  },
  renderTemplate: function () {
    const me = this
    let data = me.render_data
    me.r_app.stage.children[0].removeChildren()

    // 获取数据，先渲染图片和文字，再对相应的组合进行渲染
    // 收集模版中每个模块的首要组合的资源进入缓存
    let img_src = []
    let originMainImg = ''
    let font_family = {} // 文字字体集合
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
        if (data[i].children[0].ass_children[k].type == 'image' || data[i].children[0].ass_children[k].type == 'svg') {
          // 判断是否是有替换logo和主图
          let src_from = data[i].children[0].ass_children[k].src
          if (data[i].children[0].ass_children[k].role == 'logo' && me.changeLogo && me.changeLogo !== '') {
            src_from = me.changeLogo
            data[i].children[0].ass_children[k].file_id = me.logoFileId
            data[i].children[0].ass_children[k].src = me.changeLogo
          }
          if (data[i].children[0].ass_children[k].role == 'main' && me.changeMain && me.changeMain !== '') {
            originMainImg = src_from

            if (data[i].children[0].ass_children[k].size && data[i].children[0].ass_children[k].size.width && data[i].children[0].ass_children[k].size.height) {
              let originMian = {
                width: null,
                height: null
              }
              // size.width 应该为缩放后的大小，不一定是原大小
              originMian.width = data[i].children[0].ass_children[k].size.width
              originMian.height = data[i].children[0].ass_children[k].size.height
              me.originMian_obj[`${data[i].children[0].ass_children[k].id}`] = originMian
            }
            src_from = me.changeMain
            data[i].children[0].ass_children[k].file_id = me.mainFileId
            data[i].children[0].ass_children[k].src = me.changeMain
          }
          // 判断是否是有替换logo和主图↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
          // 判断是否是弧形标题的装饰，或者弧形副标题装饰,普通渲染保存数据，裂变时需要替换数据↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
          if (data[i].children[0].ass_children[k].role == 'arc_titleImg' || data[i].children[0].ass_children[k].role == 'arc_subtitleImg') {
            if (me.splitData && (data[i].children[0].ass_children[k].replacePosition || data[i].children[0].ass_children[k].replacePosition == 0) && me.split) {
              // 裂变的，需要替换数据
              let thisItem = data[i].children[0].ass_children[k];
              [thisItem.file_id, thisItem.src, thisItem.size, thisItem.arc] = me.replaceVolution(thisItem, 'arc')
              src_from = data[i].children[0].ass_children[k].src
            }
            if (data[i].children[0].ass_children[k].role == 'arc_titleImg') {
              // 弧形数据要根据file_id查询，然后插入
              me.arc_titleImg = data[i].children[0].ass_children[k]
            } else if (data[i].children[0].ass_children[k].role == 'arc_subtitleImg') {
              me.arc_subtitleImg = data[i].children[0].ass_children[k]
            }
          }
          // 判断是否是弧形标题的装饰，或者弧形副标题装饰↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
          // 裂变数据替换，除去弧形标题，弧形副标题图片↓↓↓↓↓↓↓↓↓↓↓↓↓
          if ((data[i].children[0].ass_children[k].replacePosition || data[i].children[0].ass_children[k].replacePosition == 0) && me.split && data[i].children[0].ass_children[k].role != 'arc_titleImg' && data[i].children[0].ass_children[k].role != 'arc_subtitleImg') {
            [data[i].children[0].ass_children[k].file_id, data[i].children[0].ass_children[k].src] = me.replaceVolution(data[i].children[0].ass_children[k], 'normal')
            src_from = data[i].children[0].ass_children[k].src
          }
          if (!me.r_app.loader.resources[src_from]) {
            img_src.push(src_from)
          }
        }
        // 获取模板中的字体，进行加载
        if (data[i].children[0].ass_children[k].type == 'text') {
          let thistext_obj = data[i].children[0].ass_children[k]
          if (thistext_obj.style.fontFamily == 'st') {
            continue
          }
          font_family[`${thistext_obj.style.fontFamily}`] =
            (font_family[`${thistext_obj.style.fontFamily}`] ? font_family[`${thistext_obj.style.fontFamily}`] : '') +
            thistext_obj.text
        }
      }
    }
    if (Object.keys(font_family).length === 0) {
      img_src = Array.from(new Set(img_src))
      me.originImg(originMainImg, function () {
        me.r_app.loader.add(img_src, {
          crossOrigin: true
        }).load(function () {
          me.renderF(data)
        })
      })
      return false
    }
    // 字体加载
    me.getAllfontFamily(font_family)
      .then(function (res) {
        // 加载css文件，从而自动加载woff文件
        for (let i = 0; i < res.length; i++) {
          if (res[i].data.code !== 1) continue
          axios
            .all(me.getCssWoff(res[i].data.path, res[i].data.woffPath))
            .then(function (response) {
              // 下方的linkcss，以及字体的加载读缓存就好了。
              me.dynamicLoadCss('http://font.idealead.hbindex.com' + res[i].data.path)
              if (i + 1 >= res.length) {
                setTimeout(() => {
                  // 字体加载完毕回调
                  img_src = Array.from(new Set(img_src))
                  me.originImg(originMainImg, function () {
                    me.r_app.loader.add(img_src, {
                      crossOrigin: true
                    }).load(function () {
                      me.renderF(data)
                    })
                  })
                }, 20)
              }
            })
            .catch(err => {
              me.reject(err)
            })
        }
      })
      .catch(function (err) {
        me.reject(err)
      })
  },
  getCssWoff: function (cssPath, woffPath) {
    // const me = this
    return [
      axios({
        method: 'get',
        url: `http://font.idealead.hbindex.com${cssPath}?my_flag=1`,
        responseType: 'ms-stream'
      }),
      axios({
        method: 'get',
        url: `http://font.idealead.hbindex.com${woffPath}?my_flag=1`,
        responseType: 'ms-stream'
      })
    ]
  },
  dynamicLoadCss: function (url) {
    var head = document.getElementsByTagName('head')[0]
    var link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    head.appendChild(link)
  },
  fontPost: function (data) {
    // const me = this
    // id为1则表示，是用户端，模板列表渲染使用的字体剪切
    let postD = {
      id: 1,
      font_name: data.font_name,
      text: data.text,
      my_flag: 1
    }
    // 压缩字体接口函数
    return axios({
      method: 'post',
      url: 'http://papi.idealead.hbindex.com/cutFont',
      data: postD,
      headers: { 'my_flag': '1' }
    })
  },
  getAllfontFamily: function (font_family) {
    const me = this
    let allArr = []
    for (let key in font_family) {
      allArr.push(
        me.fontPost({
          font_name: `${key}`,
          text: font_family[key]
        })
      )
    }
    return axios.all(allArr)
  },
  renderF: function (data) {
    const me = this
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i].children[0].ass_children.length; k++) {
        let element_data = data[i].children[0].ass_children[k]
        element_data.association_id = data[i].children[0].association_id
        if (data[i].children[0].ass_children[k].type == 'image' || data[i].children[0].ass_children[k].type == 'svg') {
          // 增加图片父级，添加图片并设置图片
          me.newContainer(element_data, true)
        } else if (data[i].children[0].ass_children[k].type == 'text') {
          if (element_data.role == 'title' && me.changeTitle !== '') {
            element_data.text = me.changeTitle
          }
          if (element_data.role == 'subtitle' && me.changeSubtitle !== '') element_data.text = me.changeSubtitle
          if (element_data.role == 'arc_title') {
            me.arc_title = _.cloneDeep(element_data)
            if (me.changeTitle) me.arc_title.text = me.changeTitle
          } else if (element_data.role == 'arc_subtitle') {
            me.arc_subtitle = _.cloneDeep(element_data)
            if (me.changeSubtitle) me.arc_subtitle.text = me.changeSubtitle
          } else {
            // 弧形文字直接利用之前的素材id
            me.newContainerText(element_data, true)
          }
        }
      }
    }
    // 判断有没有弧形文字，渲染弧形文字,弧形单个文字只用于预览图，简单渲染******************************************************************************************************************************
    if (me.arc_title && me.arc_titleImg) {
      let wordArr = me.arc_title.text.split('')
      me.renderARC('arc_title', wordArr)
    }
    if (me.arc_subtitle && me.arc_subtitleImg) {
      let wordArr = me.arc_subtitle.text.split('')
      me.renderARC('arc_subtitle', wordArr)
    }
    // 判断有没有弧形文字，渲染弧形文字********************************************************************************************************************************
    me.renderStage()
    // 渲染组合矩形
    let ass_arr_obj = {}
    for (let j = 0; j < me.container_arr.length; j++) {
      if (me.container_arr[j].cont.children[0].association_name !== '') {
        let ass_id = me.container_arr[j].cont.children[0].association_name
        if (ass_arr_obj[ass_id]) { } else {
          ass_arr_obj[ass_id] = []
        }
        ass_arr_obj[ass_id].push(me.container_arr[j].cont.children[0])
      }
    }
    let keys_arr = Object.keys(ass_arr_obj)
    for (let l = 0; l < keys_arr.length; l++) {
      let key = keys_arr[l]
      me.ctrl_arr = ass_arr_obj[key]
      me.createAssociation(key, ass_arr_obj[key][0].m_comp_name, true)
    }
    // 渲染
    me.renderStage()
    if (me.ctrl_arr) me.ctrl_arr.length = 0
    // 存储进活动日志
    me.pushActiveLog(true)
    setTimeout(() => {
      me.saveMould(me.template_name)
    }, 20)
  },
  replaceVolution: function (itemObj, type) {
    const me = this
    let replaceData = me.splitData.filter(function (item, index, arr) {
      if (item.position == itemObj.replacePosition) return item
    })
    if (type == 'arc') {
      return [replaceData[0].file_id, replaceData[0].src, replaceData[0].size, replaceData[0].arc]
    } else {
      return [replaceData[0].file_id, replaceData[0].src]
    }
  },
  renderARC: function (titleType, wordArr) {
    const me = this
    let setData = null
    let imgSetData = null
    if (titleType == 'arc_title') {
      setData = _.cloneDeep(me.arc_title)
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
      imgSetData = {
        position: _.cloneDeep(me.arc_titleImg.position),
        size: {
          width: me.arc_titleImg.size.width,
          height: me.arc_titleImg.size.height
        },
        arc: _.cloneDeep(me.arc_titleImg.arc)
      }
    } else if (titleType == 'arc_subtitle') {
      setData = _.cloneDeep(me.arc_subtitle)
      imgSetData = {
        position: _.cloneDeep(me.arc_subtitleImg.position),
        size: {
          width: me.arc_subtitleImg.size.width,
          height: me.arc_subtitleImg.size.height
        },
        arc: _.cloneDeep(me.arc_subtitleImg.arc)
      }
    }
    for (let m = 1; m <= wordArr.length; m++) {
      let mtext = wordArr[m - 1] // 拆分的单个文字
      // 深拷贝arc_title改变其中ID、文字、位置、角度
      let newD = _.cloneDeep(setData)
      newD.id += `${m}`
      // 计算圆弧位置
      let eachDeg = parseInt(imgSetData.arc.arc_deg) / wordArr.length / 2 // 每个文字间隔的角度
      let x0; let y0 = 0 // 圆心
      x0 = imgSetData.position.x
      let newDeg = 90 + (parseInt(imgSetData.arc.arc_deg) / 2) // 文字起始角度,计算完位置后设置成单个字的旋转角度，已y轴为中心
      let newx; let newy = 0
      if (imgSetData.arc.direction == 'down') {
        y0 = imgSetData.position.y - (imgSetData.size.height / 2) + parseInt(imgSetData.arc.centerToTop) + parseInt(imgSetData.arc.radius)
        newx = x0 + (parseInt(imgSetData.arc.radius) * Math.cos((-eachDeg * (2 * m - 1) + newDeg) * Math.PI / 180))
        newy = y0 - (parseInt(imgSetData.arc.radius) * Math.sin((-eachDeg * (2 * m - 1) + newDeg) * Math.PI / 180))
        newDeg = (90 - (newDeg - eachDeg * (2 * m - 1))) * Math.PI / 180
      } else {
        newDeg = -newDeg
        y0 = imgSetData.position.y + (imgSetData.size.height / 2) - parseInt(imgSetData.arc.centerToTop) - parseInt(imgSetData.arc.radius)
        newx = x0 + (parseInt(imgSetData.arc.radius) * Math.cos((eachDeg * (2 * m - 1) + newDeg) * Math.PI / 180))
        newy = y0 - (parseInt(imgSetData.arc.radius) * Math.sin((eachDeg * (2 * m - 1) + newDeg) * Math.PI / 180))
        newDeg = (-90 - (newDeg + eachDeg * (2 * m - 1))) * Math.PI / 180
      }
      // 设置新数据，渲染成新图层
      newD.position.x = newx
      newD.position.y = newy
      newD.text = mtext
      newD.rotation = newDeg
      newD.role = 'normal'
      me.newContainerText(newD, true, true)// 渲染后的弧形文字不保存进入日志，所以不会留下数据
    }
  },
  originImg: function (src, callback) {
    const me = this
    if (src == '') {
      callback()
    } else {
      let leng = Object.keys(me.originMian_obj)
      leng = leng.length
      if (leng > 0) {
        callback()
      } else {
        me.r_app.loader.add(src, {
          crossOrigin: true
        }).load(function () {
          if (/.svg$/.test(src)) {
            // me.loadSvgImg(src, sprite, my_set_data, render_add)
          } else {
            let sprite = new PIXI.Sprite(me.r_app.loader.resources[src].texture)
            me.originMian_obj.normal = {
              width: 0,
              height: 0
            }
            me.originMian_obj.normal.width = sprite.width
            me.originMian_obj.normal.height = sprite.height
            callback()
          }
        })
      }
    }
  },
  newContainer: function (set_data, render_add) {
    // 增加新图层新元素
    const me = this
    set_data.type = 'image'
    // set_data.file_id = set_data.file_id
    set_data.id = `${set_data.id}`
    me.addContainer(set_data, set_data.position)
    me.loadSprite(set_data, render_add)
  },
  newContainerText: function (set_data, render_add, saveLog = true) {
    // savelog为false，简单渲染只为生成模板预览图，不参与加入素材保存模板
    const me = this
    set_data.type = 'text'
    set_data.id = `${set_data.id}`
    me.addContainer(set_data, set_data.position, saveLog)
    me.addText(set_data, render_add, saveLog)
  },
  addContainer: function (set_data, position, saveLog = true) {
    // savelog为false，简单渲染只为生成模板预览图，不参与加入素材保存模板
    const me = this
    let container = new PIXI.Container()
    container.width = me.canvas_width
    container.height = me.canvas_height

    container.position.set(position.x, position.y)
    container.type = `${set_data.type}_c`
    container.rotation_num = 0
    // 按素材模块分类加入，找到此模块中元素的最高层级，在其后面加入
    me.containerArrAdd(set_data.m_comp_name, container, set_data.id, saveLog)
  },
  containerArrAdd: function (m_comp_name, container, id, saveLog) {
    const me = this
    if (saveLog) {
      let final_index = me.findFinalIndex(m_comp_name)
      // 相同模块中最后一个元素的index
      let arr1 = []
      let arr2 = [{
        cont: container,
        index: 0,
        name: id,
        m_comp_name: m_comp_name
      }]
      let arr3 = []
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
    } else {
      // 简单渲染
      me.container_arr.push({
        cont: container,
        index: 0,
        name: id,
        m_comp_name: m_comp_name
      })
    }
  },
  findFinalIndex: function (m_comp_name) {
    const me = this
    let final_index = -100 // 相同模块中最后一个元素的index
    let len = me.project_m_comp.length - 1
    if (me.container_arr.length == 0) {
      final_index = 0
      return final_index
    } else if (me.project_m_comp[0].name == m_comp_name && me.container_arr.length > 0) {
      final_index = me.container_arr.length - 1
      return final_index
    } else {
      me.container_arr.map(function (value, index, array) {
        if (value.m_comp_name == m_comp_name) {
          final_index = index
        }
      })
      if (final_index == -100) {
        if (me.project_m_comp[len].name == m_comp_name) {
          final_index = -1
          return final_index
        } else {
          for (let i = 0; i < me.project_m_comp.length; i++) {
            if (me.project_m_comp[i].name == m_comp_name) {
              return me.findFinalIndex(me.project_m_comp[i + 1].name)
            }
          }
        }
      } else {
        return final_index
      }
    }
  },
  sortContainerArr: function (clear_rotation) {
    const me = this
    // 将数组容器里的index排序
    me.container_arr.map(function (value, index, array) {
      value.index = index
      if (clear_rotation && (value.cont.type == 'image_c' || value.cont.type == 'text_c')) {
        value.cont.rotation_num = 0
      }
    })
  },
  loadSprite: function (set_data, render_add) {
    // 加载精灵
    const me = this
    let my_set_data = _.cloneDeep(set_data)
    let src = my_set_data.src
    let sprite
    if (me.r_app.loader.resources[src]) {
      if (/.svg$/.test(src)) {
        // me.loadSvgImg(src, sprite, my_set_data, render_add)
      } else {
        // 缓存过src的就直接新增
        sprite = new PIXI.Sprite(me.r_app.loader.resources[src].texture)
        me.addImg(sprite, my_set_data, render_add)
      }
    }
    // else {
    //   me.p_app.loader.add(src, {
    //     crossOrigin: true
    //   }).load(function() {
    //     if (/.svg$/.test(src)) {
    //       // me.loadSvgImg(src, sprite, my_set_data, render_add)
    //     } else {
    //       sprite = new PIXI.Sprite(me.p_app.loader.resources[src].texture);
    //       me.addImg(sprite, my_set_data, render_add);
    //       me.img_loading = false;
    //       func();
    //     }
    //   });
    // }
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
    sprite.originalw = _.cloneDeep(sprite.width)
    sprite.originalh = _.cloneDeep(sprite.height)
    sprite.position.set(0, 0)
    sprite.association_name = '' // 组合名字，为空说明没有组合
    sprite.m_comp_name = set_data.m_comp_name
    sprite.lock = false
    sprite.role = 'normal'
    if (render_add) {
      sprite.rotation = set_data.rotation
      sprite.rotation_num = set_data.rotation
      sprite.alpha = set_data.alpha
      sprite.scale.set(set_data.scale)
      sprite.association_name = set_data.association_id
      sprite.role = set_data.role
    }
    // 替换
    if (sprite.role == 'logo' && me.changeLogo) {
      if (sprite.width >= sprite.height) {
        if (sprite.width > 300) sprite.scale.set(300 / sprite.width)
      } else {
        if (sprite.height > 300) sprite.scale.set(300 / sprite.height)
      }
    } else if (sprite.role == 'main' && me.originMian_obj[`${set_data.id}`]) {
      let o_ratio = me.originMian_obj[`${set_data.id}`].width / me.originMian_obj[`${set_data.id}`].height
      let n_ratio = sprite.originalw / sprite.originalh
      if (n_ratio >= o_ratio) {
        sprite.scale.set((me.originMian_obj[`${set_data.id}`].width / sprite.originalw) + 1)
      } else {
        sprite.scale.set(me.originMian_obj[`${set_data.id}`].height / sprite.originalh)
      }
    } else if (sprite.role == 'main' && me.originMian_obj.normal) {
      let o_ratio = me.originMian_obj.normal.width / me.originMian_obj.normal.height
      let n_ratio = sprite.originalw / sprite.originalh
      if (n_ratio >= o_ratio) {
        sprite.scale.set(me.originMian_obj.normal.width / sprite.originalw)
      } else {
        sprite.scale.set(me.originMian_obj.normal.height / sprite.originalh)
      }
    }
    // 替换
    // 扩展骨架A竖版：******************************************************************************************************************************//
    // 大小
    if (me.expand) {
      if ((me.standard == 'width' && sprite.role != 'bg') || (me.standard == 'height' && sprite.role == 'bg')) {
        let new_scale = set_data.scale * me.canvas_width / me.o_w
        sprite.scale.set(new_scale)
      } else if ((me.standard == 'height' && sprite.role != 'bg') || (me.standard == 'width' && sprite.role == 'bg')) {
        let new_scale = set_data.scale * me.canvas_height / me.o_h
        sprite.scale.set(new_scale)
      }
      // 位置
      me.container_arr[me.findCont(set_data.id)].cont.position.set((set_data.position.x / me.o_w) * me.canvas_width, (set_data.position.y / me.o_h) * me.canvas_height)
      // 扩展骨架A竖版：******************************************************************************************************************************//
    } else {
      me.container_arr[me.findCont(set_data.id)].cont.addChild(sprite)
    }

    // if (!render_add) {
    //   me.renderStage()
    //   //在图层面板增加图层
    //   //激活当前选中状态
    //   me.in_move = sprite
    //   me.containerLine(me.in_move, false);
    //   me.showEdit(me.in_move.type)
    //   //图层面板监听
    // }
  },
  addText: function (set_data, render_add, saveLog) {
    const me = this
    let richText = null
    // let style = {
    //   fontFamily: '思源黑体',
    //   fontSize: 50,
    //   lineHeight: 60,
    //   fontStyle: 'normal',
    //   fontWeight: 'normal',
    //   fill: '#000',
    //   stroke: '#000',
    //   strokeThickness: 0,
    //   dropShadow: false,
    //   dropShadowColor: '#000000',
    //   dropShadowAngle: Math.PI / 6,
    //   dropShadowBlur: 0,
    //   dropShadowDistance: 18,
    //   wordWrap: true,
    //   wordWrapWidth: 400,
    //   breakWords: true,
    //   padding: 0,
    //   textBaseline: 'Middle',
    //   trim: false,
    //   whiteSpace: 'pre'
    // }
    // 扩展骨架A竖版：******************************************************************************************************************************//
    if (me.expand) {
      let saveSize = false
      if (me.standard == 'width') {
        // 大小
        if ((set_data.size.width / me.o_w) + 0.1 >= (set_data.size.width / me.canvas_width) && (set_data.size.width / me.canvas_width) < 1) {
          saveSize = true
        } else {
          let rs = set_data.style.fontSize / me.o_w
          let rl = set_data.style.lineHeight / me.o_w
          set_data.style.fontSize = me.canvas_width * rs
          set_data.style.lineHeight = me.canvas_width * rl
        }
      } else {
        if ((set_data.size.height / me.o_h) + 0.1 >= (set_data.size.height / me.canvas_height) && (set_data.size.height / me.canvas_height) < 1) {
          saveSize = true
        } else {
          let rs = set_data.style.fontSize / me.o_h
          let rl = set_data.style.lineHeight / me.o_h
          set_data.style.fontSize = me.canvas_width * rs
          set_data.style.lineHeight = me.canvas_width * rl
        }
      }
      richText = new PIXI.Text(`${set_data.text}`, set_data.style)
      if (set_data.role == 'title' || set_data.role == 'subtitle') {
        // 位置
        let posi = { x: 0, y: 0 }
        let left = 0
        let top = 0
        if (me.standard == 'width') {
          left = 50 / me.o_w
          top = me.canvas_width * left * 3 / 2
          left = me.canvas_width * left
        } else {
          top = 75 / me.o_h
          left = me.canvas_height * top / 3 * 2
          top = me.canvas_height * top
        }
        posi.x = left + (richText.width / 2)
        posi.y = top + (richText.height / 2)
        if (set_data.role == 'subtitle') {
          posi.y += saveSize ? 75 : (75 / me.o_h) * me.canvas_height
        }
        me.container_arr[me.findCont(set_data.id)].cont.position.set(posi.x, posi.y)
      } else {
        me.container_arr[me.findCont(set_data.id)].cont.position.set((set_data.position.x / me.o_w) * me.canvas_width, (set_data.position.y / me.o_h) * me.canvas_height)
      }
    } else {
      richText = new PIXI.Text(`${set_data.text}`, set_data.style)
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
    richText.lineHeightM = 10
    richText.association_name = '' // 组合名字，为空说明没有组合
    richText.m_comp_name = set_data.m_comp_name
    richText.lock = false
    richText.role = 'normal'
    if (render_add) {
      richText.rotation = set_data.rotation
      richText.rotation_num = set_data.rotation
      richText.alpha = set_data.alpha
      richText.association_name = set_data.association_id
      richText.ofonts = set_data.style.fontSize
      richText.role = set_data.role
    }
    if (!saveLog) richText.type = 'notSave'
    me.container_arr[me.findCont(set_data.id)].cont.addChild(richText)
    if (set_data.text_num) {
      richText.text_num = set_data.text_num
    } else {
      richText.text_num = richText.width / richText.style.fontSize
    }
    //* ********
  },
  findCont: function (containerName) {
    // 组合矩形父容器name为组合id，临时组合矩形父容器name为temporary_c，其他父容器name为id
    const me = this
    let index = -1
    for (let i = 0; i < me.container_arr.length; i++) {
      if (me.container_arr[i].name == containerName) {
        index = i
      }
    }
    return index
  },
  renderStage: function () {
    const me = this
    me.r_app.stage.children[0].removeChildren()
    //

    for (let i = 0; i < me.container_arr.length; i++) {
      // 按顺序渲染容器
      me.mainStage_container.addChild(me.container_arr[i].cont)
      me.container_arr[i].cont.buttonMode = false
    }
    //
    me.r_app.renderer.render(me.r_app.stage)
  },
  createAssociation: function (name, m_comp_name, render_create) {
    const me = this
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
    let container = new PIXI.Container()
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
    let rectangle = new PIXI.Graphics()
    rectangle.interactive = true
    // rectangle.buttonMode = true;
    rectangle.width = width
    rectangle.height = height
    rectangle.originalw = width
    rectangle.originalh = height
    rectangle.beginFill(0xE6E6FA, 0.1)
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
    container.addChild(rectangle)
  },
  addACtrlarr: function (a_name) {
    const me = this
    for (let i = 0; i < me.container_arr.length; i++) {
      if (me.container_arr[i].cont.children[0].association_name == a_name) {
        me.ctrl_arr.push(me.container_arr[i].cont.children[0])
      }
    }
  },
  pushActiveLog: function (permit) {
    /// 操作和数据存入日志
    const me = this
    // 存储当前画布内容以及是否有in_move或者组合激活
    let ass_id = ''
    let layer_data_example = {
      m_comp_name: 'product',
      children: [{
        ass_children: [],
        association_id: ''
      }]
    }
    let obj_data_example = {
      src: '',
      type: '',
      id: '',
      m_comp_name: 'product',
      rotation: 0,
      scale: 1,
      position: {
        x: 0,
        y: 0
      },
      text: '',
      style: {},
      alpha: 1,
      size: {}
    }
    let log_data = []
    let data = {}
    for (let i = 0; i < me.container_arr.length; i++) {
      // 不把渲染好的弧形文字数据存储进日志，不存入模板数据
      if (me.container_arr[i].cont.children[0].type !== 'temporary_rect' && me.container_arr[i].cont.children[0].type !== 'association_gap_notT') {
        if (me.container_arr[i].cont.children[0].type == 'notSave' && i != me.container_arr.length - 1) {
          continue
        } else if (me.container_arr[i].cont.children[0].type == 'notSave' && i == me.container_arr.length - 1) {
        } else {
          let obj = me.container_arr[i].cont.children[0]
          let element_data = _.cloneDeep(obj_data_example)
          if (obj.association_name == '' || (obj.association_name !== '' && obj.association_name !== ass_id)) {
            if (data.children && data.children[0].ass_children.length >= 1) {
              log_data.push(data)
            }
            data = _.cloneDeep(layer_data_example)
          }
          if (obj.association_name !== '') {
            data.children[0].association_id = obj.association_name
            ass_id = obj.association_name
          }
          if (obj.type == 'image') {
            element_data.src = obj.srcData
            element_data.type = 'image'
            element_data.file_id = obj.file_id
            element_data.size.width = obj.width
            element_data.size.height = obj.height
          } else if (obj.type == 'text') {
            element_data.type = 'text'
            let style = {
              fontFamily: 'st',
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
              dropShadowBlur: 0,
              dropShadowDistance: 18,
              wordWrap: true,
              wordWrapWidth: 300,
              breakWords: true,
              padding: 50,
              textBaseline: 'Middle',
              trim: false,
              whiteSpace: 'normal',
              leading: 0,
              letterSpacing: 0
            }
            for (let key in style) {
              style[key] = obj.style[key]
            }
            element_data.style = style
            element_data.style.fontSize = Math.floor(element_data.style.fontSize)
            element_data.text = obj.text
            element_data.size.width = obj.width
            element_data.size.height = obj.height
          }
          element_data.id = obj.name
          element_data.rotation = obj.rotation
          element_data.scale = obj.scale.x
          element_data.position.x = obj.parent.x
          element_data.position.y = obj.parent.y
          element_data.alpha = obj.alpha
          element_data.role = obj.role
          data.children[0].ass_children.push(element_data)
        }
        if (i == me.container_arr.length - 1) {
          log_data.push(data)
        }
      }
    }
    if (me.active_log.length >= 30) {
      me.active_log.splice(0, 1)
    }
    me.active_log.push(log_data)
  },
  saveMould: function (mould_name) {
    const me = this
    // 保存模板，第一步保存个个元素或组合为素材（图片组合需要生成预览图），第二步将所有素材id上传保存成新模板
    let last = _.cloneDeep(me.active_log[me.active_log.length - 1])
    me.getMaterialData(last).then(function (res) {
      let material_data = res
      me.uploadMaterial(mould_name, material_data)
    }).catch((res) => {
      me.reject(res)
    })
    // for (let i = 0; i < last.length; i++) {
    //   (function(i) {
    //     let material_children = {};
    //     if (last[i].children[0].ass_children.length == 1) {
    //       //单个图片或者文字
    //       if (last[i].children[0].ass_children[0].type == 'image') {
    //         material_children.material_type = 'img';
    //         material_children.file_id = JSON.stringify([parseInt(last[i].children[0].ass_children[0].file_id)]);
    //         material_children.author = '1';
    //         material_children.preview = parseInt(last[i].children[0].ass_children[0].file_id);
    //         material_children.content = JSON.stringify(last[i])
    //       } else if (last[i].children[0].ass_children[0].type == 'text') {
    //         material_children['material_type'] = 'text';
    //         material_children['author'] = '1';
    //         material_children['dimension_id'] = 0
    //         material_children['content'] = JSON.stringify(last[i]);
    //         material_children['text_content'] = last[i].children[0].ass_children[0].text;
    //       }
    //       material_data.push(material_children)
    //     } else if (last[i].children[0].ass_children.length > 1) {
    //       let file_id = [];
    //       for (let k = 0; k < last[i].children[0].ass_children.length; k++) {
    //         if (last[i].children[0].ass_children[k].type == 'image') {
    //           file_id.push(last[i].children[0].ass_children[k].file_id)
    //         }
    //       }
    //       material_children.material_type = 'whole';
    //       material_children.file_id = JSON.stringify(file_id);
    //       material_children.author = '1';
    //       //idToimg,上传组合预览图
    //       tempF.addACtrlarr.bind(me)(file_id[0]);
    //       let file = tempF.toImage.bind(me)(tempF, true)
    //       let formdata = new FormData();
    //       formdata.append('upload_file_once', file)
    //       axios({
    //         method: 'post',
    //         url: 'http://dev.cyrd.gdinsight.com/api/files/upload_file_once/author_id/1.html',
    //         data: formdata
    //       }).then(function(response) {
    //         material_children.preview = response.data.data.file_id
    //         material_children.content = JSON.stringify(last[i]);
    //         material_data.push(material_children)
    //         if (material_data.length == last.length && !uploadM) {
    //           //上传素材
    //           uploadM = true;
    //           tempF.uploadMaterial.bind(me)(tempF, mould_name, material_data, callback)
    //         }
    //       }).catch(function(error) {
    //         console.log(error);
    //       });
    //     }
    //     if (i == last.length - 1 && material_data.length == last.length && !uploadM) {
    //       //上传素材
    //       uploadM = true;
    //       tempF.uploadMaterial.bind(me)(tempF, mould_name, material_data, callback)
    //     }
    //   })(i)
    // }
  },
  getMaterialData: function (last) {
    const me = this
    let allArr = []
    for (let i = 0; i < last.length; i++) {
      allArr.push(me.getMd(last[i]))
    }
    return Promise.all(allArr)
  },
  getMd: function (last) {
    const me = this
    return new Promise(function (resolve, reject) {
      let material_children = {}
      if (last.children[0].ass_children.length == 1) {
        // 单个图片或者文字
        if (last.children[0].ass_children[0].type == 'image') {
          material_children.material_type = 'img'
          material_children.file_id = JSON.stringify([parseInt(last.children[0].ass_children[0].file_id)])
          material_children.author = '1'
          material_children.preview = parseInt(last.children[0].ass_children[0].file_id)
          material_children.content = JSON.stringify(last)
        } else if (last.children[0].ass_children[0].type == 'text') {
          material_children['material_type'] = 'text'
          material_children['author'] = '1'
          material_children['dimension_id'] = 0
          material_children['content'] = JSON.stringify(last)
          material_children['text_content'] = last.children[0].ass_children[0].text
        }
        resolve(material_children)
      } else if (last.children[0].ass_children.length > 1) {
        let file_id = []
        for (let k = 0; k < last.children[0].ass_children.length; k++) {
          if (last.children[0].ass_children[k].type == 'image') {
            file_id.push(last.children[0].ass_children[k].file_id)
          }
        }
        material_children.material_type = 'whole'
        material_children.file_id = JSON.stringify(file_id)
        material_children.author = '1'
        // idToimg,上传组合预览图
        me.addACtrlarr.bind(me)(file_id[0])
        let file = me.toImage(true)
        let formdata = new FormData()
        formdata.append('upload_file_once', file)
        axios({
          method: 'post',
          url: 'http://ht.idealead.hbindex.com/api/files/upload_file_once/author_id/1.html',
          data: formdata,
          headers: { 'my_flag': '1' }
        }).then(function (response) {
          material_children.preview = response.data.data.file_id
          material_children.content = JSON.stringify(last)
          resolve(material_children)
        }).catch(function (error) {
          console.log(error)
          me.reject(error)
        })
      }
    })
  },
  toImage: function (returnFile) {
    // 组合或者单个元素导成图片
    const me = this
    let width; let height; let centerX; let centerY = 0
    let img_arr = []
    if (me.ctrl_arr.length > 0) {
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        if (me.ctrl_arr[i].type == 'association_gap_notT') {
          width = me.ctrl_arr[i].width
          height = me.ctrl_arr[i].height
          centerX = me.ctrl_arr[i].centerX
          centerY = me.ctrl_arr[i].centerY
        }
      }
      for (let i = 0; i < me.ctrl_arr.length; i++) {
        let data = {}
        if (me.ctrl_arr[i].type !== 'association_gap_notT' && me.ctrl_arr[i].type !== 'text') {
          data = {
            src: me.ctrl_arr[i].srcData,
            x: (width / 2) - (centerX - me.ctrl_arr[i].parent.x),
            y: (height / 2) - (centerY - me.ctrl_arr[i].parent.y),
            scale: me.ctrl_arr[i].scale.x,
            rotation: me.ctrl_arr[i].parent.rotation,
            type: me.ctrl_arr[i].type,
            alpha: me.ctrl_arr[i].alpha
          }
          img_arr.push(data)
        } else if (me.ctrl_arr[i].type == 'text') {
          data = _.cloneDeep(me.ctrl_arr[i])
          data.position.set((width / 2) - (centerX - me.ctrl_arr[i].parent.position.x), (height / 2) - (centerY - me.ctrl_arr[i].parent.position.y))
          img_arr.push(data)
        }
      }
    }
    me.img_app = null
    me.img_app = new PIXI.Application({
      backgroundColor: 0xff0000,
      width: width,
      height: height,
      antialias: 1
    })
    let cont = new PIXI.Container()
    cont.width = width
    cont.height = height
    cont.position.set(0, 0)
    cont = me.addImgTwo(cont, img_arr)
    me.img_app.stage.addChild(cont)
    let img = me.img_app.renderer.plugins.extract.base64(me.img_app.stage)
    if (!returnFile) {

    } else {
      // 图片转文件，上传文件，拿回文件id
      return me.dataURLtoFile(img, 'association_img.png')
    }
  },
  addImgTwo: function (cont, img_arr) {
    const me = this
    img_arr = img_arr.reverse()
    for (let i = 0; i < img_arr.length; i++) {
      if (img_arr[i].type !== 'text') {
        let sprite = new PIXI.Sprite(me.r_app.loader.resources[img_arr[i].src].texture)
        sprite.anchor.set(0.5)
        sprite.position.set(img_arr[i].x, img_arr[i].y)
        sprite.scale.set(img_arr[i].scale)
        sprite.rotation = img_arr[i].rotation
        sprite.alpha = img_arr[i].alpha
        cont.addChild(sprite)
      } else if (img_arr[i].type == 'text') {
        cont.addChild(img_arr[i])
      }
    }
    return cont
  },
  dataURLtoFile: function (dataurl, filename) {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    // 转换成file对象
    return new File([u8arr], filename, { type: mime })
  },
  uploadMaterial: function (mould_name, material_data) {
    const me = this
    // 上传素材
    me.material_id.length = 0
    // for (let j = 0; j < material_data.length; j++) {
    //   (function(j) {
    //     axios.post('http://dev.cyrd.gdinsight.com/api/material/upload_material.html', material_data[j]).then(function(response) {
    //       //获得素材id
    //       // console.log('返回素材id,第' + j + '个' + parseInt(response.data.data.materialId))
    //       material_id_obj[`a${j}`] = parseInt(response.data.data.materialId)
    //       let m_length = Object.keys(material_id_obj)
    //       if (m_length.length == material_data.length) {
    //         for (let z = 0; z < material_data.length; z++) {
    //           material_id.push(material_id_obj[`a${z}`])
    //         }
    //       }
    //       if (material_id.length == material_data.length) {
    //         console.log('material_id' + material_id)
    //         me.uploadTemp(tempF, mould_name, material_id, callback)
    //       }
    //     }).catch(function(error) {
    //       console.log(error);
    //     });
    //   })(j)
    // }
    // 测试promise
    me.uploadAllMaterial(material_data).then(function (res) {
      // 获取元素id，用于上传模板
      for (let i = 0; i < res.length; i++) {
        me.material_id.push(parseInt(res[i].data.data.materialId))
      }
      me.uploadTemp(mould_name)
    }).catch(function (err) {
      me.reject(err)
    })
  },
  uploadMF: function (data) {
    return axios({
      method: 'post',
      url: 'http://ht.idealead.hbindex.com/api/material/upload_material.html',
      data: data,
      headers: { 'my_flag': '1' }
    })
  },
  uploadAllMaterial: function (material_data) {
    const me = this
    let allArr = []
    for (let i = 0; i < material_data.length; i++) {
      allArr.push(me.uploadMF(material_data[i]))
    }
    return Promise.all(allArr)
  },
  uploadImgF: function (formdata, wantF, funcData) {
    // 上传图片功能函数，formdata为图片表单，wanF为回调执行方法，funcData为回调传入的函数
    const me = this
    return axios({
      method: 'post',
      url: 'http://ht.idealead.hbindex.com/api/files/upload_file_once/author_id/1.html',
      data: formdata,
      headers: { 'my_flag': '1' }
    }).then(function (response) {
      wantF.bind(me)(response, funcData)
    }).catch(function (error) {
      me.reject(error)
    })
  },
  axiosTempF: function (response, funcData) {
    const me = this
    // 分为用户模板保存，设计师模板保存，渲染临时模板保存
    let tempData = {
      preview: response.data.data.file_id,
      author: 1,
      material_content: JSON.stringify(funcData.material_id),
      name: funcData.mould_name,
      condition: 1,
      t_width: me.canvas_width,
      t_height: me.canvas_height,
      level: 'temporary',
      father_id: me.tempId
    }
    // 用户修改的模板绑定根id
    // 有素材集，模板预览图id，模板名称，用户id，可以真正上传模板了
    axios({
      method: 'post',
      url: 'http://ht.idealead.hbindex.com/api/template/upload_template.html',
      data: tempData,
      headers: { 'my_flag': '1' }
    }).then(function (res) {
      let callbackData = {
        origin_preview_img: me.origin_preview_img,
        renderTempId: res.data.data.templateId,
        render_preview_img: response.data.data.savepath
      }
      me.r_app.stage.removeChildren()
      me.resolve(callbackData)
    }).catch(function (error) {
      me.reject(error)
    })
  },
  uploadTemp: function (mould_name) {
    const me = this
    // 判断是否有弧形标题副标题，直接把素材id加入↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    if (me.arc_titleMid != '') {
      me.material_id.splice(me.arc_titleMid_index, 0, me.arc_titleMid)
    }
    if (me.arc_subtitleMid != '') {
      me.material_id.splice(me.arc_subtitleMid_index, 0, me.arc_subtitleMid)
    }
    // 上传模板
    // 上传模板预览图文件
    // let preview = ''
    let img = null
    // tempF.downloadImg.bind(me)(r_app.renderer.plugins.extract.base64(r_app.stage))
    me.ClippingImage(me.r_app.renderer.plugins.extract.base64(me.r_app.stage, 'image/jpeg', 0.9), me.canvas_width, me.canvas_height, 0.4, function (base64Result) {
      // me.downloadImg(base64Result)
      // 图片转文件，上传文件，拿回文件id
      img = me.dataURLtoFile(base64Result, 'mould.jpg')
      let formdata = new FormData()
      formdata.append('upload_file_once', img)
      me.uploadImgF(formdata, me.axiosTempF, { material_id: me.material_id, mould_name: mould_name })
    })
  },
  downloadImg: function (imgsrc) {
    fetch(imgsrc).then(res => res.blob().then(blob => {
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(blob)
      var filename = 'myImg.png'
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    }))
  },
  ClippingImage: function (base64Codes, width, height, quality, callback) {
    const me = this
    var img = new Image()
    img.src = base64Codes
    // 生成canvas
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var createw = document.createAttribute('width')
    var createh = document.createAttribute('height')
    createw.nodeValue = width
    createh.nodeValue = height
    canvas.setAttributeNode(createh)
    canvas.setAttributeNode(createw)
    img.onload = function () {
      ctx.drawImage(img, (me.window_w - me.canvas_width) / 2, (me.window_h - me.canvas_height) / 2, width, height, 0, 0, width, height)
      var base64Result = canvas.toDataURL('image/jpeg', quality)
      callback(base64Result)
    }
  }
}
