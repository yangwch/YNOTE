<template>
  <div class="header">
    <h1>
      <img src="../assets/logo.png" alt=""/> YNOTE
    </h1>
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
  @height: 60px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
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
      line-height: @height;
      display: inline-block;
    }
    img {
      height: 40%;
      margin: 5px 0 0 10px;
    }
  }
</style>