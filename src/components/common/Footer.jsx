import React from "react";
import { Link } from "react-router-dom";
import {
  FaNewspaper,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeart,
} from "react-icons/fa";

/**
 * Footer Component
 * Displayed at the bottom of all pages
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const techStack =
    "React,js, Node.js, Express.js, MongoDB, Tailwind CSS , A Littel bit AI";

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaNewspaper className="text-3xl text-purple-500" />
              <span className="text-2xl font-bold">
                Daily<span className="text-purple-500">N</span>
              </span>
            </div>
            <p className="text-gray-400">
              Your trusted source for daily news and updates from around the
              world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/World"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  World News
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/Technology"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/Sports"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Popular Topics
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/topic/Business"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/Entertainment"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Entertainment
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/Health"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Health
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/Science"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 text-2xl transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 text-2xl transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 text-2xl transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 text-2xl transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Stay connected with us on social media for the latest updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {currentYear} Daily<span className="text-purple-500">N</span>
            . All rights reserved.
          </p>

          {/* Made with love attribution */}
          <div className="mt-3 flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-1 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by</span>
              <span className="text-purple-400 font-semibold bg-purple-900/30 px-2 py-1 rounded-lg border border-purple-700/50">
                Panuganti Lokeshwar
              </span>
            </div>

            {/* Tech Stack */}
            <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
              Built with {techStack}
            </div>
          </div>

          <div className="mt-4 space-x-4">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
