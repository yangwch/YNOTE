<template>
  <div class="page-reg">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">登录</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-content>
          <!-- 用户名 -->
          <md-field :class="getValidationClass('username')">
            <label for="username">用户名</label>
            <md-input name="username" id="username" v-model="form.username" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.username.required">用户名为必填项</span>
            <span class="md-error" v-else-if="!$v.form.username.minlength || !$v.form.username.maxlength">请输入合法的用户名</span>
          </md-field>
          <!-- 密码 -->
          <md-field :class="getValidationClass('password')">
            <label for="password">密码</label>
            <md-input name="password" type="password" id="password" v-model="form.password" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.password.required">密码为必填项</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button class="md-dense md-primary" href="/reg">没账号？去注册</md-button>
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">登录</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">{{message}}</md-snackbar>
    </form>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { validationMixin } from 'vuelidate'
  import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'
  import {login} from './../api/user'
  import VueMaterial from 'vue-material'
  Vue.use(VueMaterial)
  // import {MdCard, MdCardHeader, MdCardHeaderText, MdCardContent, MdField, MdInput, MdProgressBar, MdCardActions, MdButton, MdSnackbar} from 'vue-material/dist/components'
  // // 按需要引入 vue-material 组件
  // let comps = [MdCard, MdCardHeader, MdCardHeaderText, MdCardContent, MdField, MdInput, MdProgressBar, MdCardActions, MdButton, MdSnackbar]
  // for (var i = comps.length - 1; i >= 0; i--) {
  //   comps[i] && Vue.use(comps[i])
  // }

  export default {
    name: 'reg',
    mixins: [validationMixin],
    data: () => ({
      form: {
        username: null,
        password: null
      },
      userSaved: false,
      sending: false,
      message: null
    }),
    validations: {
      form: {
        username: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(15)
        },
        password: {
          required
        }
      }
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      loginSys () {
        this.sending = true
        login(this.form).then(result => {
          let {data} = result
          if (data.err) {
            this.message = '用户名或密码错误！'
          } else {
            this.message = '登录成功，正在为您跳转。。。'
            setTimeout(() => {
              this.$router.replace('/')
            }, 2000)
          }
          this.userSaved = true
          this.sending = false
        })
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.loginSys()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .page-reg{
    min-width: 300px;
    max-width: 550px;
    width: 40%;
    margin: 20px auto;
  }
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>