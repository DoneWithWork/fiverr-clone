import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { useNavigate } from "react-router-dom";

import { ErrorToast, SuccessToast } from "./toasts";
import { FetchHelper } from "@/lib/fetchHelper";
import { Label } from "./ui/label";

const registerSchema = z.object({
  username: z.string().min(2, {
    message: "Must be more than two characters",
  }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  country: z.string().min(2, { message: "Must be more than two characters" }),

  isSeller: z.boolean().default(false),
  phone: z
    .string()
    .min(2, { message: "Must be more than two characters" })
    .optional(),
  description: z
    .string()
    .min(2, { message: "Must be more than two characters" })
    .optional(),
});

export default function RegisterForm() {
  // 1. Define your form.

  const [file, SetFile] = useState<File>();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isSeller: false,
      country: "",
      phone: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setSubmitting(true);
      console.log(values);
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage(file || new File([], ""));
        if (!imageUrl) return ErrorToast({ message: "Failed to upload image" });
      }

      const data = { ...values, imageUrl };

      await RegisterUser(data);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  async function RegisterUser(data: z.infer<typeof registerSchema>) {
    const resData = await FetchHelper(`auth/register`, "POST", data);
    if (resData) {
      SuccessToast({ message: "Account created successfully" });
      navigate("/");
    } else {
      ErrorToast({ message: "Failed to create account" });
    }
  }
  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "fiverr-clone");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dy3m3phmg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const responseData = await res.json();
      console.log(responseData);
      const { url } = responseData;
      return url;
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };
  return (
    <div className="container py-2">
      <h1 className="text-2xl py-5">Register New Account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="gap-10 grid grid-cols-1 md:grid-cols-2 mx-auto">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
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
                      <Input placeholder="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label>Profile Picture</Label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      SetFile(file);
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl">Become A Seller</h1>
              <FormField
                control={form.control}
                name="isSeller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-10">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Become A Seller
                      </FormLabel>
                      <FormDescription>
                        Provide additional information to become a seller
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div
                className={`${
                  form.getValues("isSeller") === true
                    ? "opacity-100"
                    : "opacity-50"
                } transition-opacity`}
              >
                <FormField
                  disabled={form.getValues("isSeller") === false}
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={form.getValues("isSeller") === false}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-48" disabled={submitting}>
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}
