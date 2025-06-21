"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { TOAST_TYPES } from "@/src/enums";
import { IError } from "@/src/interfaces";
import PasswordInput from "@/src/shared/components/password-input";
import { Button } from "@/src/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/components/ui/form";
import { Input } from "@/src/shared/components/ui/input";
import { showToast } from "@/src/shared/lib/toast-utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { ILoginForm } from "../../interfaces";
import { loginSchema } from "../../schema";
import { login } from "../../services";

const LoginForm = () => {
  const form = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      showToast(TOAST_TYPES.success, data?.data?.message);
    },
    onError: (error: IError) => {
      error?.key.forEach((key) => {
        form.setError(key as "username" | "password", {
          message: error?.error,
        });
      });
    },
  });

  const onSubmit = (data: ILoginForm) => {
    loginMutation?.mutate(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          loading={loginMutation.isLoading}
          disabled={loginMutation.isLoading}
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
