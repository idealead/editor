// import * as PIXI from 'pixi.js'
// import _ from 'lodash'
import bus from '@/eventBus.js'
import axios from 'axios'
export default {
  methods: {
    arrToAss: function (element_arr, association_id = -1, render_create = false) {
      const me = this
      if (element_arr.length > 1) {
        let time = (new Date()).valueOf()
        if (association_id == -1) {
          association_id = `association_${time}`
        }
        let m_comp_name = element_arr[1].m_comp_name
        let same = element_arr.every(function (item) {
          if (item.type == 'association_gap_notT' || item.m_comp_name == m_comp_name) {
            return true
          }
        })
        if (same) {
          for (let i = 0; i < element_arr.length; i++) {
            // 组合空隙不添加成新组合
            if (element_arr[i].type == 'association_gap_notT') { } else {
              element_arr[i].association_name = association_id
            }
          }
          me.createAssociation(association_id, m_comp_name, render_create)
        } else {
          alert('不同归属模块的元素不能组合')
        }
      }
      me.updateLayer()
    },
    moveOutLine: function (x, y, obj) {
      const me = this
      // let outLineC = me.outLine_container;
      // for (let i = 0; i < outLineC.children.length; i++) {
      //   if (obj.name == outLineC.children[i].name) {
      //     outLineC.children[i].position.set(x, y);
      //   }
      // }
      // for (let item of me.outLine_container.children.values()) {
      //   if (item.name == obj.name) {
      //     item.position.set(x, y)
      //   }
      //   item = null
      // }
      me.outLine_container.getChildByName(obj.name).position.set(x, y)
    },
    changeAssociation: function (obj) {
      if (obj.change) {
        const me = this
        let x_arr = []
        let y_arr = []
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          if (obj.association_name == me.ctrl_arr[i].association_name && me.ctrl_arr[i].type !== 'association_gap_notT') {
            let vertexData = me.ctrl_arr[i].vertexData
            for (let k = 0; k < vertexData.length; k++) {
              if (k % 2 == 0 || k == 0) {
                x_arr.push(vertexData[k])
              } else {
                y_arr.push(vertexData[k])
              }
            }
          }
        }
        x_arr.sort((a, b) => a - b)
        y_arr.sort((a, b) => a - b)
        let width = x_arr[x_arr.length - 1] - x_arr[0]
        let height = y_arr[y_arr.length - 1] - y_arr[0]
        obj.clear()
        obj.width = width
        obj.height = height
        obj.originalw = width
        obj.originalh = height
        obj.rotation_num = 0
        obj.rotation = 0
        obj.beginFill(0xE6E6FA, 0.1)
        obj.alpha = 0.01
        obj.drawRect(0, 0, width, height)
        obj.endFill()
        obj.x = x_arr[0] - (me.window_w - me.canvas_width) / 2
        obj.y = y_arr[0] - (me.window_h - me.canvas_height) / 2
        // 矩形中心点
        obj.centerX = obj.x + obj.width / 2
        obj.centerY = obj.y + obj.height / 2
        obj.change = false
      }
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
    toImage2: function (returnFile) {
      // 组合或者单个元素导成图片
      const me = this
      let [width, height, centerX, centerY] = new Array(4).fill(0)
      let img_arr = []
      if (me.ctrl_arr.length > 0) {
        if (me.temporary_rect) {
          width = me.temporary_rect.width
          height = me.temporary_rect.height
          centerX = me.temporary_rect.centerX
          centerY = me.temporary_rect.centerY
        } else {
          for (let i = 0; i < me.ctrl_arr.length; i++) {
            if (me.ctrl_arr[i].type == 'association_gap_notT') {
              width = me.ctrl_arr[i].width
              height = me.ctrl_arr[i].height
              centerX = me.ctrl_arr[i].centerX
              centerY = me.ctrl_arr[i].centerY
            }
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
      } else if (me.in_move && me.in_move.association_name == '') {
        width = me.in_move.width
        height = me.in_move.height
        let data = {}
        if (me.in_move.type !== 'text') {
          data = {
            src: me.in_move.srcData,
            x: (width / 2),
            y: (height / 2),
            scale: me.in_move.scale.x,
            rotation: me.in_move.parent.rotation,
            type: me.in_move.type,
            alpha: me.in_move.alpha
          }
        } else if (me.in_move.type == 'text') {
          // 深拷贝
          data = _.cloneDeep(me.in_move)
          data.position.set(me.in_move.parent.position.x, me.in_move.parent.position.y)
        }
        img_arr.push(data)
      }
      me.img_app = null
      me.img_app = new me.mypixi.Application({
        backgroundColor: 0xff0000,
        width: width,
        height: height,
        antialias: 1
      })
      let cont = new me.mypixi.Container()
      cont.width = width
      cont.height = height
      cont.position.set(0, 0)
      cont = me.addImgTwo(cont, img_arr)
      me.img_app.stage.addChild(cont)
      let img = me.img_app.renderer.plugins.extract.base64(me.img_app.stage)
      if (!returnFile) {
        me.downloadImg(img)
        me.$set(me.right_block, 'show', false)
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
          let sprite = new me.mypixi.Sprite(me.p_app.loader.resources[img_arr[i].src].texture)
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
    idToImg: function (idArr) {
      const me = this
      me.addACtrlarr(idArr[0])
      let file = me.toImage(true)
      var formdata = new FormData()
      formdata.append('upload_file_once', file)
      axios({
        method: 'post',
        url: `${me.api.upload_file_once}1.html`,
        data: formdata
      }).then(function (response) {
        return response.data.file_id
      })
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
    locationMove: function (way, d_value = 0) {
      const me = this
      if (!me.temporary_rect && me.in_move) {
        // 单个元素
        let point = 0
        if (way == 'up' || way == 'down' || way == 'middle') {
          point = me.in_move.vertexData[1]
          for (let i = 3; i < 8; i += 2) {
            if (way == 'down') {
              if (me.in_move.vertexData[i] > point) point = me.in_move.vertexData[i]
            } else if (way == 'up') {
              if (me.in_move.vertexData[i] < point) point = me.in_move.vertexData[i]
            }
          }
        } else if (way == 'left' || way == 'right' || way == 'center') {
          point = me.in_move.vertexData[0]
          for (let i = 2; i < 8; i += 2) {
            if (way == 'left') {
              if (me.in_move.vertexData[i] < point) point = me.in_move.vertexData[i]
            } else if (way == 'right') {
              if (me.in_move.vertexData[i] > point) point = me.in_move.vertexData[i]
            }
          }
        }
        // 移动************************************
        let centerY = me.in_move.parent.y
        if (way == 'down') {
          me.in_move.parent.y = me.canvas_height - ((point - (me.window_h - me.canvas_height) / 2) - centerY) + d_value
        } else if (way == 'up') {
          me.in_move.parent.y = centerY - (point - (me.window_h - me.canvas_height) / 2) + d_value
        } else if (way == 'middle') {
          me.in_move.parent.y = (me.canvas_height / 2) + d_value
        } else if (way == 'left') {
          me.in_move.parent.x = me.in_move.parent.x - (point - (me.window_w - me.canvas_width) / 2) + d_value
        } else if (way == 'right') {
          me.in_move.parent.x = me.canvas_width - ((point - (me.window_w - me.canvas_width) / 2) - me.in_move.parent.x) + d_value
        } else if (way == 'center') {
          me.in_move.parent.x = (me.canvas_width / 2) + d_value
        }
        me.moveOutLine(me.in_move.parent.x, me.in_move.parent.y, me.in_move)
        if (me.in_move.association_name !== '') {
          me.aSingleClickBorder(me.in_move.association_name)
        }
        // 移动************************************
      } else if (me.temporary_rect) {
        // 临时组合所有元素
        let tPoint = 0
        let moveStep = 0
        if (way == 'up' || way == 'down' || way == 'middle') {
          tPoint = me.temporary_rect.vertexData[1]
          for (let i = 3; i < 8; i += 2) {
            if (way == 'up') {
              if (me.temporary_rect.vertexData[i] < tPoint) tPoint = me.temporary_rect.vertexData[i]
            } else if (way == 'down') {
              if (me.temporary_rect.vertexData[i] > tPoint) tPoint = me.temporary_rect.vertexData[i]
            }
          }
        } else if (way == 'left' || way == 'right' || way == 'center') {
          tPoint = me.temporary_rect.vertexData[0]
          for (let i = 2; i < 8; i += 2) {
            if (way == 'left') {
              if (me.temporary_rect.vertexData[i] < tPoint) tPoint = me.temporary_rect.vertexData[i]
            } else if (way == 'right') {
              if (me.temporary_rect.vertexData[i] > tPoint) tPoint = me.temporary_rect.vertexData[i]
            }
          }
        }
        if (way == 'up') {
          moveStep = me.temporary_rect.centerY - (me.temporary_rect.centerY - (tPoint - (me.window_h - me.canvas_height) / 2))
        } else if (way == 'down') {
          moveStep = -(me.canvas_height - ((tPoint - (me.window_h - me.canvas_height) / 2) - me.temporary_rect.centerY) - me.temporary_rect.centerY)
        } else if (way == 'middle') {
          moveStep = (me.canvas_height / 2) - me.temporary_rect.centerY
          moveStep = -moveStep
        } else if (way == 'left') {
          moveStep = me.temporary_rect.centerX - (me.temporary_rect.centerX - (tPoint - (me.window_w - me.canvas_width) / 2))
        } else if (way == 'right') {
          moveStep = -(me.canvas_width - ((tPoint - (me.window_w - me.canvas_width) / 2) - me.temporary_rect.centerX) - me.temporary_rect.centerX)
        } else if (way == 'center') {
          moveStep = (me.canvas_width / 2) - me.temporary_rect.centerX
          moveStep = -moveStep
        }
        // 移动ctrl_arr里所有元素，然后再组成临时组合
        // 移动************************************
        for (let k = 0; k < me.ctrl_arr.length; k++) {
          if (me.ctrl_arr[k].type == 'association_gap_notT') {
            if (way == 'up' || way == 'down' || way == 'middle') {
              me.ctrl_arr[k].y -= moveStep
              me.ctrl_arr[k].centerY -= moveStep
            } else if (way == 'left' || way == 'right' || way == 'center') {
              me.ctrl_arr[k].x -= moveStep
              me.ctrl_arr[k].centerX -= moveStep
            }
            me.moveOutLine(me.ctrl_arr[k].centerX, me.ctrl_arr[k].centerY, me.ctrl_arr[k])
          } else {
            if (way == 'up' || way == 'down' || way == 'middle') {
              me.ctrl_arr[k].parent.y -= moveStep
            } else if (way == 'left' || way == 'right' || way == 'center') {
              me.ctrl_arr[k].parent.x -= moveStep
            }
            // 移动icon线框位置
            me.moveOutLine(me.ctrl_arr[k].parent.x, me.ctrl_arr[k].parent.y, me.ctrl_arr[k])
          }
        }
        if (way == 'up' || way == 'down' || way == 'middle') {
          me.temporary_rect.y -= moveStep
          me.temporary_rect.centerY -= moveStep
        } else if (way == 'left' || way == 'right' || way == 'center') {
          me.temporary_rect.x -= moveStep
          me.temporary_rect.centerX -= moveStep
        }
        me.moveOutLine(me.temporary_rect.centerX, me.temporary_rect.centerY, me.temporary_rect)
        // 移动************************************
      } else if (!me.temporary_rect && me.ctrl_arr.length > 0) {
        // 组合所有元素
        let aPoint = 0
        let moveStep = 0
        let assIndex = 0
        for (let a = 0; a < me.ctrl_arr.length; a++) {
          if (me.ctrl_arr[a].type == 'association_gap_notT') {
            assIndex = a
            if (way == 'up' || way == 'down' || way == 'middle') {
              aPoint = me.ctrl_arr[a].vertexData[1]
              for (let k = 1; k < 8; k += 2) {
                if (way == 'up') {
                  if (me.ctrl_arr[a].vertexData[k] < aPoint) aPoint = me.ctrl_arr[a].vertexData[k]
                } else if (way == 'down') {
                  if (me.ctrl_arr[a].vertexData[k] > aPoint) aPoint = me.ctrl_arr[a].vertexData[k]
                }
              }
            } else if (way == 'left' || way == 'right' || way == 'center') {
              aPoint = me.ctrl_arr[a].vertexData[0]
              for (let k = 2; k < 8; k += 2) {
                if (way == 'left') {
                  if (me.ctrl_arr[a].vertexData[k] < aPoint) aPoint = me.ctrl_arr[a].vertexData[k]
                } else if (way == 'right') {
                  if (me.ctrl_arr[a].vertexData[k] > aPoint) aPoint = me.ctrl_arr[a].vertexData[k]
                }
              }
            }
            if (way == 'up') {
              moveStep = me.ctrl_arr[a].centerY - (me.ctrl_arr[a].centerY - (aPoint - (me.window_h - me.canvas_height) / 2))
            } else if (way == 'down') {
              moveStep = -(me.canvas_height - ((aPoint - (me.window_h - me.canvas_height) / 2) - me.ctrl_arr[a].centerY) - me.ctrl_arr[a].centerY)
            } else if (way == 'middle') {
              moveStep = (me.canvas_height / 2) - me.ctrl_arr[a].centerY
              moveStep = -moveStep
            } else if (way == 'left') {
              moveStep = me.ctrl_arr[a].centerX - (me.ctrl_arr[a].centerX - (aPoint - (me.window_w - me.canvas_width) / 2))
            } else if (way == 'right') {
              moveStep = -(me.canvas_width - ((aPoint - (me.window_w - me.canvas_width) / 2) - me.ctrl_arr[a].centerX) - me.ctrl_arr[a].centerX)
            } else if (way == 'center') {
              moveStep = (me.canvas_width / 2) - me.ctrl_arr[a].centerX
              moveStep = -moveStep
            }
          }
        }
        // 移动组合元素
        /// /移动************************************
        for (let j = 0; j < me.ctrl_arr.length; j++) {
          if (me.ctrl_arr[j].type !== 'association_gap_notT') {
            if (way == 'up' || way == 'down' || way == 'middle') {
              me.ctrl_arr[j].parent.y -= moveStep
            } else {
              me.ctrl_arr[j].parent.x -= moveStep
            }
            // 移动icon线框位置
            me.moveOutLine(me.ctrl_arr[j].parent.x, me.ctrl_arr[j].parent.y, me.ctrl_arr[j])
          }
        }
        // 移动************************************
        setTimeout(() => {
          me.ctrl_arr[assIndex].change = true
          me.changeAssociation(me.ctrl_arr[assIndex])
          let ass_name = me.ctrl_arr[assIndex].association_name
          me.renderTLine(false, true, ass_name)
        }, 30)
      }
      // 存储进活动日志
      me.pushActiveLog(true)
    },
    lockFunc: function () {
      const me = this
      me.$set(me.right_block, 'show', false)
      if (me.in_move && me.ctrl_arr.length == 0 && me.in_move.association_name == '') {
        // 单个元素锁定
        me.in_move.lock = true
        me.containerLine(me.in_move, false, true, false, true)
      } else if (!me.temporary_rect && me.ctrl_arr.length > 0) {
        // 组合锁定
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          me.ctrl_arr[i].lock = true
        }
        // me.addACtrlarr(me.ctrl_arr[0].association_name)
        // 添加组合边框给组合矩形不加加按钮,不渲染临时边框
        me.renderTLine(false, true, me.ctrl_arr[0].association_name, true)
      }
      me.$set(me.edit_bar.btn, 'show', false)
    },
    unlockFunc: function () {
      const me = this
      me.$set(me.right_block, 'show', false)
      if (me.in_move && me.ctrl_arr.length == 0 && me.in_move.association_name == '') {
        // 单个元素解锁
        me.in_move.lock = false
        me.containerLine(me.in_move, false, true)
      } else if (!me.temporary_rect && me.ctrl_arr.length > 0) {
        // 组合解锁
        for (let i = 0; i < me.ctrl_arr.length; i++) {
          me.ctrl_arr[i].lock = false
        }
        me.renderTLine(false, true, me.ctrl_arr[0].association_name, false)
        me.click_ass_id = me.ctrl_arr[0].association_name
      }
      me.$set(me.edit_bar.btn, 'show', true)
    },
    updateLayer: function () {
      const me = this
      let data = []
      for (let i = 0; i < me.container_arr.length; i++) {
        // 排除临时组合和组合矩形
        if (me.container_arr[i].cont.children[0].type !== 'temporary_rect' && me.container_arr[i].cont.children[0].type !== 'association_gap_notT' && me.container_arr[i].cont.children[0].type !== 'notSave') {
          let layer_data = {}
          let traget = me.container_arr[i].cont.children[0]
          layer_data.type = me.container_arr[i].cont.children[0].type
          layer_data.srcData = me.container_arr[i].cont.children[0].srcData
          layer_data.text = me.container_arr[i].cont.children[0].text
          layer_data.id = me.container_arr[i].cont.children[0].name
          layer_data.role = me.container_arr[i].cont.children[0].role
          layer_data.replacePosition = me.container_arr[i].cont.children[0].replacePosition
          if (traget.type == 'text') {
            layer_data.color = traget.style.fill
            layer_data.fontSize = traget.style.fontSize * 0.3
            if (layer_data.fontSize <= 14) layer_data.fontSize = 14
            if (layer_data.fontSize >= 52) layer_data.fontSize = 52
            if (traget.textPosition) layer_data.textPosition = traget.textPosition
            layer_data.fontFamily = traget.style.fontFamily
            if (traget.style.dropShadow) {
              layer_data.dropShadow = true
              layer_data.dropShadowColor = traget.style.dropShadowColor
              layer_data.dropShadowBlur = traget.style.dropShadowBlur / 2
            } else {
              layer_data.dropShadowColor = 'rgba(0,0,0,0)'
            }
          }
          layer_data.select = false
          if (me.in_move && me.container_arr[i].cont.children[0].name == me.in_move.name) {
            layer_data.select = true
          } else if (!me.in_move && me.ctrl_arr && me.ctrl_arr.length > 0) {
            let inarr = me.ctrl_arr.some(item => {
              return item.name == me.container_arr[i].cont.children[0].name
            })
            if (inarr) layer_data.select = true
          }
          data.push(layer_data)
        }
      }
      // 通知tab-layer更新图层
      bus.$emit('update-layer', data)
    },
    pushActiveLog: function (permit = false) {
      /// 操作和数据存入日志
      const me = this
      if (me.after_move || me.after_scale || me.after_rotate || me.after_stretch || permit) {
        // 存储当前画布内容以及是否有in_move或者组合激活
        let ass_id = ''
        let layer_data_example = {
          m_comp_name: 'product',
          children: [{
            ass_children: [],
            association_id: ''
          }]
        }
        let obj_data_example = { // 事例
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
          size: {},
          arc: {},
          skew: {}
        }
        let log_data = []
        let data = {}
        for (let i = 0; i < me.container_arr.length; i++) {
          if (me.container_arr[i].cont.children[0].type !== 'temporary_rect' && me.container_arr[i].cont.children[0].type !== 'association_gap_notT' && me.container_arr[i].cont.children[0].type !== 'notSave') {
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
            if (obj.type === 'image') {
              element_data.src = obj.srcData
              element_data.type = 'image'
              element_data.file_id = obj.file_id
              element_data.size.width = obj.width
              element_data.size.height = obj.height
              element_data.replacePosition = obj.replacePosition // 裂变的图片替换位置标记
              // 如果是弧形装饰图片，要加上arc属性
              if (obj.role.search('arc') !== -1) {
                element_data.arc = me.arc_obj[obj.role].arc
              }
            } else if (obj.type === 'text') {
              element_data.type = 'text'
              let style = {
                fontFamily: '思源黑体',
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
                letterSpacing: 0,
                align: 'left'
              }
              for (let key in style) {
                style[key] = obj.style[key]
              }
              element_data.style = style
              element_data.style.fontSize = Math.floor(element_data.style.fontSize)
              element_data.text = obj.text
              element_data.size.width = obj.width
              element_data.size.height = obj.height
              element_data.textReplace = obj.textReplace // 记录文案替换位置序号和名称
              element_data.textPosition = obj.textPosition
              element_data.textReverse = obj.textReverse
            }
            element_data.id = obj.name
            element_data.rotation = obj.rotation
            element_data.scale = obj.scale.x
            element_data.position.x = obj.parent.x
            element_data.position.y = obj.parent.y
            element_data.alpha = obj.alpha
            element_data.role = obj.role
            element_data.skew = {
              x: obj.skew.x,
              y: obj.skew.y
            }
            element_data.hueNumber = obj.hueNumber
            data.children[0].ass_children.push(element_data)
            if (i == me.container_arr.length - 1) {
              log_data.push(data)
            }
            obj = null
            element_data = null
          }
        }
        if (me.active_log.length >= 30) {
          me.active_log.splice(0, 1)
        }
        me.active_log.splice(me.active_index + 1, 30)
        me.active_log.push(log_data)
        me.$set(me, 'active_index', me.active_log.length - 1)
        me.$set(me, 'after_move', false)
        me.$set(me, 'after_scale', false)
        me.$set(me, 'after_rotate', false)
        me.$set(me, 'after_stretch', false)
        bus.$emit('mould_change')
        console.log('记录行为')
        // console.log(me.active_log[me.active_log.length - 1])
      }
    },
    resetCanvas: function () {
      const me = this
      let browser_w = document.body.clientWidth
      let browser_h = document.body.clientHeight
      browser_h -= 0
      let browser_ratio = browser_w / browser_h
      let canvas_ratio = me.canvas_width / me.canvas_height
      let ratio = 0
      if (canvas_ratio >= browser_ratio) {
        ratio = browser_w / me.canvas_width
      } else if (canvas_ratio < browser_ratio) {
        ratio = browser_h / me.canvas_height
      }
      ratio -= 0.14
      ratio = Math.floor(ratio * 100) / 100
      me.$set(me, 'canvas_scale', ratio)
      document.getElementById('pixiCanvas').style.transform = `scale(${ratio}) translateX(-${me.window_w / 2}px)`
      // translateY(-710px)
    },
    onresize: function () {
      const me = this
      let resize = null
      return function () {
        if (resize) {
          clearTimeout(resize)
          resize = null
        }
        resize = setTimeout(() => {
          me.resetCanvas()
        }, 100)
      }
    },
    canvasScale: function (type) {
      const me = this
      let ratio = me.canvas_scale
      if (type == 'reduce') {
        ratio -= 0.05
      } else {
        ratio += 0.05
      }
      ratio = Math.floor(ratio * 100) / 100
      me.$set(me, 'canvas_scale', ratio)
      document.getElementById('pixiCanvas').style.transform = `scale(${ratio}) translateX(-${me.window_w / 2}px)`
    },
    showRuler: function () {
      const me = this
      me.ruler_container.visible = !me.ruler_container.visible
    },
    json_f: function (obj) {
      return JSON.stringify(obj)
    },
    obj_f: function (json) {
      return JSON.parse(json)
    },
    moveStructureText: function () {
      // 移动骨架文字
      const me = this
      if (me.in_move.structure) {
        let up_d = 0
        let left_d = 0
        // a骨架的标题与副标题的位置
        if (me.in_move.role == 'title') {
          up_d = 75
          left_d = 50
        } else if (me.in_move.role == 'subtitle') {
          up_d = 150
          left_d = 50
        }
        setTimeout(() => {
          me.locationMove('up', up_d)
          setTimeout(() => {
            me.locationMove('left', left_d)
          }, 50)
        }, 50)
      }
    },
    setRole: function (content) {
      const me = this
      if (content.search('arc') !== -1) {
        axios({
          method: 'GET',
          url: `arc_find_file?id=${me.in_move.file_id}`
        }).then(res => {
          me.in_move.arc = JSON.parse(res.data.data.arc)
          // 保存弧形信息
          me.$set(me.arc_obj, content, me.in_move)

          me.in_move.role = content
          me.updateLayer()
          // 存储进活动日志
          me.pushActiveLog(true)
          me.$set(me.right_block, 'show', false)
        })
      } else {
        if (content !== 'normal') {
          me.$set(me.tempRoleMsg, content, me.tempRoleMsg[content] += 1)
        } else if (content == 'normal') {
          if (me.in_move.role.search('arc') !== -1) {
            // 清空弧形信息
            me.$set(me.arc_obj, content, '')
          } else {
            me.$set(me.tempRoleMsg, me.in_move.role, me.tempRoleMsg[me.in_move.role] -= 1)
          }
        }
      }
      me.in_move.role = content
      me.updateLayer()
      // 存储进活动日志
      me.pushActiveLog(true)
      me.$set(me.right_block, 'show', false)
    },
    setPosition: function (num) {
      // 裂变功能的替换位置
      const me = this
      me.in_move.replacePosition = num
      me.updateLayer()
      // 存储进活动日志
      me.pushActiveLog(true)
      me.$set(me.right_block, 'show', false)
    },
    setReplaceText: function () {
      const me = this
      me.$set(me, 'mouldFuncShow', true)
    },
    updateTextPosition: function (arr) {
      this.$set(this, 'textPositionArr', arr)
    },
    handleCommand: function (data) {
      let [index, item] = data
      // 选择了文案替换位置
      const me = this
      if (index === -1) {
        me.in_move.textReplace = null
        me.in_move.textPosition = ''
      } else {
        me.in_move.textReplace = index
        me.in_move.textPosition = item
      }
      me.updateLayer()
      // 存储进活动日志
      me.pushActiveLog(true)
      me.$set(me.right_block, 'show', false)
    },
    recommendText: function (arr) {
      const me = this
      me.fullscreenLoading = true
      // 点击了推荐文案，要对整个模板对推荐文案部分替换。如果已经删除，则不进行替换。利用map结构，数字0，1，2等作为键名。对应的图层数组做为键值
      let text = arr
      let textmap = new Map()
      let fontFamily = {}
      for (let i = 0; i < me.container_arr.length; i++) {
        if (typeof (me.container_arr[i].cont.children[0].textReplace) === 'number') {
          let textReplace = me.container_arr[i].cont.children[0].textReplace
          textmap.set(textReplace, textmap.get(textReplace) ? [...textmap.get(textReplace), me.container_arr[i].cont.children[0]] : [me.container_arr[i].cont.children[0]])
          fontFamily[`${me.container_arr[i].cont.children[0].style.fontFamily}`] =
            (fontFamily[`${me.container_arr[i].cont.children[0].style.fontFamily}`] ? fontFamily[`${me.container_arr[i].cont.children[0].style.fontFamily}`] : '') +
            text[textReplace]
        }
      }
      // console.log(textmap)
      // 获取字体
      // 字体加载
      me.getfontFamilyBack(fontFamily).then(() => {
        // 循环图层替换字体
        setTimeout(() => {
          for (let [key, value] of textmap) {
            if (value.length > 1) {
              // 比如 【我，爱你】去替换 【你，拜拜】则你图层在拜拜图层之下
              let start = 0
              for (let i = 0; i < value.length; i++) {
                value[i].text = text[key].slice(start, value[i].text.length + start)
                start += value[i].text.length
              }
            } else {
              let ow = value[0].width
              if (value[0].textReverse) {
                let re = text[key].split('')
                re = re.reverse()
                value[0].text = re.join('')
              } else {
                value[0].text = text[key]
              }
              let afterw = value[0].width
              console.log('原' + ow)
              console.log('后' + afterw)
            }
            textmap.set(key, '')
          }
          me.fullscreenLoading = false
          // 要记录日志更新layer
          me.pushActiveLog(true)
          me.updateLayer()
        }, 300)
      })
    },
    getfontFamilyBack: function (font_family) {
      const me = this
      return new Promise(function (resolve, reject) {
        me.getAllfontFamily(font_family)
          .then(function (res) {
            if (res === 'stf') {
              resolve()
              return false
            }
            let aarr = []
            // 加载css文件，从而自动加载woff文件
            for (let i = 0; i < res.length; i++) {
              if (res[i].data.code !== 1) continue
              aarr = [...aarr, ...me.getCssWoff(res[i].data.path, res[i].data.woffPath)]
              me.dynamicLoadCss(me.api.file_path + res[i].data.path)
            }
            axios
              .all(aarr)
              .then(function (response) {
                // 下方的linkcss，以及字体的加载读缓存就好了。
                setTimeout(() => {
                  // 字体加载完毕回调
                  resolve()
                }, 50)
              })
              .catch(res => {
                reject(res)
              })
          })
          .catch(res => {
            reject(res)
          })
      })
    },
    textReverse: function (hastext = null) {
      const me = this
      let text = hastext ? hastext.split('') : me.in_move.text.split('')
      text = text.reverse()
      me.in_move.text = text.join('')
      me.in_move.textReverse = true
      // 存储进活动日志
      me.pushActiveLog(true)
    }
  }
}
