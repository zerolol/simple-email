<template>
  <div class="write-letter">
      <header>
        <el-button type="primary" @click="sendLetter">
          <img src='@/assets/send_letter1.svg' alt="发送" width="14" height="14" style="vertical-align: middle;">
          发送
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </header>
      <section>
        <div>
          <span class="letter-left">收件人</span><span>：</span>
          <div class="border-wrapper">
            <div>
              <div v-if="receiver && receiver.length > 0" style="display: inline-block;">
                <div v-for="(item, index) in receiver" :key="item" class="letter-person">
                  <span class='ellipsis' :title="item">{{item}}</span>
                  <span class='line'></span>
                  <i class="el-icon-close" @click="deleteReceiver(index)"></i>
                </div>
              </div>
              <div class="search-wrapper">
                <input
                  type="text"
                  class="input-style"
                  ref="receiveRef"
                  v-model="receiveVal"
                  @change="receiveChange"
                  autoFocus="autofocus"
                >
              </div>

            </div>
          </div>
        </div>
        <div style="margin: 10px 0">
          <span class="letter-left">抄送人</span><span>：</span>
          <div class="border-wrapper">
            <div>
              <div v-if="copy && copy.length > 0" style="display: inline-block;">
                <div v-for="(item, index) in copy" :key="item" class="letter-person">
                  <span class='ellipsis' :title="item">{{item}}</span>
                  <span class='line'></span>
                  <i class="el-icon-close" @click="deleteCopy(index)"></i>
                </div>
              </div>
              <div class="search-wrapper">
                <input
                  type="text"
                  ref="copyRef"
                  v-model="copyVal"
                  class="input-style"
                  @change="copyChange"
                >
              </div>
            </div>
          </div>
        </div>
        <div>
          <span class="letter-left">主题</span><span>：</span>
          <div class="border-wrapper" style="height: 34px; lineHeight: 20px; paddingLeft: 10px">
            <input type="text" v-model="subject" class="topic" maxLength={50} >
          </div>
          <div class="add-paper">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-error="uploadError"
              :data="uploadData"
              accept=".ppt, .doc, .docx, .pdf, .xls, .xlsx, .mp4, .pptx, .jpg, .png, .jpeg, .gif, .zip, .txt">
              <img src='@/assets/annex.svg' alt="附件" style="marginRight: 8px; verticalAlign: middle; cursor: pointer" width="20" height="20">
              <span style="cursor: pointer;">添加附件</span>
            </el-upload>
            <ul class="files-wrapper" v-if="attachList.length > 0">
                <li :key="index" v-for="(item, index) in attachList">
                  <span>{{item.fileName}}</span><span @click="showDeleteFile(index)">删除</span>
                </li>
            </ul>
          </div>
        </div>
        <div style="marginTop: '13px'">
          <span class="letter-left">正文</span><span>：</span>
          <div class="editor-wrapper">
            <quill-editor @content="getContent"></quill-editor>
          </div>
        </div>
      </section>
      <el-dialog
        title="提示"
        :visible.sync="showFile"
        width="334"
        custom-class="delete-wrapper"
        >
        <p>是否删除该附件</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteHandleCancel">取 消</el-button>
          <el-button type="primary" @click="deleteHandleOk">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor.vue';

