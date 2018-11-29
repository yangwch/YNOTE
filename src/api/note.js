// note api list
import axios from 'axios'

// 获取列表
export const getNotes = () => axios.post('/api/note/getNotes')
// 添加note
export const addNote = (data) => axios.post('/api/note/addNote', data)

// 删除
export const delNote = (id) => axios.delete('/api/note/delNote/' + id)
// 更新一条数据
export const updNote = (id, data) => axios.post('/api/note/updNote/' + id, data)
