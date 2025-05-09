<script setup lang="ts">
import * as Yup from 'yup';
import { Form } from 'vee-validate';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import { useUser } from '@/shared/stores';
import type { LoginForm } from '@/shared/interfaces';
import FormInput from '@/components/forms/FormInput.vue';

const router = useRouter();
const userStore = useUser();
const loading = ref(false);
const errorMsg = ref('');

// form validation rules
const schema = Yup.object().shape({
  email: Yup.string().email('电子邮件格式不正确').required('您必须填写这个字段'),
  password: Yup.string()
    .min(8, '密码必须至少有 8 个字符')
    .required('您必须填写这个字段'),
  confirmation: Yup.string()
    .required('您必须填写这个字段')
    .oneOf([Yup.ref('password')], '密码不一致')
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (formValues: Record<string, any>) => {
  loading.value = true;
  delete formValues.confirmation;
  try {
    await userStore.createUser(formValues as LoginForm).then(() => {
      errorMsg.value = '';
      loading.value = false;
      router.push('/login');
    });
  } catch (e) {
    errorMsg.value = (e as { error: string }).error || 'An error occurred';
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1
        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        创建您的账户
      </h1>
      <p v-if="errorMsg">
        <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span class="inline w-3 h-3 me-3 bg-red-500 rounded-full"></span>
          {{ errorMsg }}</span
        >
      </p>
      <Form @submit="onSubmit" :validation-schema="schema" class="space-y-4 md:space-y-6">
        <div>
          <FormInput name="email" type="email" label="您的电子邮件" />
        </div>
        <div>
          <FormInput name="password" type="password" label="密码" />
        </div>
        <div>
          <FormInput name="confirmation" type="password" label="确认您的密码" />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          创建一个账户
        </button>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          您已经有一个账户了吗？
          <a
            href="/login"
            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >去登录</a
          >
        </p>
      </Form>
    </div>
  </div>
</template>

<style scoped></style>
