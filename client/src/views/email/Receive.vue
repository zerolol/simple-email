<template>
    <div class="receive-letter">
        <header>
          <el-button type="primary" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            返回
          </el-button>
          <div v-if="emailDetail.mailType !== '2'" class="btn-wrapper">
            <el-button @click="reply('1')">回复</el-button>
            <el-button @click="reply('2')">转发</el-button>
          </div>
          <el-button @click="showVisible" style="marginLeft: 10px">删除</el-button>
        </header>
        <section>
          <div class="letter-header">
            <h1>{{emailDetail.mailSubject}}</h1>
            <div>
              <span class="letter-left">发件人</span><span>：</span>
              <span v-if="emailDetail.mailPhone" class="letter-person">{{emailDetail.mailPhone}}</span>
            </div>
            <div style="margin: 10px 0 12px 0">
              <span class="letter-left">收件人</span><span>：</span>
              <span v-for="(item, index) in emailDetail.mailReceiverArr" :key="index" class="letter-person">{{item}}</span>
            </div>
            <div style="margin: 12px 0 14px 0">
              <span class="letter-left">时间</span><span>：</span>
              <span style="fontSize: 12px">{{emailDetail.sendTime}}</span>
            </div>
            <div v-if="emailDetail.attachList && emailDetail.attachList.length > 0" class="enclosure">
              <span class="letter-left" style="flex: 0 0 44px">附件</span><span style="width: 14px; flex: 0 0 14px">：</span>
              <ul>
                <li v-for="(item, index) in emailDetail.attachList" :key="index" @click="downloadFile(item)">
                <img :src="choosePrefix(item.fileType)" alt="#" style="marginRight: 8px; verticalAlign: middle;" width="20" height="20">
                <span>
                    {{item.fileName}}
                </span>
                </li>
              </ul>
            </div>
          </div>
          <div v-html="emailDetail.mailContent" class="email-content"></div>
          <div class="letter-footer">
            <p>声明：本邮件及附件均含有保密信息并受相关法律法规保护，仅供邮件的预期收件人按发件人允许合法使用。如果您不是本邮件的预期收件人，请立即回复告知发件人并删除本邮件及附件。未经本邮件的发件人允许，严禁任何人对本邮件、附件或其包含的信息进行散播、披露或复制。谢谢！</p>
          </div>
        </section>
        <el-dialog
            title="提示"
            :visible.sync="visible"
            width="334"
            custom-class="delete-wrapper"
            >
           <p>{{emailDetail.mailType === '2' ? '是否彻底删除该邮件？' : '是否删除该邮件？'}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteHandleOk">是</el-button>
                <el-button type="primary" @click="deleteHandleCancel">否</el-button>
            </span>
        </el-dialog>
      </div>
</template>
<script>
import img from '@/assets/annex_img.svg';
import excel from '@/assets/annex_excel.svg';
import pdf from '@/assets/annex_pdf.svg';
import ppt from '@/assets/annex_ppt.svg';
import video from '@/assets/annex_video.svg';
import word from '@/assets/annex_word.svg';
import zip from '@/assets/annex_zip.svg';
import { formatDate } from '@/utils/utils';

export default {
  name: 'Receive',
  data() {
    return {
      visible: false,
      emailDetail: {},
    };
  },
  mounted() {
    this.getEmailDetail();
  },
  methods: {
    async getEmailDetail() {
      try {
        const params = {
          emailId: this.$route.query.emailId,
          mailStatus: this.$route.query.mailStatus,
        };
        const { code, msg, data } = await this.$api.email.getEmailDetail(params);
        if (code === 200) {
          const obj = data;
          obj.sendTime = formatDate(obj.sendDate);
          obj.mailReceiverArr = obj.mailReceiver ? obj.mailReceiver.split(',') : [];
          obj.mailReceiverCcArr = obj.mailReceiverCc ? obj.mailReceiverCc.split(',') : [];
          obj.mailContent = obj.mailContent && obj.mailContent.replace(/\n/g, '<br/>');
          obj.mailContent = obj.mailContent && obj.mailContent.replace(/\s/g, '&nbsp;');
          this.emailDetail = { ...obj };
          window.sessionStorage.setItem('emailDetail', JSON.stringify(obj));
        } else {
          this.$message.error(msg || '查询失败！');
        }
      } catch (e) {
        console.log(e);
        this.$message.error('查询失败！');
      }
    },
    goBack() {
      const arr = ['/inbox', '/send', '/delete'];
      this.$router.push({
        path: arr[this.$route.query.type],
      });
    },
    reply(num) {
      this.$router.push({
        path: '/write',
        query: {
          type: num, // 1 回复 2 转发
        },
      });
    },
    showVisible() {
      this.visible = true;
    },
    async deleteHandleOk() {
      const params = {
        emailIds: this.emailDetail['_id'],
        mailType: this.emailDetail['mailType'],
      };
      try {
        const { code, msg, data } = await this.$api.email.deleteLetter(params);
        if (code === 200) {
          this.visible = false;
          this.$router.push({
            path: '/write',
          });
        } else {
          this.$message.error(msg || '删除失败！');
        }
      } catch (e) {
        console.log(e);
        this.$message.error('删除失败！');
      }
    },
    deleteHandleCancel() {
      this.visible = false;
    },
    choosePrefix(prefix) {
      if (['ppt', 'pptx'].includes(prefix)) {
        return ppt;
      } if (['doc', 'docx'].includes(prefix)) {
        return word;
      } if (['jpg', 'png'].includes(prefix)) {
        return img;
      } if (['xls', 'xlsx'].includes(prefix)) {
        return excel;
      } if (['pdf'].includes(prefix)) {
        return pdf;
      } if (['mp4'].includes(prefix)) {
        return video;
      } if (['zip'].includes(prefix)) {
        return zip;
      }
      return word;
    },
    downloadFile(item) {
      // window.open(url);
      console.log(item);
      const a = document.createElement('a'); // 创建隐藏的可下载链接
      a.download = item.fileName;
      a.style.display = 'none';
      const blob = new Blob([item.path]); // 字符内容转变成blob地址
      a.href = URL.createObjectURL(blob);
      document.body.appendChild(a);
      a.click(); // 触发点击
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    },
  },
};
</script>
<style lang="scss" scoped>
.receive-letter {
    width: 100%;
    min-height: calc(100vh - 90px);
    padding: 20px;
    background: #ffffff;
    .btn-wrapper {
        display: inline-block;
        margin-left: 10px;
    }
    section {
        margin-top: 28px;
        .letter-header {
            padding-bottom: 8px;
            border-bottom: 1px solid #E6E6E6;
            h1 {
                font-size: 20px;
                color: #313131;
                margin-bottom: 20px;
                word-break: break-all;
            }
            .letter-left {
                display: inline-block;
                width: 50px;
                text-align-last:justify;
            }
            .letter-person {
                display: inline-block;
                height: 22px;
                line-height: 20px;
                padding: 0 10px;
                background: #F3FAFF;
                border: 1px solid #A3C1E9;
                border-radius: 13px;
                font-size: 12px;
                margin-right: 10px;
            }
            .enclosure {
                display: flex;
                ul {
                    display: inline-block;
                    li {
                        display: inline-block;
                        font-weight: bold;
                        margin-bottom: 5px;
                        margin-right: 14px;
                        cursor: pointer;
                    }
                }
            }
        }
        .email-content {
            width: 100%;
            padding: 20px 10px;
            word-break: break-all;
            p {
                word-break: break-all
            }
        }
        .letter-footer {
            div {
                width: 200px;
                padding-bottom: 8px;
                border-bottom: 1px dashed #E6E6E6;
                span {
                    display: block;
                    font-size: 12px;
                    line-height: 21px;
                }
            }
            ul {
                padding: 11px 0;
                li {
                    font-size: 12px;
                    color: #000000;
                    line-height: 21px;
                }
            }
            p {
                padding: 0 10px;
                font-size: 12px;
                color: #919191;
                line-height: 18px;
            }
        }
    }
    /deep/ .el-button {
        width: 74px;
        height: 30px;
        line-height: 28px;
        padding: 0;
    }
}
</style>
