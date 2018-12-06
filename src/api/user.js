import axios from 'axios'

// 密码编码
const encodePwd = (pwd) => {
  let result = []
  if (pwd.length) {
    for (var i = pwd.length - 1; i >= 0; i--) {
      result.push(pwd[i].charCodeAt())
    }
    return result.join('$')
  }
}
// 检查用户名是否重复
export const checkUserExists = (username) => axios.post(`/api/user/checkUserExists/${username}`)
// 注册
export const regNewuser = (data) => {
  let pdata = Object.assign({}, data, {password: encodePwd(data.password)})
  return axios.post('/api/user/reg', pdata)
}
// 登录
export const login = (data) => {
  let pdata = Object.assign({}, data, {password: encodePwd(data.password)})
  return axios.post('/api/user/login', pdata)
}
// 获取登录信息
export const getLoginInfo = () => axios.get('/api/user/getLoginInfo?' + Math.random())
// 登出
export const logout = () => axios.get('/api/user/logout?' + Math.random())
// 修改密码
export const changePwd = (data) => {
  let {password, newpassword} = data
  return axios.post('/api/user/changePwd', {password: encodePwd(password), newpassword: encodePwd(newpassword)})
}
