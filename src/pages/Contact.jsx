import { useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const Contact = () => {

  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [userData, setUserData] = useState(true);

  const { user } = useAuth();

  if (user && userData) {
    setContact({
      ...contact,
      username: user.username,
      email: user.email,
    });
    setUserData(false);
  }

  //tackle contact form input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact,
     [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/form/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setContact({ username: user.username, email: user.email, message: "" });
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <>
    <section className="section-contact">
      <div className="container">
        <h1 className="main-heading">contact us</h1>
      </div>
      <div className="container grid grid-two-column">
        <div className="contact-img">
          <img src="./images/contact.png" alt="contact" />
        </div>
        <div className="section-form">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">username</label>
              <input type="text" name="username"
               id="username" 
               placeholder="Enter your name"
               required
               autoComplete="off"
               value={contact.username}
                onChange={handleInput}
              />
            </div>
            <div>
              <label htmlFor="email">email</label>
              <input type="email" name="email"
               id="email"
               placeholder="Enter your email"
               required
               autoComplete="off"
               value={contact.email}
               onChange={handleInput}
              />
            </div>

            <div>
              <label htmlFor="message">message</label>
              <textarea name="message" id="message" cols="30" rows="6"
               autoComplete="off"
               value={contact.message}
               onChange={handleInput}
               placeholder="Enter your message"
               required
              ></textarea>
            </div>
            <button className="btn">send message</button>
          </form>

        </div>
      </div>
    </section>
    </>
  )
};
