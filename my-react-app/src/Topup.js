import React from 'react'

const Topup = () => {
  return (
    <div className="file-management">
        <div className="paper-size">
          <h3>Top Up </h3>
          <input
            type="radio"
            name="size"
            value="Long"
            id="long"
            onChange={() => setSize('Long')}
          />
          <label htmlFor="long">10</label>
          <input
            type="radio"
            name="size"
            value="Short"
            id="short"
            onChange={() => setSize('Short')}
          />
          <label htmlFor="short">20</label>
          <input
            type="radio"
            name="size"
            value="Short"
            id="short"
            onChange={() => setSize('Short')}
          />
          <label htmlFor="short">50</label>
          <input
            type="radio"
            name="size"
            value="Short"
            id="short"
            onChange={() => setSize('Short')}
          />
          <label htmlFor="short">100</label>
        </div>
    </div>
  )
}

export default Topup;
