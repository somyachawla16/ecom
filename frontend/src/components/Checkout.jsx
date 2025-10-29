import { useState } from "react";
import "./Checkout.css"
export default function Checkout() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Checkout failed");
      }

      const data = await response.json();
      console.log(data)
      setBill(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="checkout_container">
      <h2>Checkout</h2>


      {!bill && (
        <form className="checkout_form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Generate Bill"}
          </button>
        </form>
      )}


      {error && <p className="error_msg">{error}</p>}


      {bill && (
        <div className="bill_section">
          <h3>Bill Summary</h3>
          <p>
            <strong>Name:</strong> {bill.name}
          </p>
          <p>
            <strong>Email:</strong> {bill.email}
          </p>
          <table className="bill_table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {bill.cart[0]?.products.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productId}</td>
                  <td>{item.quantity}</td>
                  <td>Rs {item.amount/item.quantity}</td>
                  <td>Rs {item.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Total</strong></td>
                <td><strong>Rs {bill.cart[0].cartValue}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}



