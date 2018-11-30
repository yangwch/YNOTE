<template>
  <div class="header">
    <h1>
      YNOTE
    </h1>
    <div class="sys-buttons" v-if="!userInfo">
      <router-link to="/login">登录</router-link>
      <router-link to="/reg">注册</router-link>
    </div>
    <div class="sys-buttons" v-if="userInfo">
      <span class="name">{{userInfo.name}}</span>
      <a href="javascript:;" class="sys-buttons" @click="logout">登出</a>
    </div>
  </div>
</template>
<script type="text/javascript">
  /* eslint-disable */
  import {mapState, mapActions} from 'vuex'
  import {logout} from './../api/user'
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
  }
</style>