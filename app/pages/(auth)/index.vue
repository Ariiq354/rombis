<script setup lang="ts">
  import type { FormSubmitEvent } from '#ui/types';
  import { z } from 'zod';

  definePageMeta({
    layout: 'auth',
  });

  const user = useUser();

  if (user.value) {
    await navigateTo('/dashboard');
  }

  const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(8, 'Must be at least 8 characters'),
  });

  type Schema = z.output<typeof loginSchema>;

  const state = reactive({
    username: undefined,
    password: undefined,
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      await $fetch('/api/login', {
        method: 'POST',
        body: event.data,
      });
      await navigateTo('/dashboard');
    } catch (error: any) {
      useToastError(error.statusCode, error.statusMessage);
    }
  }
</script>

<template>
  <UCard class="w-full max-w-md bg-white">
    <UForm :schema="loginSchema" :state="state" class="w-full space-y-4" @submit="onSubmit">
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">Log in</h1>
        <p>Please enter your details</p>
      </div>
      <UFormGroup label="Username" name="username">
        <UInput
          icon="i-heroicons-user"
          :leading="true"
          v-model="state.username"
          placeholder="Username"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          icon="i-heroicons-lock-closed"
          :leading="true"
          v-model="state.password"
          type="password"
          placeholder="Password"
        />
      </UFormGroup>

      <div class="flex w-full justify-between">
        <UCheckbox label="Remember me" />
        <NuxtLink
          class="cursor-pointer text-sm transition-colors duration-300 hover:text-green-500"
        >
          Reset Password
        </NuxtLink>
      </div>

      <UButton class="flex w-full justify-center" type="submit"> Submit </UButton>
    </UForm>
  </UCard>
</template>

<style scoped></style>
