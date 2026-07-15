import { useState } from "react";
import styles from "./payment_prototype.module.css";

type PaymentMethod = "card" | "google-pay";

export function PaymentPrototype() {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handlePayment() {
    setIsProcessing(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsProcessing(false);
    setIsComplete(true);
  }

  function closeModal() {
    setIsOpen(false);

    window.setTimeout(() => {
      setIsComplete(false);
      setIsProcessing(false);
      setPaymentMethod("card");
    }, 200);
  }

  return (
    <>
      <button
        className={styles.checkoutTrigger}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Proceed to payment
      </button>

      {isOpen && (
        <div
          className={styles.paymentOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className={styles.paymentModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
          >
            <button
              className={styles.paymentClose}
              type="button"
              aria-label="Close"
              onClick={closeModal}
            >
              ×
            </button>

            {isComplete ? (
              <SuccessView onClose={closeModal} />
            ) : (
              <PaymentForm
                paymentMethod={paymentMethod}
                isProcessing={isProcessing}
                onPaymentMethodChange={setPaymentMethod}
                onPayment={handlePayment}
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}

type PaymentFormProps = {
  paymentMethod: PaymentMethod;
  isProcessing: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPayment: () => void;
};

function PaymentForm({
  paymentMethod,
  isProcessing,
  onPaymentMethodChange,
  onPayment,
}: PaymentFormProps) {
  const paymentMethodClassName = [
    styles.paymentMethod,
    paymentMethod === "card" ? styles.selected : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={styles.paymentHeader}>
        <div>
          <span className={styles.paymentEyebrow}>
            Order payment
          </span>

          <h2 id="payment-title">A$49.90</h2>
        </div>

        <div className={styles.paymentBrand}>
          <span>Powered by</span>
          <strong>stripe</strong>
        </div>
      </header>

      <div className={styles.orderSummary}>
        <div className={styles.productPreview}>P</div>

        <div className={styles.productDetails}>
          <strong>Pro subscription</strong>
          <span>1 month of access</span>
        </div>

        <strong>A$49.90</strong>
      </div>

      <div className={styles.expressCheckout}>
        <p>Express checkout</p>

        <button
          className={styles.googlePayButton}
          type="button"
          onClick={() => {
            onPaymentMethodChange("google-pay");
          }}
        >
          <GooglePayLogo />
        </button>
      </div>

      <div className={styles.separator}>
        <span>or pay by card</span>
      </div>

      <button
        className={paymentMethodClassName}
        type="button"
        onClick={() => {
          onPaymentMethodChange("card");
        }}
      >
        <span className={styles.radio}>
          {paymentMethod === "card" && <span />}
        </span>

        <span>Credit or debit card</span>

        <span className={styles.cardNetworks}>
          <span>VISA</span>
          <span>MC</span>
        </span>
      </button>

      {paymentMethod === "card" && (
        <div className={styles.cardForm}>
          <label>
            <span>Card details</span>

            <div className={styles.field}>
              <input
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                maxLength={19}
              />

              <span className={styles.fieldIcon}>▣</span>
            </div>
          </label>

          <div className={styles.fieldRow}>
            <label>
              <span>Expiry date</span>

              <input
                inputMode="numeric"
                placeholder="MM / YY"
                maxLength={7}
              />
            </label>

            <label>
              <span>CVC</span>

              <div className={styles.field}>
                <input
                  inputMode="numeric"
                  placeholder="CVC"
                  maxLength={4}
                />

                <span className={styles.fieldIcon}>?</span>
              </div>
            </label>
          </div>

          <label>
            <span>Name on card</span>
            <input placeholder="IVAN IVANOV" />
          </label>

          <label>
            <span>Country</span>

            <select defaultValue="AU">
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="KZ">Kazakhstan</option>
              <option value="RU">Russia</option>
              <option value="US">United States</option>
            </select>
          </label>
        </div>
      )}

      {paymentMethod === "google-pay" && (
        <div className={styles.googlePayPreview}>
          <div className={styles.googlePayPreviewIcon}>
            <GooglePayLogo />
          </div>

          <div>
            <strong>Google Pay selected</strong>

            <p>
              In the production version, the Google Pay payment
              sheet will open here.
            </p>
          </div>
        </div>
      )}

      <button
        className={styles.payButton}
        type="button"
        disabled={isProcessing}
        onClick={onPayment}
      >
        {isProcessing ? (
          <>
            <span className={styles.spinner} />
            Processing…
          </>
        ) : (
          "Pay A$49.90"
        )}
      </button>

      <p className={styles.paymentLegal}>
        By clicking the payment button, you agree to the terms
        of service and privacy policy.
      </p>
    </>
  );
}

function SuccessView({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className={styles.successView}>
      <div className={styles.successIcon}>✓</div>

      <span className={styles.paymentEyebrow}>
        Payment completed
      </span>

      <h2>Thank you for your purchase</h2>

      <p>
        This is a demonstration flow. No real payment was
        processed.
      </p>

      <button
        className={styles.payButton}
        type="button"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

function GooglePayLogo() {
  return (
    <span className={styles.googlePayLogo}>
      <span className={styles.googleG}>G</span>
      <span>Pay</span>
    </span>
  );
}