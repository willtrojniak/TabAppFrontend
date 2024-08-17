import { useAuth } from "@/providers/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export function UserCard() {
  const { user } = useAuth();

  return user ? <Card>
    <CardHeader>
      <CardDescription>Signed in as</CardDescription>
      <Link to={"/profile"}><CardTitle className="flex gap-2">{user.preferred_name ?? user.name} <ExternalLink /></CardTitle></Link>
    </CardHeader>
  </Card>
    :
    <Link to="/login" search={{ redirect: location.pathname }}><Button variant={"link"}> Sign in</Button></Link>
}
