import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ErrorToast, SuccessToast } from "./toasts";
import { FetchHelper, uploadImage } from "@/lib/fetchHelper";
import { useNavigate } from "react-router-dom";
const NewGigSchema = z.object({
  title: z.string().min(2, {
    message: "Must be more than two characters",
  }),
  category: z.enum([
    "Graphics & Design",
    "Digital Marketing",
    "Writing",
    "Video & Animation",
    "Music & Audio",
    "Programming & Tech",
    "Business",
    "Lifestyle",
  ]),

  description: z.string().min(2, {
    message: "Must be more than two characters",
  }),
  price: z.coerce.number().min(5, { message: "Price must be at least $5" }),
  deliveryTime: z.coerce
    .number()

    .min(1, { message: "Delivery time must be at least 1 day" }),
  revisions: z.coerce.number().default(0),
  features: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export default function NewGig() {
  const [converImage, setCoverImage] = useState<File>();
  const [images, setImages] = useState<File[]>();
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [addFeature, setAddFeature] = useState<boolean>(false);
  const [feature, setFeature] = useState<string>("");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof NewGigSchema>>({
    resolver: zodResolver(NewGigSchema),
    //repopulate the fields if it is a draft
    defaultValues: {
      title: "",
      category: "Graphics & Design",
      description: "",
      price: 5,
      deliveryTime: 1,
      revisions: 0,
      published: false,

      //allow to edit and save the feature
      //allow to save draft  nad publish if all params met
      features: [],
    },
  });
  useEffect(() => {
    const deliveryTime = form.watch("deliveryTime");
    if (deliveryTime >= 1) {
      const currentDate = new Date();
      const dueDate = new Date(currentDate.getTime() + deliveryTime * 86400000);
      setDeliveryDate(
        dueDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
    }
  }, [form]);
  async function onSubmit(data: z.infer<typeof NewGigSchema>) {
    //get public urls for all images
    //get url of cover image
    const url = converImage && (await uploadImage(converImage!));
    const imageUrls = images && (await Promise.all(images.map(uploadImage)));
    const values = { coverImage: url, images: imageUrls, ...data };
    const response = await FetchHelper("gigs/newgig", "POST", values);
    if (response) {
      SuccessToast({ message: "Gig created successfully" });
      navigate(`/gig/${response._id}`);
    } else {
      ErrorToast({ message: "Failed to create gig" });
    }
    console.log(values);
  }
  return (
    <div className="container max-w-[1200px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NewGigSchema.shape.category._def.values.map(
                          (value) => (
                            <SelectItem value={value}>{value}</SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Cover Image</Label>
                <Input
                  id="coverImage"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCoverImage(file);
                    }
                  }}
                ></Input>
                {converImage && (
                  <img
                    className="w-10 h-10"
                    src={`${URL.createObjectURL(converImage)}`}
                  ></img>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gig Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImages(files);
                  }}
                ></Input>
                <div className="flex flex-row gap-5 flex-wrap">
                  {images?.map((image) => (
                    <img
                      className="w-20"
                      src={`${URL.createObjectURL(image)}`}
                    ></img>
                  ))}
                </div>
              </div>
              {/* <Button
                type="submit"
               
              >
                Save Gig As Draft
              </Button> */}
            </div>
            <div>
              <FormField
                control={form.control}
                name="revisions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revisions</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Time (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {deliveryDate && (
                <p>
                  Delivery Date will be on{" "}
                  <span className="text-md font-semibold">{deliveryDate}</span>
                </p>
              )}
            </div>
          </div>
          <div>
            {addFeature ? (
              <p>Add a feature</p>
            ) : (
              <Button type="button" onClick={() => setAddFeature(true)}>
                Add Feature
              </Button>
            )}
            {addFeature && (
              <div>
                <Input
                  type="text"
                  className="  "
                  placeholder="Feature"
                  id="feature"
                  onChange={(e) => setFeature(e.target.value)}
                ></Input>
                <Button
                  type="button"
                  onClick={() => {
                    if (feature.length < 2) {
                      ErrorToast({
                        message: "Feature must be more than 2 characters",
                      });
                      return;
                    }
                    form.setValue("features", [
                      ...(form.getValues().features ?? []),
                      feature,
                    ]);
                    setFeature("");
                    setAddFeature(false);
                  }}
                >
                  Add Feature
                </Button>
                <Button
                  onClick={() => setAddFeature(false)}
                  size={"sm"}
                  variant={"destructive"}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {form.getValues().features?.map((feature, index) => (
            <div key={index} className="flex flex-row items-center gap-10">
              <p className="flex-1">{feature}</p>
              <Button
                type="button"
                size={"sm"}
                variant={"destructive"}
                onClick={() => {
                  const updatedFeatures =
                    form.getValues().features?.filter((_, i) => i !== index) ||
                    [];
                  form.setValue("features", updatedFeatures, {
                    shouldValidate: true,
                  });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="submit">Publish Gig</Button>
        </form>
      </Form>
    </div>
  );
}
