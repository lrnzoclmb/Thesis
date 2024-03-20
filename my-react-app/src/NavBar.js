import React from 'react'
import { Link  } from 'react-router-dom'
import './nav.css'

const NavBar = () => {
  return (
    <div>
        <nav>
          <ul>
            <li>
              <Link to="/Homepage" className='tab'>Home</Link>
            </li>
            <li>
              <Link to="/FileManagement" className='tab'>File Uploading</Link>
            </li>
            <li>
              <Link to="/Topup" className='tab' >Top Up</Link>
            </li>
            <li>
              <Link to="/Account" className='tab' >Account</Link>
            </li>
          </ul>
        </nav>
    </div>

  )
}

export default NavBar