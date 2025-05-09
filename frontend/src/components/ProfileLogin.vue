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
const errorMsg = ref('');

const schema = Yup.object().shape({
  email: Yup.string().email('不正确的电子邮件格式。').required('您必须填写此字段。'),
  password: Yup.string().required('您必须填写此字段。')
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (formValues: Record<string, any>) => {
  try {
    await userStore.login(formValues as LoginForm).then(() => {
      errorMsg.value = '';
      router.push('/');
    });
  } catch (e) {
    errorMsg.value = e as string;
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
        请登录。
      </h1>
      <p v-if="errorMsg">
        <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span class="inline w-3 h-3 me-3 bg-red-500 rounded-full"></span>
          {{ errorMsg }}</span
        >
      </p>
      <Form @submit="onSubmit" :validation-schema="schema" class="space-y-4 md:space-y-6">
        <div>
          <FormInput name="email" type="email" label="您的电子邮件。" />
        </div>
        <div>
          <FormInput name="password" type="password" label="密码" />
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >忘记密码了？</a
            >
          </div>
        </div>
        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          登录
        </button>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          您还没有账户吗？
          <a
            href="/register"
            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >创建一个吧</a
          >
        </p>
      </Form>
    </div>
  </div>
</template>

<style scoped></style>
