<template>
  <div class="page-reg">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">注册用户</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-content>
          <!-- 用户名 -->
          <md-field :class="getValidationClass('username')">
            <label for="username">用户名</label>
            <md-input name="username" id="username" v-model="form.username" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.username.required">用户名为必填项</span>
            <span class="md-error" v-else-if="!$v.form.username.minlength || !$v.form.username.maxlength">用户名长度3-15，字母开头，可包含字母数字下划线</span>
          </md-field>
          <!-- 姓名 -->
          <md-field :class="getValidationClass('name')">
            <label for="name">姓名</label>
            <md-input name="name" id="name" v-model="form.name" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.name.required">姓名为必填项</span>
            <span class="md-error" v-else-if="!$v.form.name.maxlength">姓名最长为30</span>
          </md-field>
          <!-- 密码 -->
          <md-field :class="getValidationClass('password')">
            <label for="password">密码</label>
            <md-input name="password" id="password" type="password" v-model="form.password" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.password.required">密码为必填项</span>
            <span class="md-error" v-else-if="!$v.form.password.minlength || !$v.form.password.maxlength">密码长度3-15，请牢记</span>
          </md-field>
          <!-- 性别 -->
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('sex')">
                <label for="sex">性别</label>
                <md-select name="sex" id="sex" v-model="form.sex" md-dense :disabled="sending">
                  <md-option value="保密">保密</md-option>
                  <md-option value="男">男</md-option>
                  <md-option value="女">女</md-option>
                </md-select>
                <span class="md-error"></span>
              </md-field>
            </div>
          </div>
          <!-- EMAIL -->
          <md-field :class="getValidationClass('email')">
            <label for="email">邮箱</label>
            <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.email.required">邮箱为必填项</span>
            <span class="md-error" v-else-if="!$v.form.email.email">非法的邮箱格式！示例 my_email@163.com</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button class="md-dense md-primary" href="/login">已注册？去登录</md-button>
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">提交注册</md-button>
        </md-card-actions>
      </md-card>

      <md-snackbar :md-active.sync="userSaved">{{lastUser}}</md-snackbar>
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
  import VueMaterial from 'vue-material'
  // api
  import {regNewuser} from '@/api/user'
  Vue.use(VueMaterial)

  export default {
    name: 'reg',
    mixins: [validationMixin],
    data: () => ({
      form: {
        username: null,
        name: null,
        password: null,
        sex: null,
        email: null,
      },
      userSaved: false,
      sending: false,
      lastUser: null
    }),
    validations: {
      form: {
        username: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(15)
        },
        name: {
          required,
          maxLength: maxLength(30)
        },
        password: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(15)
        },
        email: {
          required,
          email
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
      clearForm () {
        this.$v.$reset()
        this.form.username = null
        this.form.password = null
        this.form.name = null
        this.form.sex = null
        this.form.email = null
      },
      saveUser () {
        this.sending = true
        regNewuser(this.form).then(result => {
          let {data} = result
          if (!data.err) {
            this.lastUser = `用户名：${this.form.username} 姓名：${this.form.name} 已成功注册，即将跳转到登录！`
            setTimeout(() => {
              this.$router.push('/login')
            }, 3000)
          } else {
            this.lastUser = `用户名重复，注册失败！`
          }
          this.userSaved = true
          this.sending = false
          this.clearForm()
        })
        // Instead of this timeout, here you can call your API
        // window.setTimeout(() => {
        //   this.lastUser = `${this.form.username} ${this.form.lastName}`
        //   this.userSaved = true
        //   this.sending = false
        //   this.clearForm()
        // }, 1500)
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.saveUser()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .page-reg{
    width: 500px;
    margin: 20px auto;
  }
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>