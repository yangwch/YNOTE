<template>
  <div class="page-changePwd">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-100">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">修改密码</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-content>
          <!-- 密码 -->
          <md-field :class="getValidationClass('password')">
            <label for="password">密码</label>
            <md-input name="password" type="password" id="password" v-model="form.password" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.password.required">密码为必填项</span>
          </md-field>
          <!-- 新密码 -->
          <md-field :class="getValidationClass('newpassword')">
            <label for="newpassword">新密码</label>
            <md-input name="newpassword" type="password" id="newpassword" v-model="form.newpassword" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.newpassword.required">新密码为必填项</span>
          </md-field>
          <!-- 重复密码 -->
          <md-field :class="getValidationClass('confirmpassword')">
            <label for="confirmpassword">重复密码</label>
            <md-input name="confirmpassword" type="password" id="confirmpassword" v-model="form.confirmpassword" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.confirmpassword.sameAs">两次输入不一致</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">提交</md-button>
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
    sameAs
  } from 'vuelidate/lib/validators'
  import {changePwd} from './../api/user'
  import VueMaterial from 'vue-material'
  Vue.use(VueMaterial)
  export default {
    name: 'changePwd',
    mixins: [validationMixin],
    data: () => ({
      form: {
        password: null,
        newpassword: null,
        confirmpassword: null
      },
      userSaved: false,
      sending: false,
      message: null
    }),
    validations: {
      form: {
        password: {
          required
        },
        newpassword: {
          required
        },
        confirmpassword: {
          sameAs: sameAs('newpassword')
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
        changePwd(this.form).then(result => {
          let {data} = result
          if (data.err) {
            this.message = '修改失败！'
          } else {
            this.message = '修改成功，正在为您跳转。。。'
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
  .page-changePwd{
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
