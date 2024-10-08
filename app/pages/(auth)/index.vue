<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { z } from "zod";

  definePageMeta({
    layout: "auth",
  });

  const user = useUser();

  if (user.value) {
    await navigateTo("/dashboard");
  }

  const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(8, "Harus terdiri dari setidaknya 8 karakter."),
  });

  type Schema = z.output<typeof loginSchema>;

  const state = reactive({
    username: undefined,
    password: undefined,
    rememberMe: false,
  });

  const isLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      isLoading.value = true;
      await $fetch("/api/auth/login", {
        method: "POST",
        body: event.data,
      });
      await navigateTo("/dashboard");
      isLoading.value = false;
    } catch (error: any) {
      useToastError(error.statusCode, error.statusMessage);
      isLoading.value = false;
    }
  }
</script>

<template>
  <UCard class="w-full max-w-md bg-white">
    <UForm
      :schema="loginSchema"
      :state="state"
      class="w-full space-y-4"
      @submit="onSubmit"
    >
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">Masuk</h1>
        <p>Silakan masukkan detail Anda.</p>
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
        <UCheckbox label="Ingat Saya" v-model="state.rememberMe" />
      </div>

      <UButton
        class="flex w-full justify-center"
        type="submit"
        :loading="isLoading"
      >
        Submit
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped></style>
