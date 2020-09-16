<template>
  <div class="menu-left">
      <div class="letter-wrapper">
        <div class="letter-status" @click="goRouter('./inbox')">
          <div class="letter-collect letter-base" :class="{'letter-collect1': ['/inbox', '/send', '/delete'].includes($route.path)}">
              收信
          </div>
        </div>
        <div class="letter-status" @click="goRouter('./write')">
          <div class="letter-write letter-base" :class="{'letter-write1': $route.path === '/write'}">
              写邮件
          </div>
        </div>
      </div>
      <ul>
        <li v-for="(item, index) in menus" :key="index">
          <router-link :to="item.path" class="menu-link" >
            <img :src="item.src" alt="#" style="marginRight: 17px; vertical-align: -1px;" width="14" height="14">
            {{item.name}}
          </Router-link>
        </li>
      </ul>
    </div>
</template>

<script>
import inbox2 from '@/assets/inbox.svg';
import sendLetter1 from '@/assets/send_letter1.svg';
import deleteLetter from '@/assets/delete_letter.svg';

export default {
  name: 'MenuLeft',
  data() {
    return {
      menus: [
        { path: '/inbox', name: '收件箱', src: inbox2 },
        { path: '/send', name: '已发送', src: sendLetter1 },
        { path: '/delete', name: '已删除', src: deleteLetter },
      ],
    };
  },
  methods: {
    goRouter(path) {
      this.$router.push({ path });
    },
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
.menu-left {
  width: 100%;
  .letter-wrapper {
      padding-left: 24px;
      margin-bottom: 30px;
      .letter-status {
          display: inline-block;
          .letter-collect {
              margin-right: 10px;
              &::before {
                  display: inline-block;
                  content: '';
                  width: 18px;
                  height: 18px;
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                  background-image: url('../../assets/receive_letter1.svg');
                  vertical-align: sub;
              }
          }
          .letter-collect1 {
              color: #FFFFFF;
              background: #2577E3;
              &::before {
                  background-image: url('../../assets/receive_letter2.svg');
              }
          }
          .letter-write {
              &::before {
                  display: inline-block;
                  content: '';
                  width: 13px;
                  height: 13px;
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                  background-image: url('../../assets/write_letter1.svg');
              }
          }
          .letter-write1 {
              color: #FFFFFF;
              background: #2577E3;
              &::before {
                  background-image: url('../../assets/write_letter2.svg');
              }
          }
          &:hover {
              .letter-base {
                  color: #FFFFFF;
                  background: #2577E3;
              }
              .letter-collect {
                  &::before {
                      background-image: url('../../assets/receive_letter2.svg');
                  }
              }
              .letter-write {
                  &::before {
                      background-image: url('../../assets/write_letter2.svg');
                  }
              }
          }
      }
      .letter-base {
          display: inline-block;
          width: 78px;
          height: 32px;
          padding-left: 8px;
          line-height: 30px;
          background: #FFFFFF;
          color: #2577E3;
          border: 1px solid #FFFFFF;
          border-radius: 4px;
          text-align: left;
          cursor: pointer;

      }
  }
  ul {
      li {
          position: relative;
          width: 100%;
          height: 54px;
          line-height: 54px;
          cursor: pointer;
          .menu-link {
              display: inline-block;
              width: 100%;
              padding-left: 43px;
              color: #FFFFFF;
              font-size: 16px;
              &:hover {
                position: relative;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.1);
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #FFB000;
                }
              }
          }
      }
      li:not(:last-child) {
          &:after {
              position: absolute;
              content: '';
              left: 16px;
              bottom: 0;
              width: 182px;
              height: 1px;
              background: linear-gradient(to right, #2577E3, #FFFFFF, #2577E3);
          }
      }

  }
  .router-link-active {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: #FFB000;
    }
  }
}
</style>
