import React from 'react'
import RecentlySearch from '../../components/RecentlySearch'
import RecentlyView from '../../components/RecentlyView'

const Myhome = () => {
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2>My Home Page</h2>
        <RecentlySearch />
      </div>
      <hr />
      <RecentlyView />
    </div>
  )
}

export default Myhome
