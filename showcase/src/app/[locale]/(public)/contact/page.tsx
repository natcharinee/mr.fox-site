"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitContactForm } from "@/lib/contact/actions";

type ContactState = { submitted?: boolean; error?: string } | null;

async function contactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  try {
    await submitContactForm(formData);
    return { submitted: true };
  } catch {
    return { error: "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }
}

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(contactAction, null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-muted-foreground">
        ติดต่อ Mr.FOX — Business Inquiry · Partnership · Support
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ส่งข้อความ</CardTitle>
            <CardDescription>
              กรอกแบบฟอร์มด้านล่าง ทีมงานจะติดต่อกลับภายใน 2–3 วันทำการ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.submitted ? (
              <p className="text-sm font-medium text-primary">
                ขอบคุณ! เราได้รับข้อความของคุณแล้ว
              </p>
            ) : (
              <form action={formAction} className="space-y-4">
                {state?.error ? (
                  <p className="text-sm text-destructive">{state.error}</p>
                ) : null}
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    ชื่อ
                  </label>
                  <Input id="name" name="name" required className="mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    อีเมล
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium">
                    หัวข้อ
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="general">ทั่วไป</option>
                    <option value="business">Business Inquiry</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium">
                    ข้อความ
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <Button type="submit" disabled={pending}>
                  {pending ? "กำลังส่ง..." : "ส่งข้อความ"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Inquiry</CardTitle>
              <CardDescription>สนใจใช้แพลตฟอร์ม Mr.FOX สำหรับองค์กร</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Partnership</CardTitle>
              <CardDescription>ร่วมพัฒนา ecosystem กับ Mr.FOX</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Social</CardTitle>
              <CardDescription>
                Facebook · Instagram · TikTok · YouTube · LinkedIn
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
