<template>
  <div class="header">
    <h1 @click="$router.push('/')">
      YNOTE
    </h1>
    <div class="sys-buttons" v-if="!userInfo">
      <router-link to="/login">登录</router-link>
      <router-link to="/reg">注册</router-link>
    </div>
    <div class="sys-buttons" v-if="userInfo">
      <md-menu md-size="small" md-direction="bottom-start">
        <span class="name" md-menu-trigger>{{userInfo.name}}  <i class="iconfont icon-down-circle"></i></span>
        <md-menu-content>
          <md-menu-item @click="() => {$router.push('/changePwd')}">修改密码</md-menu-item>
          <md-menu-item>反馈</md-menu-item>
          <md-menu-item @click="logout">登出</md-menu-item>
        </md-menu-content>
      </md-menu>
      
      <!-- <a href="javascript:;" class="sys-buttons" @click="logout">登出</a> -->
    </div>
  </div>
</template>
<script type="text/javascript">
  /* eslint-disable */
  import Vue from 'vue'
  import {mapState, mapActions} from 'vuex'
  import {logout} from './../api/user'
  import {MdMenu, MdList} from 'vue-material/dist/components'
  Vue.use(MdMenu)
  Vue.use(MdList)
  export default {
    data () {
      return {}
    },
    computed: mapState(['userInfo']),
    methods: {
      ...mapActions(['updUserInfo']),
      /* 登出 */
      logout () {
        logout().then(result => {
          this.updUserInfo(true)
          this.$router.push('/login')
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @height: 50px;
  .header {
    min-height: @height;
    max-height: @height;
    height: @height;
    line-height: @height;
    width: 100%;
    background: #fff;
    text-align: left;
    border-bottom: 1px solid #ccc;
    h1 {
      height: 100%;
      padding: 0;
      margin: 0;
      margin-left: 20px;
      line-height: @height;
      display: inline-block;
    }
    img {
      height: 50%;
      margin: 5px 0 0 10px;
      transform: rotate(120deg);
    }
    .sys-buttons {
      float: right;
      height: @height;
      line-height: @height;
      padding-right: 20px;
      a {
        font-size: 12px;
        margin-left: 10px;
        color: cornflowerblue;
      }
    }
    .dropdown-link {
      color: black;
    }
  }
</style>