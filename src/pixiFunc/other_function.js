export default {
  name: 'other_func',
  arrToAss: function(element_arr, association_id = -1, render_create = false) {
    const me = this;
    if (element_arr.length > 1) {
      let time = (new Date()).valueOf();
      if (association_id == -1) {
        association_id = `association_${time}`
      }
      let m_comp_name = element_arr[1].m_comp_name;
      let same = element_arr.every(function(item) {
        if (item.type == 'association_gap_notT' || item.m_comp_name == m_comp_name) {
          return true
        }
      })
      if (same) {
        for (let i = 0; i < element_arr.length; i++) {
          //组合空隙不添加成新组合
          if (element_arr[i].type == 'association_gap_notT') {} else {
            element_arr[i].association_name = association_id
          }
        }
        me.createAssociation(association_id, m_comp_name, render_create)
      } else {
        alert('不同归属模块的元素不能组合')
      }
    }
  },
}