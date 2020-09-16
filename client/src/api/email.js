import axios from '@/plugins/request';
import qs from 'qs';

const email = {
  sendLetter(params = {}) {
    return axios.post('/email/sendLetter', qs.stringify(params));
  },
  getInbox(params = {}) {
    return axios.post('/email/getInbox', qs.stringify(params));
  },
  deleteLetter(params = {}) {
    return axios.post('/email/deleteLetter', qs.stringify(params));
  },
  getEmailDetail(params = {}) {
    return axios.post('/email/getEmailDetail', qs.stringify(params));
  },
  getQiniuToken() {
    return axios.get('/email/qiniuToken');
  },
};
export default email;
