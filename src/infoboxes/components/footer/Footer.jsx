import './Footer.css'
import lastUpdatedData from '../../../lastUpdated.json';

export default function Footer() {
  const lastUpdated = new Date(lastUpdatedData.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <footer>
      <p>Last updated on {lastUpdated}</p>
      <div>
        <a 
          href="https://github.com/Ishancorp/wikipedia-infobox-builder" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          See Source Code
        </a>
      </div>
    </footer>
  )
}