export default {
  name: 'Write',
  props: ['userInfo'],
  data() {
    return {
      receiver: [],
      receiveVal: '',
      copy: [],
      copyVal: '',
      attachList: [],
      type: '',
      showFile: false,
      emailDetailRe: {},
      content: '',
      subject: '',
      uploadUrl: 'http://upload-z2.qiniup.com',
      qiniuPath: 'http://qe4xceyd2.bkt.clouddn.com/',
      uploadData: { key: '', token: '' },
    };
  },
  components: {
    QuillEditor,
  },
  mounted() {
    this.type = this.$route.query.type;
    if (this.type !== undefined) {
      this.emailDetailRe = window.sessionStorage.getItem('emailDetail');
      this.emailDetailRe = JSON.parse(this.emailDetailRe);
      if (this.type === '1') { // 回复
        this.emailDetailRe.mailSubject = `re：${this.emailDetailRe.mailSubject}`;
      } else if (this.type === '2') {
        this.emailDetailRe.mailSubject = `转发：${this.emailDetailRe.mailSubject}`;
        this.attachList = this.emailDetailRe.attachList || [];
      }
      this.subject = this.emailDetailRe.mailSubject || '';
    } else {
      this.emailDetailRe = {};
      this.attachList = [];
    }
    this.getQiniuToken();
  },
  methods: {
    async sendLetter() {
      if (this.receiver.length === 0) {
        this.$message.error('请输入邮件收件人');
        return;
      }
      if (this.subject === '') {
        this.$message.error('请输入邮件主题');
        return;
      }
      if (this.content === '') {
        this.$message.error('请输入邮件正文');
        return;
      }
      const params = {
        mailSender: this.userInfo && this.userInfo.userName,
        mailPhone: this.userInfo && this.userInfo.phone,
        receiver: this.receiver.toString(),
        receiverCc: this.copy.toString(),
        subject: this.subject,
        content: this.content,
        attachList: this.attachList,
      };
      try {
        const { code, data, msg } = await this.$api.email.sendLetter(params);
        if (code === 200) {
          this.$router.push('/inbox');
        } else {
          this.$message.error(msg || '发送失败！');
        }
      } catch (e) {
        console.log(e);
        this.$message.error('发送失败！');
      }
    },
    async getQiniuToken() {
      try {
        const { code, data, msg } = await this.$api.email.getQiniuToken();
        if (code === 200) {
          this.uploadData.token = data.uploadToken;
        } else {
          this.$message.error(msg || '请求token失败！');
        }
      } catch (e) {
        console.log(e);
        this.$message.error('请求token失败！');
      }
    },
    cancel() {
      this.$router.push('/inbox');
    },
    receiveChange() {
      if ((/^1[0-9]{10}$/.test(this.receiveVal))) {
        this.receiver.push(`${this.receiveVal}@zy.com`);
        this.receiver = [...new Set(this.receiver)];
        this.receiveVal = '';
      } else {
        this.$message.error('请输入正确的邮箱账号！');
      }
    },
    deleteReceiver(num) {
      this.receiver.splice(num, 1);
    },
    copyChange() {
      if ((/^1[0-9]{10}$/.test(this.copyVal))) {
        this.copy.push(`${this.copyVal}@zy.com`);
        this.copy = [...new Set(this.copy)];
        this.copyVal = '';
      } else {
        this.$message.error('请输入正确的邮箱账号！');
      }
    },
    deleteCopy(num) {
      this.copy.splice(num, 1);
    },
    handleAvatarSuccess(res, file, fileList) {
      const { hash, key } = res;
      const s = this;
      const obj = {
        fileName: file.name,
        path: `${s.qiniuPath}/${key}`,
      };
      this.attachList.push(obj);
      this.$message.success('上传成功！');
    },
    uploadError(err, file, fileList) {
      this.$message({
        message: '上传出错，请重试！',
        type: 'error',
      });
    },
    toCheckFile(file) {
      const suffix = file.name.replace(/^.+\./, '').toLocaleLowerCase(); // 取得扩展名
      const size = file.size / 1024 / 1024; // 文件体积（MB）
      if (!['ppt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'mp4', 'txt', 'pptx', 'jpg', 'png', 'jpeg', 'zip', 'gif'].includes(suffix)) {
        this.$message({ type: 'warning', message: '上传文件仅限ppt、pdf、doc、txt、docx、xls、xlsx、mp4、pptx、jpg、png、jpeg、zip、gif格式' });
        return false;
      }
      if (suffix === 'mp4') {
        if (size > 100) {
          this.$message({ type: 'warning', message: '视频大小不能超过100MB!' });
          return false;
        }
      }
      if (['ppt', 'doc', 'docx', 'pdf', 'xls', 'xlsx'].includes(suffix)) {
        if (size > 20) {
          this.$message({ type: 'warning', message: '文件大小不能超过20MB!' });
          return false;
        }
      } else if (['jpg', 'png', 'jpeg', 'gif'].includes(suffix)) {
        if (size > 10) {
          this.$message({ type: 'warning', message: '图片大小不能超过10MB!' });
          return false;
        }
      } else if (['zip'].includes(suffix)) {
        if (size > 100) {
          this.$message({ type: 'warning', message: '压缩文件不能超过100MB!' });
          return false;
        }
      }
      return true;
    },
    beforeAvatarUpload(file) {
      if (!this.toCheckFile(file)) return false;
      this.uploadData.key = `upload_${new Date().getTime()}_${file.name}`;
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    deleteHandleCancel() {
      this.showFile = false;
    },
    deleteHandleOk() {
      this.attachList.splice(this.deleteIndex, 1);
      this.showFile = false;
    },
    getContent(value) {
      this.content = value;
    },
    showDeleteFile(index) {
      this.showFile = true;
      this.deleteIndex = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.write-letter {
    width: 100%;
    min-height: calc(100vh - 90px);
    padding: 20px 100px 20px 30px;
    background: #ffffff;
    section {
        margin-top: 28px;
        .letter-left {
            display: inline-block;
            width: 48px;
            text-align-last:justify;
        }
        .border-wrapper {
            display: inline-block;
            width: calc(100% - 64px);
            padding: 6px 8px 0 0;
            border: 1px solid #C6C6C6;
            border-radius: 2px;
            vertical-align: middle;
            .letter-person {
                display: inline-block;
                height: 22px;
                line-height: 20px;
                padding: 0 10px;
                margin-left: 8px;
                margin-bottom: 6px;
                background: #F3FAFF;
                border: 1px solid #A3C1E9;
                border-radius: 13px;
                font-size: 12px;
                span:first-child {
                    max-width: 200px;
                    display: inline-block;
                    vertical-align: middle;
                }
                .line {
                    display: inline-block;
                    width: 1px;
                    height: 20px;
                    margin: 0 4px;
                    border-left: 1px solid #A3C1E9;
                    vertical-align: top;
                }
                .el-icon-close {
                    cursor: pointer;
                    &:hover {
                        color: #A3C1E9;
                    }
                }
            }
            .input-style {
                width: 200px;
                height: 24px;
                margin: 0 0 6px 10px;
            }
            .topic {
                width: 100%;
            }
            .search-wrapper {
                display: inline-block;
                position: relative;
                ul {
                    position: absolute;
                    top: 24px;
                    left: 10px;
                    padding: 4px 0;
                    list-style-type: none;
                    background-color: #fff;
                    background-clip: padding-box;
                    border-radius: 2px;
                    outline: none;
                    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
                    z-index: 10;
                    li {
                        padding: 3px 12px;
                        color: #333333;
                        line-height: 20px;
                        white-space: nowrap;
                        transform: all 0.3s;
                        cursor: pointer;
                        &:hover {
                            background-color: #f5f5f5;
                        }
                    }
                }
            }
        }
        .add-paper {
            padding: 7px 0 7px 58px;
            // :global {
            //     .anticon-paper-clip {
            //         margin: 0 6px 0 4px;
            //         color: #919191;
            //     }
            // }
            span {
                color: #2577E3;
            }
            .files-wrapper {
                li {
                    line-height: 20px;
                }
                span:first-child {
                    font-size: 12px;
                    color: #313131;
                }
                span:last-child {
                    font-size: 12px;
                    color: #2577E3;
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
        }
        .editor-wrapper {
            position: relative;
            z-index: 10;
            display: inline-block;
            width: calc(100% - 64px);
            vertical-align: top;
        }
        input {
            border: none;
            outline: none; // 去除选中状态边框
            background-color: rgba(0, 0, 0, 0);// 透明背景
        }
    }
    /deep/ .el-button--primary {
        text-align: center;
        padding: 4px 10px;
        margin-right: 10px;
        vertical-align: top;
        & > .anticon + span {
            margin-left: 6px;
        }
    }
    /deep/ .el-button {
        width: 74px;
        height: 30px;
        line-height: 30px;
        padding: 0;
    }
}
</style>
