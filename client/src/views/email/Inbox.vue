<template>
  <div class="inbox">
        <header>
          <el-button type="primary">
            <el-checkbox @change="onAllChange" v-model="checkAll"></el-checkbox>
            全选
          </el-button>
          <el-button @click="showModal">{{ type === '2' ? "彻底删除" : "删除" }}</el-button>
          <el-button icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </header>
        <section v-if="emailList.length > 0">
          <span v-if="type === '0' && num > 0" class="tip">有{{num}}封未读</span>
          <table>
            <tbody>
                <tr v-for="(item, index) in emailList" :key="index" @click="goDetail(item)">
                  <td class="select">
                    <div style="display: inline-block;" @click.stop="">
                      <el-checkbox @change="onChange(item)" v-model="item.isChecked"></el-checkbox>
                    </div>
                    <div style="display: inline-block; margin: 0 8.5px 0 20px; width: 14px">
                        <img v-if="type !== '1' && item.mailStatus === 0" src="@/assets/inbox1.svg" alt="信件" style="verticalAlign: middle" width="18">
                        <img v-if="type === '1'" src="@/assets/send_letter2.svg" alt="信件" style="verticalAlign: middle" width="18">
                    </div>
                    <img v-if="item.attachList.length > 0" src="@/assets/annex.svg" alt="附件" style="verticalAlign: middle" width="16" height="16">
                  </td>
                  <td class="ellipsis" :title="item.mailReceiver">
                    <span :style="{fontWeight: item.mailStatus === 0 ? 'bold' : 'normal'}">{{type === '1' ? item.mailReceiver : item.mailSender}}</span>
                  </td>
                  <td class="ellipsis" :title="item.mailSubject">
                    <span :style="{fontWeight: item.mailStatus === 0 ? 'bold' : 'normal'}">{{item.mailSubject}}</span>
                  </td>
                  <td>
                    <span>{{item.sendTime}}</span>
                  </td>
                </tr>
            </tbody>
          </table>
          <el-pagination
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :page-size="10"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, prev, pager, next, sizes, jumper"
            :total="total">
          </el-pagination>
        </section>
        <div class="default" v-else>
          <no-data></no-data>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="visible"
            width="334"
            custom-class="delete-wrapper"
            :before-close="deleteHandleCancel"
            >
            <p>{{type === '2' ? '是否彻底删除选中的邮件' : '是否删除选中的邮件'}}?</p>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteHandleOk">是</el-button>
            <el-button type="primary" @click="deleteHandleCancel">否</el-button>
            </span>
        </el-dialog>
      </div>
</template>

<script>
import NoData from '@/components/NoData.vue';
import { mapState } from 'vuex';
import { formatDate } from '@/utils/utils';

export default {
  name: 'Inbox',
  data() {
    return {
      visible: false,
      checkAll: false,
      checkIds: [],
      timer: null,
      type: '0',
      emailList: [],
      num: '',
      page: 1,
      pageSize: 10,
      total: 0,
    };
  },
  components: {
    NoData,
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {
    $route(to, from) {
      const obj = {
        '/inbox': '0',
        '/send': '1',
        '/delete': '2',
      };
      const { path } = this.$route;
      this.type = obj[path];
      this.getData();
    },
  },
  methods: {
    onAllChange(e) {
      this.checkIds = [];
      if (this.checkAll) {
        this.emailList.forEach((item) => {
          item.isChecked = true;
          this.checkIds.push(item['_id']);
        });
      } else {
        this.emailList.forEach((item) => {
          item.isChecked = false;
        });
      }
    },
    showModal() {
      if (this.checkIds.length === 0) {
        this.$message.info('请先选中要删除的邮件！');
        return;
      }
      this.visible = true;
    },
    refresh() {
      this.getData();
    },
    async getData() {
      const params = {
        mailPhone: this.user && this.user.phone,
        page: this.page,
        pageSize: this.pageSize,
        mailType: this.type,
      };
      try {
        const {
          code, msg, data, total,
        } = await this.$api.email.getInbox(params);
        this.emailList = [];
        this.num = 0;
        if (code === 200) {
          if (data && data.length > 0) {
            data.forEach((item) => {
              item.sendTime = formatDate(item.sendDate);
              item.isChecked = false;
              if (item.mailStatus === 0) {
                this.num += 1;
              }
              this.emailList.push(item);
            });
          }
          this.total = total;
        } else {
          this.$message.error(msg || '查询失败！');
        }
      } catch (e) {
        console.log(e);
      }
    },
    onChange(obj) {
      const { id } = obj;
      this.checkIds = [];
      this.emailList.forEach((item) => {
        if (item.isChecked) {
          this.checkIds.push(item['_id']);
        }
      });
      this.checkAll = this.emailList.every((item) => item.isChecked);
    },
    async deleteHandleOk() {
      const params = {
        emailIds: this.checkIds.toString(),
        mailType: this.type,
      };
      try {
        const { code, msg, data } = await this.$api.email.deleteLetter(params);
        if (code === 200) {
          this.visible = false;
          this.checkAll = false;
          this.$message.success(msg || '删除成功！');
          this.getData();
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
    goDetail(item) {
      this.$router.push({
        path: '/receive',
        query: {
          emailId: item['_id'],
          mailStatus: item.mailStatus,
          type: this.type,
        },
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
  },
  mounted() {
    const obj = {
      '/inbox': '0',
      '/send': '1',
      '/delete': '2',
    };
    const { path } = this.$route;
    this.type = obj[path];
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
.inbox {
    width: 100%;
    padding: 20px;
    background: #ffffff;
    border-radius: 4px;
    header {
        padding-left: 10px;
        margin-bottom: 20px;
        /deep/ .el-button--primary {
            text-align: left;
        }
        /deep/ .el-button {
            margin-right: 10px;
            text-align: center;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    section {
        height: calc(100vh - 180px);
        overflow: auto;
        .tip {
            display: inline-block;
            padding-left: 10px;
            font-size: 12px;
            color: #2577e3;
            margin-bottom: 7.5px;
        }
        table {
            width: 100%;
            color: #313131;
            margin-bottom: 20px;
            tr {
                border-top: 1px solid #E6E6E6;
                height: 41px;
                line-height: 40px;
                cursor: pointer;
                .select {
                    width: 95px;
                    padding-left: 20px;
                }
                &:hover {
                    background: #FFF9F1;
                }
                td {
                    &:not(:first-child) {
                        padding-right: 20px;
                    }
                    &:last-child {
                        text-align: right;
                        font-size: 12px;
                        color: #C6C6C6;
                    }
                }
            }
        }
    }
    .default {
        width: 100%;
        height: calc(100vh - 200px);
    }
    /deep/ .el-button {
        width: 74px;
        height: 30px;
        line-height: 28px;
        padding: 0;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #ffffff;
      &::after {
        border-color: #007fff;
      }
    }
}
</style>
