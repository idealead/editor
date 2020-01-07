export const apifile = {
  // ***************************************************designerCenter页面以及其子组件
  // 获取分裂架构列表
  all_framework_info: '/framework/all_framework_info',

  // 图片地址拼接前缀
  images: 'http://ht.idealead.hbindex.com/uploadFiles/images/',

  // 设计师模板列表请求
  template_audit_list: '/template/template_audit_list',

  // 改变模板状态
  temp_change_status: '/template/temp_change_status',

  // 查看标签池
  find_label_list: '/label/find_label_list',

  // 更新模板标签
  add_template_label: '/template/add_template_label',

  // 模板提交后，上线功能
  complete_template_audit: '/template/complete_template_audit',

  // 获取用户上传的图片列表
  find_file: '/Files/find_file',

  // 设置上传图片的参数，宽高、弧形参数等s
  change_file_rule: '/Files/change_file_rule',

  // 上传图片接口，后面跟上id.html
  upload_file_once: 'http://ht.idealead.hbindex.com/api/files/upload_file_once/author_id/',

  // 裂变渲染完成后提交
  change_combination_template: '/Combination/change_combination_template',

  // 某裂变架构请求有几种裂变情况(应该是得到排列组合id集)
  get_combination: '/Combination/get_combination',

  // 用排列组合id集获取详情
  get_framework_combination: '/Combination/get_framework_combination',

  // 新增裂变架构
  add_framework_info: '/framework/add_framework_info',

  // 撤销裂变的素材图片
  del_framework_material: '/Material_info/del_framework_material',

  // 添加裂变图片，来自我的素材
  add_framework_material: '/Material_info/add_framework_material',

  // 获取某个裂变架构的替换位置信息
  find_framework_info: '/framework/find_framework_info',
  // ***************************************************designerCenter页面以及其子组件

  // ***************************************************login页面以及其子组件
  // 登陆
  user_login: '/user/user_login',
  // ***************************************************login页面以及其子组件

  // ***************************************************home(canvas)页面以及其子组件
  // 获取推荐文案接口
  get_word: '/Word/find_word_self',

  // 获取css文件以及woff字体文件的地址前缀
  file_path: 'http://font.idealead.hbindex.com',

  // 字体压缩接口
  cutFont: 'http://papi.idealead.hbindex.com/cutFont',

  // 保存模板接口
  upload_template: '/template/upload_template.html',

  // 上传素材接口，获取素材id，用于保存模板
  upload_material: '/material/upload_material.html',

  // 通过模板id获取模板信息
  template: '/template/find_template_by_id/template_id/',

  // 获取弧形装饰参数
  arc_find_file: '/Files/find_file_one',

  // 保存文案规则
  add_word_rule: '/Word/add_word_rule',

  // 获取用户信息
  get_user_info: '/User/get_user_info'
  // ***************************************************home(canvas)页面以及其子组件
}
