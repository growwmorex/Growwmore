"use client";

import Nav from "@/components/Nav";
import LuxuryBackground from "@/components/LuxuryBackground";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { memberRef, type Member } from "@/lib/user";
import { withFirestoreRetry } from "@/lib/firestoreRetry";
import { BRAND, PACKAGES, isAdminEmail } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const search = useSearchParams();

  const packageId = search.get("package") || "";

  const [member, setMember] = useState<Member | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (isAdminEmail(user.email)) {
        router.replace("/admin-gateway");
        return;
      }

      const googleVerified = user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );

      if (!user.emailVerified && !googleVerified) {
        router.replace("/products");
        return;
      }

      try {
        const snap = await withFirestoreRetry(() =>
          getDoc(memberRef(user.uid))
        );

        if (!snap.exists()) {
          router.replace("/products");
          return;
        }

        const data = snap.data() as Member;

        if (data.paymentStatus === "approved") {
          router.replace("/dashboard");
          return;
        }

        if (!packageId && !data.packageId) {
          router.replace("/products");
          return;
        }

        setMember(data);
      } catch {
        setMessage(
          "We could not load your secure checkout. Refresh once and try again."
        );
      } finally {
        setLoading(false);
      }
    });
  }, [router, packageId]);

  const selected =
    PACKAGES.find((item) => item.id === packageId) ||
    PACKAGES.find((item) => item.id === member?.packageId);

  if (loading) {
    return (
      <main className="shell center">
        <LuxuryBackground />
        Preparing your secure Growwmore checkout…
      </main>
    );
  }

  if (!selected) {
    return (
      <main className="shell center">
        <LuxuryBackground />
        <div className="panel">
          <div className="eyebrow">Package required</div>
          <h2>Select a package first.</h2>
          <p className="sub">
            Your checkout needs a valid Growwmore collection before payment can
            continue.
          </p>
          <button className="btn" onClick={() => router.replace("/products")}>
            Return to package selection →
          </button>
        </div>
      </main>
    );
  }

  async function submitPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!auth.currentUser || !member || submitting) return;

    const chosen = selected;
    if (!chosen) return;

    const form = new FormData(e.currentTarget);
    const utr = String(form.get("utr") || "").trim();

    if (utr.length < 6) {
      setMessage("Enter a valid UTR / transaction reference.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await withFirestoreRetry(() =>
        updateDoc(memberRef(auth.currentUser!.uid), {
          paymentStatus: "pending",
          packageId: chosen.id,
          packagePrice: chosen.price,
          commission: chosen.commission,
          utr,
          updatedAt: serverTimestamp()
        })
      );

      await withFirestoreRetry(() =>
        setDoc(doc(db, "payments", auth.currentUser!.uid), {
          uid: auth.currentUser!.uid,
          email: auth.currentUser!.email,
          packageId: chosen.id,
          amount: chosen.price,
          utr,
          status: "pending",
          createdAt: serverTimestamp()
        })
      );

      setMember({
        ...member,
        paymentStatus: "pending",
        packageId: chosen.id,
        packagePrice: chosen.price,
        commission: chosen.commission,
        utr
      });

      setMessage(
        "Payment reference submitted successfully. Founder verification is now pending."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Payment submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const pending = member?.paymentStatus === "pending";

  return (
    <main className="shell checkoutPage">
      <LuxuryBackground />
      <Nav />

      <section className="checkoutHero premiumCheckoutHero">
        <div className="eyebrow">Secure Growwmore checkout</div>

        <h1>
          Your collection is selected.
          <br />
          Complete payment safely.
        </h1>

        <p>
          Review the products inside your selected package, pay the exact amount
          using the official Growwmore UPI details, then submit your UTR for
          founder verification.
        </p>

        <div className="checkoutTrustRow">
          <span>Official UPI only</span>
          <span>Manual founder verification</span>
          <span>No OTP/PIN requested</span>
          <span>Dashboard after approval</span>
        </div>
      </section>

      <section className="premiumCheckoutGrid">
        <article className="checkoutOrderCard premiumCheckoutCard">
          <div className="checkoutStep">01 · ORDER SUMMARY</div>

          <div className="checkoutProductHero">
            <div className="checkoutProductMark">G</div>

            <div>
              <span>{selected.label}</span>
              <h2>{selected.name}</h2>
              <p>{selected.note}</p>
            </div>
          </div>

          <div className="checkoutIncludedBox">
            <div className="checkoutIncludedHead">
              <span>WHAT YOU RECEIVE</span>
              <small>{selected.includes.length} item(s)</small>
            </div>

            {selected.includes.map((item, index) => (
              <div className="checkoutIncludedItem" key={item}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="checkoutPriceBlock">
            <div>
              <span>Total payable</span>
              <small>One-time selected package purchase</small>
            </div>

            <strong>₹{selected.price.toLocaleString("en-IN")}</strong>
          </div>

          <div className="checkoutCommissionNote">
            <span>Published future referral commission</span>
            <b>₹{selected.commission.toLocaleString("en-IN")}</b>
            <small>
              Applicable only after account activation and eligible approved
              referrals under Growwmore terms.
            </small>
          </div>

          {!pending && (
            <button
              className="btn ghost checkoutChangeBtn"
              type="button"
              onClick={() => router.push("/products")}
            >
              ← Change package
            </button>
          )}
        </article>

        <article className="checkoutPaymentCard premiumCheckoutCard">
          <div className="checkoutStep">02 · OFFICIAL PAYMENT DETAILS</div>

          <div className="premiumQrPanel">
            <div className="qrGlow">
              <img
                src="/upi-payment-qr.png"
                alt="Growwmore official UPI payment QR code"
              />
            </div>

            <div className="qrText">
              <span>SCAN WITH ANY UPI APP</span>
              <h3>Pay ₹{selected.price.toLocaleString("en-IN")}</h3>
              <p>
                Use only the UPI details shown on this official Growwmore
                checkout page.
              </p>
            </div>
          </div>

          <div className="paymentDetailList">
            <div>
              <span>UPI ID</span>
              <b>{BRAND.upiId}</b>
            </div>

            <div>
              <span>PAYMENT NUMBER</span>
              <b>{BRAND.paymentPhone}</b>
            </div>

            <div>
              <span>SUPPORT PHONE</span>
              <b>{BRAND.supportPhone}</b>
            </div>

            <div>
              <span>SUPPORT EMAIL</span>
              <b>{BRAND.supportEmail}</b>
            </div>
          </div>

          <div className="securityNotice">
            <b>Payment safety</b>
            <p>
              Growwmore never asks for your UPI PIN, OTP, CVV, card PIN,
              banking password or screen-sharing access.
            </p>
          </div>
        </article>
      </section>

      {!pending ? (
        <form
          className="panel checkoutSubmit premiumCheckoutSubmit"
          onSubmit={submitPayment}
        >
          <div className="checkoutStep">03 · CONFIRM TRANSACTION</div>

          <h2>Submit your payment reference.</h2>

          <p className="sub">
            After paying exactly ₹{selected.price.toLocaleString("en-IN")},
            enter the UTR / transaction reference generated by your payment app.
          </p>

          <div className="field">
            <label>UTR / TRANSACTION REFERENCE</label>
            <input
              name="utr"
              required
              minLength={6}
              maxLength={100}
              autoComplete="off"
              placeholder="Example: 425678912345"
            />
          </div>

          <div className="checkoutSubmitFooter">
            <small>
              Founder verification is manual. Dashboard access unlocks only
              after the payment is approved.
            </small>

            <button className="btn" disabled={submitting}>
              {submitting
                ? "Submitting for verification…"
                : "Submit payment for verification →"}
            </button>
          </div>
        </form>
      ) : (
        <section className="panel pendingPanel premiumPendingPanel">
          <div className="pendingIcon">
            <span />
          </div>

          <div className="eyebrow">Founder verification pending</div>

          <h2>Your payment reference has been received.</h2>

          <p>
            Growwmore will verify the transaction before activating your member
            dashboard. You can safely leave this page and sign in again later.
          </p>

          <div className="pendingOrderSummary">
            <div>
              <span>Selected package</span>
              <b>{selected.name}</b>
            </div>

            <div>
              <span>Amount</span>
              <b>₹{selected.price.toLocaleString("en-IN")}</b>
            </div>

            <div>
              <span>Status</span>
              <b>Pending verification</b>
            </div>
          </div>
        </section>
      )}

      {message && (
        <div className="checkoutMessage">
          {message}
        </div>
      )}
    </main>
  );
}
