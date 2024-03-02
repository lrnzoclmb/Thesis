import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import firebase from './firebase'

const Homepage = () => {
  return (
    <div>
      <p>Get started <Link to="/FileManagement">Uploading</Link></p>
    </div>

  )
}

export default Homepage