<template>
  <div class="header">
    <h1>
      <!-- <img src="../assets/logo.png" alt=""/> --> YNOTE
    </h1>
    <div class="sys-buttons">
      <router-link class="sys-buttons" to="/login">登录</router-link>
      <router-link class="sys-buttons" to="/reg">注册</router-link>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {}
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
        font-size: 16px;
      }
    }
  }
</style>