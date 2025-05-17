import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-12 md:py-16 bg-muted/30">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                HealthConnect
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered healthcare appointment booking system designed
              specifically for Bangladesh
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors group relative"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Facebook
                </span>
                <Facebook className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors group relative"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Twitter
                </span>
                <Twitter className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors group relative"
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Instagram
                </span>
                <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/find-doctor"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link
                  href="/symptom-checker"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Appointments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=123+Medical+Center+Road,+Dhaka,+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  123 Medical Center Road, Dhaka, Bangladesh
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2 shrink-0" />
                <a
                  href="tel:+8801234567890"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +880 1234 567890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 shrink-0" />
                <a
                  href="mailto:support@healthconnect.bd"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  support@healthconnect.bd
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HealthConnect Bangladesh. All
            rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
