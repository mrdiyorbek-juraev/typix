import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Switch,
} from "@typix-editor/ui";

const meta: Meta = {
  title: "UI/Card",
  parameters: { layout: "centered" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--foreground)",
            }}
          >
            Name
          </label>
          <input
            placeholder="My awesome project"
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              fontSize: 13,
              background: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
      </CardContent>
      <CardFooter style={{ justifyContent: "flex-end", gap: 8 }}>
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const Notification: StoryObj = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { title: "Your call has been confirmed.", time: "1 hour ago" },
            { title: "You have a new message!", time: "1 hour ago" },
            {
              title: "Your subscription is expiring soon.",
              time: "2 hours ago",
            },
          ].map(({ title, time }) => (
            <div
              key={title}
              style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  marginTop: 4,
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--foreground)",
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "var(--muted-foreground)",
                    marginTop: 2,
                  }}
                >
                  {time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          Mark all as read
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Settings: StoryObj = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CardTitle>Account settings</CardTitle>
          <Badge variant="secondary">Pro</Badge>
        </div>
        <CardDescription>Manage your account preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              label: "Email notifications",
              desc: "Receive updates via email",
              on: true,
            },
            {
              label: "Marketing emails",
              desc: "News and promotions",
              on: false,
            },
            {
              label: "Security alerts",
              desc: "Login and access alerts",
              on: true,
            },
          ].map(({ label, desc, on }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--foreground)",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--muted-foreground)",
                    marginTop: 2,
                  }}
                >
                  {desc}
                </div>
              </div>
              <Switch defaultChecked={on} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};
