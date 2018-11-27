import axios from 'axios'
// 注册
export const regNewuser = (data) => axios.post('/api/user/reg', data)
// 登录
export const login = (data) => axios.post('/api/user/login', data)