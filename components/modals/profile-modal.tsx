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
import { Gender } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  bannerImage: z.optional(z.string()),
  description: z.optional(z.string()),
  status: z.optional(z.string()),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.SECRET]),
});

const ProfileModal = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const { update } = useSession();

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const user = useCurrentUser();

  const isModalOpen = isOpen && type === 'profile';

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannerImage: '',
      description: '',
      status: '',
      gender: user?.gender || Gender.SECRET,
    },
  });

  useEffect(() => {
    if (user?.gender) {
      form.setValue('gender', user.gender);
    }
    if (user?.bannerImage) {
      form.setValue('bannerImage', user.bannerImage);
    }
    if (user?.description) {
      form.setValue('description', user.description);
    }
    if (user?.status) {
      form.setValue('status', user.status);
    }
  }, [form, isOpen, user?.bannerImage, user?.description, user?.gender, user?.status]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
            Edit Profile
          </DialogTitle>
          <DialogDescription
            className="
          text-center
          text-zinc-500
          ">
            Here you can edit your profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div
              className="
            space-y-8
            px-6
            ">
              <FormField
                control={form.control}
                name="status"
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
                      Status
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
                        placeholder="Looking for inspiration..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                className="
                flex
                items-center
                ">
                <FormField
                  control={form.control}
                  name="bannerImage"
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
                        Banner Image
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          endpoint="bannerImage"
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
                name="gender"
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
                      Gender
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl
                        className='  bg-zinc-300/50
                        border-0
                        focus-visible:ring-0
                        focus-visible:ring-offset-0
                        text-zinc-500
                        dark:text-secondary/70
                        "'>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.SECRET}>Secret</SelectItem>
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
                    <FormLabel
                      className="
                    uppercase 
                    text-xs
                    font-bold
                    text-zinc-500
                    dark:text-secondary/70
                    ">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        disabled={isPending}
                        className="
                        resize-none
                        bg-zinc-300/50
                        border-0
                        focus-visible:ring-0
                        text-black
                        focus-visible:ring-offset-0
                        "
                        placeholder="An expert on caffeine science and a repository of unnecessary facts."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default ProfileModal;
