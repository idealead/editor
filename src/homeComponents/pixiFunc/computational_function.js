export default {
  name: 'computed_func',
  LENGTH_SIZE: function (i, e) {
    var n = e.x - i.x
    var t = e.y - i.y
    var a = Math.sqrt(n * n + t * t)
    return a
  },
  AFTER_ROTATE: function (param) {
    // 此方法为逆时针旋转，顺时针时角度要为负
    var x = param[0]
    var y = param[1]
    var tha1 = param[2]
    var value = Math.sqrt(x * x + y * y)
    var cos1 = x / value
    var sin1 = y / value
    var cos2 = Math.cos(tha1)
    var sin2 = Math.sin(tha1)
    var cos3 = cos1 * cos2 - sin1 * sin2
    var sin3 = sin1 * cos2 + cos1 * sin2
    param[0] = (value * cos3)
    param[1] = (value * sin3)
    return param
  }
}
