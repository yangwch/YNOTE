import axios from 'axios'
// 检查用户名是否重复
export const checkUserExists = (username) => axios.post(`/api/user/checkUserExists/${username}`)
// 注册
export const regNewuser = (data) => axios.post('/api/user/reg', data)
// 登录
export const login = (data) => axios.post('/api/user/login', data)
// 获取登录信息
export const getLoginInfo = () => axios.get('/api/user/getLoginInfo?' + Math.random())
// 登出
export const logout = () => axios.get('/api/user/logout?' + Math.random())
