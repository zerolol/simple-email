import axios from '@/plugins/request';
import qs from 'qs';

const sign = {
  login(params) {
    return axios.post('/email/login', qs.stringify(params));
  },
  regist(params) {
    return axios.post('/email/regist', qs.stringify(params));
  },
  modifyPassword(params) {
    return axios.post('/email/modifyPassword', qs.stringify(params));
  },
  getCode() {
    return axios.get('/email/getCode');
  },
};
export default sign;
