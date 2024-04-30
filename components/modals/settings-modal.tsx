'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { useEffect, useState, useTransition } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { settings } from '@/actions/settings';
import { useSession } from 'next-auth/react';
import { Switch } from '../ui/switch';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { SettingsSchema } from '@/schemas';

const formSchema = z
  .object({
    image: z.optional(z.string()),
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    },
  );

const SettingsModal = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { update } = useSession();

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const user = useCurrentUser();

  const isModalOpen = isOpen && type === 'settings';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: '',
      name: '',
      email: '',
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: false,
    },
  });

  useEffect(() => {
    if (user?.image) {
      form.setValue('image', user.image);
    }
    if (user?.name) {
      form.setValue('name', user.name);
    }
    if (user?.email) {
      form.setValue('email', user.email);
    }
    if (user?.isTwoFactorEnabled) {
      form.setValue('isTwoFactorEnabled', user.isTwoFactorEnabled);
    }
  }, [user?.image, form, isOpen, user?.name, user?.email, user?.isTwoFactorEnabled]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            router.refresh();
            setSuccess(data.success);
          }
        })
        .catch(() => setError('Something went wrong!'));
    });
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="
    bg-white 
    text-black 
    p-0 
    overflow-hidden">
        <DialogHeader
          className="
       pt-8
       px-6
       ">
          <DialogTitle
            className="
        text-2xl
        text-center
        font-bold
        ">
            Settings
          </DialogTitle>
          <DialogDescription
            className="
          text-center
          text-zinc-500
          ">
            Change your settings here to make your experience even more comfortable and tailored to
            you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div
              className="
            space-y-8
            px-6
            ">
              <div
                className="
                flex
                items-center
                justify-center
                text-center
                ">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="avatarImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="
                    uppercase 
                    text-xs
                    font-bold
                    text-zinc-500
                    dark:text-secondary/70
                    ">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="
                        bg-zinc-300/50
                        border-0
                        focus-visible:ring-0
                        text-black
                        focus-visible:ring-offset-0
                        "
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="
                    uppercase 
                    text-xs
                    font-bold
                    text-zinc-500
                    dark:text-secondary/70
                    ">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={isPending}
                            className="
                        bg-zinc-300/50
                        border-0
                        focus-visible:ring-0
                        text-black
                        focus-visible:ring-offset-0
                        "
                            placeholder="johndoe@mail.com"
                            {...field}
                          />
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
                        <FormLabel
                          className="
                    uppercase 
                    text-xs
                    font-bold
                    text-zinc-500
                    dark:text-secondary/70
                    ">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isPending}
                            className="
                        bg-zinc-300/50
                        border-0
                        focus-visible:ring-0
                        text-black
                        focus-visible:ring-offset-0
                        "
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="
                    uppercase 
                    text-xs
                    font-bold
                    text-zinc-500
                    dark:text-secondary/70
                    ">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isPending}
                            className="
                        bg-zinc-300/50
                        border-0
                        focus-visible:ring-0
                        text-black
                        focus-visible:ring-offset-0
                        "
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="
                    uppercase 
                    text-xs
                    font-bold
                    text-zinc-500
                    dark:text-secondary/70
                    ">
                          Two Factor Authentication
                        </FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <DialogFooter
              className="
            bg-gray-100
            px-6
            py-4
            ">
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button variant={'primary'} disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
