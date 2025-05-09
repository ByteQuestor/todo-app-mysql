<script setup lang="ts">
import { ref } from 'vue';
import type { TodoForm } from '@/shared/interfaces';
import { useTodo } from '@/shared/stores';
import FormDatePicker from '@/components/forms/FormDatePicker.vue';
import FormEditor from '@/components/forms/FormEditor.vue';

const todoStore = useTodo();
const text = ref('');
const date = ref('');
const errorMsg = ref('');
const errorDate = ref(false);
const errorText = ref(false);

const onSubmit = async (formValue: { date: string; text: string }) => {
  try {
    if (!formValue.date || !formValue.text) {
      errorMsg.value = '请填写所有字段。';
      errorDate.value = false;
      errorText.value = false;
      if (!formValue.date) {
        errorDate.value = true;
      }
      if (!formValue.text) {
        errorText.value = true;
      }
      return;
    }
    const todoForm: TodoForm = { date: new Date(formValue.date), text: formValue.text as string };
    await todoStore.createTodo(todoForm).then(() => {
      errorMsg.value = '';
      errorDate.value = false;
      errorText.value = false;
      text.value = '';
      date.value = '';
    });
  } catch (e) {
    errorMsg.value = (e as { error: string }).error || '发生了一个错误。';
  }
};
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h2
        class="mt-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        新任务
      </h2>
      <p v-if="errorMsg">
        <span class="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span class="inline w-3 h-3 me-3 bg-red-500 rounded-full"></span>
          {{ errorMsg }}</span
        >
      </p>
      <div class="space-y-4 md:space-y-6">
        <FormDatePicker
          v-model="date"
          mode="date"
          name="date"
          :error="errorDate"
          placeholder="点击选择时间"
        />
        <FormEditor v-model="text" :error="errorText" placeholder="任务详情 ..." />
        <button
          type="submit"
          @click="onSubmit({ date: date, text: text })"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          添加任务
        </button>
      </div>
    </div>
  </div>
</template>
