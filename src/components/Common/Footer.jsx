import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <p>ApplyGOAT &copy; {new Date().getFullYear()} | Auto Job Application Assistant</p>
      <div className="footer-links">
        <a href="#">Help</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </footer>
  )
}

export default Footer