import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Home.css";
import Images from "../../../projectImages/projectImages";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";

const Home = () => {
  return (
    <div>
      <Header />
      <div className="splash-container">
        <div className="splash">
          <h1 className="splash-head">WEB CHAT APP</h1>
          <p className="splash-subhead">Let's talk with our loved ones.</p>
          <div id="custom-button-wrapper">
            <Link to="/login">
              <div className="my-super-cool-btn">
                <div className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <span className="buttoncooltext">Get Started</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="content">
          <h2 className="content-head is-center">
            Features of WebChat Application
          </h2>
          <div className="Appfeatures">
            <div className="contenthead">
              <h3 className="content-subhead">
                <i className="fa fa-rocket" />
                Get Started Quickly
              </h3>
              <p>
                Just register yourself with this app and chat your loved ones
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">
                <i className="fa fa-sign-in" />
                Firebase Authentication
              </h3>
              <p> Firebase authentication has been implemented in this app</p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">
                <i className="fa fa-th-large" />
                Media
              </h3>
              <p>
                You can share images with your friends for better experience
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">
                <i className="fa fa-refresh" />
                Updates
              </h3>
              <p>
                We will working with new features for this app for better
                experience in future
              </p>
            </div>
          </div>
        </div>
        <Element id="about-us" name="about-us">
          <div className="AppfeaturesFounder">
            <div className="l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <img
                width="300"
                alt="File Icons"
                className="pure-img-responsive"
                src={Images.rashid}
              />
            </div>

            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
              <h2 className="content-head content-head-ribbon">
                Rashid Naveed
              </h2>
              <p style={{ color: "white" }}>The Developer of WebChat</p>
              <p style={{ color: "white" }}>
                Currently working in Kiectro and busy to explore new ideas with
                new technologies
              </p>
            </div>
          </div>
        </Element>
        <div className="content">
          <h2 className="content-head is-center">Who I'm?</h2>
          <div className="Appfeatures">
            <div className="l-box-lrg pure-u-1 pure-u-md-2-5">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <label htmlFor="name">You Name</label>
                  <input id="name" type="text" placeholder="Your Name" />

                  <label htmlFor="email">You Email</label>
                  <input id="email" type="email" placeholder="Your Email" />

                  <label htmlFor="password">You Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Your Password"
                  />
                  <button type="submit" className="pure-button">
                    Sign Up
                  </button>
                </fieldset>
              </form>
            </div>
            <Element id="contact-us" name="contact-us">
              <div className="l-box-lrg pure-u-1 pure-u-md-3-5">
                <h4>Contact Me</h4>
                <p>
                  For any suggestion you can directly contact me on LinkedIn:
                  <a href="https://www.linkedin.com/in/rashidnaveedch">
                    https://www.linkedin.com/in/rashidnaveedch
                  </a>
                </p>
                <p>
                  FaceBook:{" "}
                  <a href="https://www.facebook.com/rashidnaveed2295">
                    https://www.facebook.com/rashidnaveed2295
                  </a>
                </p>
                <p>
                  Twitter:{" "}
                  <a href="https://twitter.com/ChRashid95?s=09">
                    https://twitter.com/ChRashid95?s=09
                  </a>
                </p>
                <h4>More Information</h4>
                <p>To whom it may concern</p>
                <p>
                  This App is developed for learning purpose - Developed by
                  -Rashid Naveed
                </p>
              </div>
            </Element>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
