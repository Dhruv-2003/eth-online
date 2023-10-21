"use client";

import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function CreateAccount() {
  return (
    <>
      <Tabs defaultValue="email" className="w-2/3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Account</TabsTrigger>
          <TabsTrigger value="social">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Card className="min-h-[300px]">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your email here. Click save when you&#39;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Email</Label>
                <Input type="email" id="email" placeholder="example@mail.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className=" w-full">Create Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="social">
          <Card className=" min-h-[300px]">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&#39;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-6">
                <Button className=" col-span-2" variant="outline">
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <div className=" col-span-2 relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button className=" col-span-2" variant="outline">
                  <Icons.discord className="mr-2 h-4 w-4" />
                  Discord
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* // dark:bg-fixed dark:bg-gradient-to-t to-[#070a12] via-[#0c0214]
      from-[#120131] */}
    </>
  );
}
