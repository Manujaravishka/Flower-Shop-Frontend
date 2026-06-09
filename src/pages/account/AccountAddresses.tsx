import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const AccountAddresses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
          Addresses
        </h1>
        <p className="mt-1 text-muted-foreground">Saved delivery addresses for your orders.</p>
      </div>

      <Card className="border-cream-200/80 shadow-soft">
        <CardHeader>
          <CardTitle>Saved addresses</CardTitle>
          <CardDescription>Manage where your orders are delivered.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <MapPin className="w-10 h-10 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-muted-foreground">
              Address management is coming soon. For now, delivery details are collected at checkout.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountAddresses;
