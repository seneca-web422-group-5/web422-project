import React from 'react'
import { Link } from 'react-router-dom'

const JoinUs = () => {
  return (
    <div className="bg-secondary text-center py-5 mt-4">
      <h2>Join Us and Add Your Favourite Recipes</h2>
      <p>Sign up or Login to unlock new features</p>
      <Link to="/auth/signup" className="btn btn-primary">
        SIGN UP
      </Link>
    </div>
  )
}

export default JoinUs
