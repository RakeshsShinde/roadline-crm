import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
              SB
            </div>
            <span className="text-xl font-bold text-foreground">SplitBill</span>
          </div>
          <div className="flex gap-3">
            <Link to="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
          Split Bills With Friends Easily
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-balance">
          Keep track of shared expenses and settle debts instantly. Perfect for
          roommates, trips, and group activities.
        </p>

        {/* Features Grid */}
        <div className="mt-20 w-full max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-semibold mb-2 text-foreground">
                Easy Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Log expenses and automatically calculate who owes whom
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="font-semibold mb-2 text-foreground">Groups</h3>
              <p className="text-sm text-muted-foreground">
                Create groups for different situations and manage members
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-semibold mb-2 text-foreground">Settlement</h3>
              <p className="text-sm text-muted-foreground">
                See balances and settle up with just a few clicks
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold mb-2 text-foreground">History</h3>
              <p className="text-sm text-muted-foreground">
                View complete expense history and settlement records
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2 text-foreground">Mobile</h3>
              <p className="text-sm text-muted-foreground">
                Access your bills anytime, anywhere on any device
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold mb-2 text-foreground">Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your data is safe with secure authentication and encryption
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-primary/10 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to simplify expense sharing?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing shared expenses
            with SplitBill.
          </p>
          <Link to="/sign-up">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>
            © 2026 SplitBill. All rights reserved. |{" "}
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>{" "}
            |{" "}
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
