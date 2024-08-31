import { cn } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dispatch, useState } from "react";
import { ErrorToast, SuccessToast } from "./toasts";

import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/types";
import { FetchHelper } from "@/lib/fetchHelper";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
export function LoginPopUp() {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (location.pathname === "/dashboard") {
    return null;
  }
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Enter your login details</DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Login</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Login</DrawerTitle>
          <DrawerDescription>Enter your login details</DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  setOpen,
}: {
  className?: string;
  setOpen?: Dispatch<boolean>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { updateUser } = useUserStore();
  const navigate = useNavigate();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    setSubmitting(true);
    console.log(values);
    const data: User = await FetchHelper("auth/login", "POST", values);
    console.log(data);
    if (data) {
      SuccessToast({ message: "Login Successful" });
      updateUser(data);
      if (setOpen) {
        setOpen(false);
      }
      if (data.isSeller) navigate("/seller-dashboard");
      else navigate("/buyer-dashboard");
    } else {
      ErrorToast({ message: "Login Failed" });
    }
    setSubmitting(false);
  }
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...form.register("username")} />
        {form.formState.errors.username && (
          <p className="text-sm text-red-500">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" {...form.register("password")} />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Loging In..." : "Login"}
      </Button>
    </form>
  );
}
