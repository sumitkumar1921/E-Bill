import Header from '../header/Header.jsx'
import './Demo.css'

export default function Demo({ onNavigate }) {
  return (
    <div className="demo-page">
      <Header onNavigate={onNavigate} />

      <section className="demo-hero" id="details">
        <div className="demo-copy">
          <p className="eyebrow">Book your free demo</p>
          <h1>Get a personalized product walkthrough in 15 minutes</h1>
          <p className="demo-intro">
            Learn how MyInvoiceBook can simplify your billing, inventory, and collections workflow with a tailored demo.
          </p>
          <ul className="demo-features">
            <li>How to check your daily hisab-kitab in 15 minutes</li>
            <li>How to rotate stock up to 3x faster</li>
            <li>How to collect 97% payments before due dates</li>
          </ul>
          <div className="testimonial-card">
            <p className="quote">“Great demo. Neha helped me understand how mybillbook can simplify my billing, stock management and collections in detail.”</p>
            <div className="testimonial-author">
              <img src="https://via.placeholder.com/56" alt="Vikas Sharma" />
              <div>
                <p className="name">Vikas Sharma</p>
                <p className="role">Electricals Distributor, Delhi</p>
              </div>
            </div>
          </div>
          <p className="trusted-copy">Trusted by more than 1 Crore+ businesses</p>
        </div>

        <div className="demo-form-card">
          <div className="demo-form-header">
            <h2>Book your free demo</h2>
            <p>Fill the form and our expert will contact you shortly.</p>
          </div>
          <form className="demo-form">
            <div className="form-grid-two">
              <label>
                Your Name *
                <input type="text" placeholder="Enter your name" />
              </label>
              <label>
                Mobile Number *
                <input type="tel" placeholder="Enter your 10-digit mobile number" />
              </label>
            </div>
            <div className="form-grid-two">
              <label>
                Email ID *
                <input type="email" placeholder="Enter your email id" />
              </label>
              <label>
                Nature of your Enquiry *
                <select>
                  <option>Select enquiry type</option>
                  <option>Billing software</option>
                  <option>Inventory management</option>
                  <option>Full product demo</option>
                </select>
              </label>
            </div>
            <div className="radio-group">
              <p>Are you currently using any billing software? *</p>
              <label><input type="radio" name="billing-software" /> Yes</label>
              <label><input type="radio" name="billing-software" /> No</label>
            </div>
            <label>
              Select your billing requirement *
              <select>
                <option>Basic billing on android app</option>
                <option>Billing, Stock keeping, Collections on laptop & app</option>
              </select>
            </label>
            <label>
              Size of your business? *
              <select>
                <option>More Than 5 crore</option>
                <option>1 crore to 5 crore</option>
                <option>40 lakhs to 1 crore</option>
                <option>Less than 40 lakhs</option>
              </select>
            </label>
            <label>
              What language do you like to talk in? *
              <select>
                <option>Select language</option>
                <option>English</option>
                <option>हिंदी</option>
              </select>
            </label>
            <button type="button" className="button-primary demo-submit">Submit</button>
          </form>
        </div>
      </section>
    </div>
  )
}
